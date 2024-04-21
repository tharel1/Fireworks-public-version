import {HanabiGame} from "../hanabi-game.model";
import {HanabiPlayer} from "../hanabi-player.model";
import {HanabiCommand} from "./internal";
import {HanabiCard} from "../hanabi-card.model";

export class HanabiCommandDiscard extends HanabiCommand {

  readonly target: HanabiPlayer;
  readonly card: HanabiCard;
  readonly index: number;

  constructor(builder: Builder) {
    super(HanabiCommand.Type.DISCARD);
    this.target = builder.target;
    this.card = builder.card;
    this.index = builder.index;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiCommandDiscard {
    return HanabiCommandDiscard.builder().build();
  }

  static copy(copy: HanabiCommandDiscard): Builder {
    return HanabiCommandDiscard.builder()
      .withTarget(copy.target)
      .withCard(copy.card)
      .withIndex(copy.index)
  }

  static override fromJson(json: any): HanabiCommandDiscard {
    return HanabiCommandDiscard.builder()
      .withTarget(HanabiPlayer.fromJson(json.target))
      .withCard(HanabiCard.fromJson(json.card))
      .withIndex(json.index)
      .build();
  }

  update(game: HanabiGame): HanabiGame {
    const nextPlayer = game.nextPlayer();
    const cardToDraw = game.drawPile.last();

    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withPlaying(p.equals(nextPlayer))
        .withCards(p.equals(this.target)
          ? (cardToDraw
            ? p.cards.remove(this.index).insert(0, cardToDraw)
            : p.cards.remove(this.index))
          : p.cards)
        .build()))
      .withDiscardPile(game.discardPile.push(this.card))
      .withDrawPile(game.drawPile.remove(-1))
      .withClues(game.clues+1)
      .build();
  }

  revert(game: HanabiGame): HanabiGame {
    const previousPlayer = game.previousPlayer();
    let cardToReturn = game.players.find(p => p.equals(this.target))?.cards.first();
    if (!cardToReturn) throw new Error(`No card to return to draw pile`);

    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withPlaying(p.equals(previousPlayer))
        .withCards(p.equals(this.target)
          ? p.cards.remove(0).insert(this.index, this.card)
          : p.cards)
        .build()))
      .withDiscardPile(game.discardPile.remove(-1))
      .withDrawPile(game.drawPile.push(cardToReturn))
      .withClues(game.clues-1)
      .build();
  }

  checkError(game: HanabiGame): string {
    return game.clues === 8
      ? `You can't discard a card when the clue count is full.`
      : '';
  }

}

export namespace HanabiCommandDiscard {

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

  build(): HanabiCommandDiscard {
    return new HanabiCommandDiscard(this);
  }
}
