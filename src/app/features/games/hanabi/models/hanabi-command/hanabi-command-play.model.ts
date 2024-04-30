import {HanabiGame} from "../hanabi-game.model";
import {HanabiPlayer} from "../hanabi-player.model";
import {HanabiCommand} from "./internal";
import {HanabiCard} from "../hanabi-card.model";

export class HanabiCommandPlay extends HanabiCommand {

  readonly source: HanabiPlayer;
  readonly card: HanabiCard;
  readonly index: number;

  constructor(builder: Builder) {
    super(HanabiCommand.Type.PLAY);
    this.source = builder.source;
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
      .withSource(copy.source)
      .withCard(copy.card)
      .withIndex(copy.index)
  }

  static override fromJson(json: any): HanabiCommandPlay {
    return HanabiCommandPlay.builder()
      .withSource(HanabiPlayer.fromJson(json.source))
      .withCard(HanabiCard.fromJson(json.card))
      .withIndex(json.index)
      .build();
  }

  fill(game: HanabiGame): HanabiCommandPlay {
    return this;
  }

  update(game: HanabiGame): HanabiGame {
    const cardToDraw = game.drawPile.last();
    const isCardValidToPlay = game.isCardValidToPlay(this.card);

    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withCards(p.equals(this.source)
          ? (cardToDraw
               ? p.cards.remove(this.index).insert(0, cardToDraw)
               : p.cards.remove(this.index))
          : p.cards)
        .build()))
      .withBoard(isCardValidToPlay ? game.board.push(this.card) : game.board)
      .withDrawPile(game.drawPile.remove(-1))
      .withDiscardPile(isCardValidToPlay ? game.discardPile : game.discardPile.push(this.card))
      .withBombs(game.bombs + (isCardValidToPlay ? 0 : 1))
      .build()
      .nextTurn();
  }

  revert(game: HanabiGame): HanabiGame {
    const cardToReturn = game.players.find(p => p.equals(this.source))?.cards.first();
    if (!cardToReturn) throw new Error(`No card to return to draw pile`);
    const wasCardValidToPlay = game.board.some(c => c.equals(this.card));

    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withCards(p.equals(this.source)
          ? p.cards.remove(0).insert(this.index, this.card)
          : p.cards)
        .build()))
      .withBoard(wasCardValidToPlay ? game.board.remove(-1) : game.board)
      .withDrawPile(game.drawPile.push(cardToReturn))
      .withDiscardPile(wasCardValidToPlay ? game.discardPile : game.discardPile.remove(-1))
      .withBombs(game.bombs - (wasCardValidToPlay ? 0 : 1))
      .build()
      .previousTurn();
  }

  checkError(game: HanabiGame): string {
    return '';
  }

}

export namespace HanabiCommandPlay {

}

class Builder {
  source: HanabiPlayer = HanabiPlayer.empty();
  card: HanabiCard = HanabiCard.empty();
  index: number = 0;

  withSource(source: HanabiPlayer): Builder {
    this.source = source;
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
