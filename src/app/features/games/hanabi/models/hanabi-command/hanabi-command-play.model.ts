import {HanabiGame} from "../hanabi-game.model";
import {HanabiPlayer} from "../hanabi-player.model";
import {HanabiCommand} from "./internal";
import {HanabiCard} from "../hanabi-card.model";

export class HanabiCommandPlay extends HanabiCommand {

  readonly target: HanabiPlayer;
  readonly card: HanabiCard;
  readonly index: number;

  constructor(builder: Builder) {
    super(HanabiCommand.Type.PLAY);
    this.target = builder.target;
    this.card = builder.card;
    this.index = builder.index;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiCommandPlay {
    return HanabiCommandPlay.builder().build();
  }

  static copy(copy: HanabiCommandPlay): Builder {
    return HanabiCommandPlay.builder()
      .withTarget(copy.target)
      .withCard(copy.card)
      .withIndex(copy.index)
  }

  static override fromJson(json: any): HanabiCommandPlay {
    return HanabiCommandPlay.builder()
      .withTarget(HanabiPlayer.fromJson(json.target))
      .withCard(HanabiCard.fromJson(json.card))
      .withIndex(json.index)
      .build();
  }

  update(game: HanabiGame): HanabiGame {
    const nextPlayer = game.nextPlayer();
    const cardToDraw = game.drawPile.last();
    const isValidCardToPlay = game.isValidCardToPlay(this.card);

    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withPlaying(p.equals(nextPlayer))
        .withCards(p.equals(this.target)
          ? (cardToDraw
               ? p.cards.remove(this.index).insert(0, cardToDraw)
               : p.cards.remove(this.index))
          : p.cards)
        .build()))
      .withBoard(isValidCardToPlay ? game.board.push(this.card) : game.board)
      .withDrawPile(game.drawPile.remove(-1))
      .withDiscardPile(isValidCardToPlay ? game.discardPile : game.discardPile.push(this.card))
      .withBombs(game.bombs + (isValidCardToPlay ? 0 : 1))
      .build();
  }

  revert(game: HanabiGame): HanabiGame {
    const previousPlayer = game.previousPlayer();
    const cardToReturn = game.players.find(p => p.equals(this.target))?.cards.first();
    if (!cardToReturn) throw new Error(`No card to return to draw pile`);
    const wasValidCardToPlay = game.board.some(c => c.equals(this.card));

    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withPlaying(p.equals(previousPlayer))
        .withCards(p.equals(this.target)
          ? p.cards.remove(0).insert(this.index, this.card)
          : p.cards)
        .build()))
      .withBoard(wasValidCardToPlay ? game.board.remove(-1) : game.board)
      .withDrawPile(game.drawPile.push(cardToReturn))
      .withDiscardPile(wasValidCardToPlay ? game.discardPile : game.discardPile.remove(-1))
      .withBombs(game.bombs - (wasValidCardToPlay ? 0 : 1))
      .build();
  }

  checkError(game: HanabiGame): string {
    return '';
  }

}

export namespace HanabiCommandPlay {

}

class Builder {
  target: HanabiPlayer = HanabiPlayer.empty();
  card: HanabiCard = HanabiCard.empty();
  index: number = 0;

  withTarget(target: HanabiPlayer): Builder {
    this.target = target;
    return this;
  }

  withCard(card: HanabiCard): Builder {
    this.card = card;
    return this;
  }

  withIndex(index: number): Builder {
    this.index = index;
    return this;
  }

  build(): HanabiCommandPlay {
    return new HanabiCommandPlay(this);
  }
}
