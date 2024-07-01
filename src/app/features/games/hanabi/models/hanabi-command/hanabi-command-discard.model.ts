import {HanabiGame} from "../hanabi-game.model";
import {HanabiPlayer} from "../hanabi-player.model";
import {HanabiCommand} from "./internal";
import {HanabiCard} from "../hanabi-card.model";
import {JsonType} from "../../../../../core/utils/plain-json.model";

export class HanabiCommandDiscard extends HanabiCommand {

  readonly source: HanabiPlayer;
  readonly card: HanabiCard;
  readonly index: number;
  readonly draw: boolean;

  constructor(builder: Builder) {
    super(HanabiCommand.Type.DISCARD);
    this.source = builder.source;
    this.card = builder.card;
    this.index = builder.index;
    this.draw = builder.draw;
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
      .withDraw(copy.draw);
  }

  static override fromJson(json: any): HanabiCommandDiscard {
    return HanabiCommandDiscard.builder()
      .withSource(HanabiPlayer.fromJson(json.source))
      .withCard(HanabiCard.fromJson(json.card))
      .withIndex(json.index)
      .withDraw(json.draw)
      .build();
  }

  override toJson(): JsonType<HanabiCommandDiscard> {
    return {
      type: this.type,
      source: this.source.toJson(),
      card: this.card.toJson(),
      index: this.index,
      draw: this.draw
    };
  }

  fill(game: HanabiGame): HanabiCommandDiscard {
    return HanabiCommandDiscard.copy(this)
      .withDraw(!game.drawPile.isEmpty())
      .build();
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
      .withDrawPile(this.draw ? game.drawPile.remove(-1) : game.drawPile)
      .withDiscardPile(game.discardPile.push(this.card))
      .withClues(game.clues+1)
      .build()
      .nextTurn();
  }

  revert(game: HanabiGame): HanabiGame {
    let cardToReturn = this.draw
      ? game.players.find(p => p.equals(this.source))?.cards.first()
      : undefined;

    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withCards(p.equals(this.source)
          ? (this.draw ? p.cards.remove(0) : p.cards).insert(this.index, this.card)
          : p.cards)
        .build()))
      .withDiscardPile(game.discardPile.remove(-1))
      .withDrawPile(cardToReturn ? game.drawPile.push(cardToReturn) : game.drawPile)
      .withClues(game.clues-1)
      .build()
      .previousTurn();
  }

  checkError(game: HanabiGame): string {
    return game.hasMaxClues()
      ? `Can't have more than ${game.settings.maxClues} clues.`
      : '';
  }

}

export namespace HanabiCommandDiscard {

}

class Builder {
  source: HanabiPlayer = HanabiPlayer.empty();
  card: HanabiCard = HanabiCard.empty();
  index: number = 0;
  draw: boolean = false;

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

  withDraw(draw: boolean): Builder {
    this.draw = draw;
    return this;
  }

  build(): HanabiCommandDiscard {
    return new HanabiCommandDiscard(this);
  }
}
