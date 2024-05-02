import {HanabiGame} from "../hanabi-game.model";
import {HanabiPlayer} from "../hanabi-player.model";
import {HanabiCommand} from "./internal";
import {HanabiCard} from "../hanabi-card.model";

export class HanabiCommandDiscard extends HanabiCommand {

  readonly source: HanabiPlayer;
  readonly card: HanabiCard;
  readonly index: number;

  constructor(builder: Builder) {
    super(HanabiCommand.Type.DISCARD);
    this.source = builder.source;
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
      .withSource(copy.source)
      .withCard(copy.card)
      .withIndex(copy.index)
  }

  static override fromJson(json: any): HanabiCommandDiscard {
    return HanabiCommandDiscard.builder()
      .withSource(HanabiPlayer.fromJson(json.source))
      .withCard(HanabiCard.fromJson(json.card))
      .withIndex(json.index)
      .build();
  }

  fill(game: HanabiGame): HanabiCommandDiscard {
    return this;
  }

  update(game: HanabiGame): HanabiGame {
    const cardToDraw = game.drawPile.last();

    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withCards(p.equals(this.source)
          ? (cardToDraw
            ? p.cards.remove(this.index).insert(0, cardToDraw)
            : p.cards.remove(this.index))
          : p.cards)
        .build()))
      .withDiscardPile(game.discardPile.push(this.card))
      .withDrawPile(game.drawPile.remove(-1))
      .withClues(game.clues+1)
      .build()
      .nextTurn();
  }

  revert(game: HanabiGame): HanabiGame {
    let cardToReturn = game.players.find(p => p.equals(this.source))?.cards.first();
    if (!cardToReturn) throw new Error(`No card to return to draw pile`);

    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withCards(p.equals(this.source)
          ? p.cards.remove(0).insert(this.index, this.card)
          : p.cards)
        .build()))
      .withDiscardPile(game.discardPile.remove(-1))
      .withDrawPile(game.drawPile.push(cardToReturn))
      .withClues(game.clues-1)
      .build()
      .previousTurn();
  }

  checkError(game: HanabiGame): string {
    return game.clues === 8
      ? `You can't discard since the clue count has reached it's maximum.`
      : '';
  }

}

export namespace HanabiCommandDiscard {

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

  build(): HanabiCommandDiscard {
    return new HanabiCommandDiscard(this);
  }
}
