import {HanabiGame} from "../hanabi-game.model";
import {HanabiPlayer} from "../hanabi-player.model";
import {HanabiCommand} from "./internal";
import {HanabiCard} from "../hanabi-card.model";
import {JsonType} from "../../../../../core/utils/plain-json.model";

export class HanabiCommandPlay extends HanabiCommand {

  readonly source: HanabiPlayer;
  readonly card: HanabiCard;
  readonly index: number;
  readonly isBomb: boolean;
  readonly gainClue: boolean;
  readonly draw: boolean;

  constructor(builder: Builder) {
    super(HanabiCommand.Type.PLAY);
    this.source = builder.source;
    this.card = builder.card;
    this.index = builder.index;
    this.isBomb = builder.isBomb;
    this.gainClue = builder.gainClue;
    this.draw = builder.draw;
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
      .withIsBomb(copy.isBomb)
      .withGainClue(copy.gainClue)
      .withDraw(copy.draw);
  }

  static override fromJson(json: any): HanabiCommandPlay {
    return HanabiCommandPlay.builder()
      .withSource(HanabiPlayer.fromJson(json.source))
      .withCard(HanabiCard.fromJson(json.card))
      .withIndex(json.index)
      .withIsBomb(json.isBomb)
      .withGainClue(json.gainClue)
      .withDraw(json.draw)
      .build();
  }

  override toJson(): JsonType<HanabiCommandPlay> {
    return {
      type: this.type,
      source: this.source.toJson(),
      card: this.card.toJson(),
      index: this.index,
      isBomb: this.isBomb,
      gainClue: this.gainClue,
      draw: this.draw
    };
  }

  fill(game: HanabiGame): HanabiCommandPlay {
    const isBomb = !this.card.isValidToPlay(game.board);
    const isHighestCard = this.card.value === game.settings.maxValue;

    return HanabiCommandPlay.copy(this)
      .withIsBomb(isBomb)
      .withGainClue(!isBomb && isHighestCard && !game.hasMaxClues())
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
      .withBoard(this.isBomb ? game.board : game.board.push(this.card))
      .withDrawPile(this.draw ? game.drawPile.remove(-1) : game.drawPile)
      .withDiscardPile(this.isBomb ? game.discardPile.push(this.card) : game.discardPile)
      .withClues(game.clues + (this.gainClue ? 1 : 0))
      .withBombs(game.bombs + (this.isBomb ? 1 : 0))
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
      .withBoard(this.isBomb ? game.board : game.board.remove(-1))
      .withDrawPile(cardToReturn ? game.drawPile.push(cardToReturn) : game.drawPile)
      .withDiscardPile(this.isBomb ? game.discardPile.remove(-1) : game.discardPile)
      .withClues(game.clues - (this.gainClue ? 1 : 0))
      .withBombs(game.bombs - (this.isBomb ? 1 : 0))
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
  isBomb: boolean = false;
  gainClue: boolean = false;
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

  withIsBomb(isBomb: boolean): Builder {
    this.isBomb = isBomb;
    return this;
  }

  withGainClue(gainClue: boolean): Builder {
    this.gainClue = gainClue;
    return this;
  }

  withDraw(draw: boolean): Builder {
    this.draw = draw;
    return this;
  }

  build(): HanabiCommandPlay {
    return new HanabiCommandPlay(this);
  }
}
