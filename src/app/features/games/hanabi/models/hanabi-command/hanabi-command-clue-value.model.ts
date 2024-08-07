import {HanabiGame} from "../hanabi-game.model";
import {HanabiPlayer} from "../hanabi-player.model";
import {HanabiCommand} from "./internal";
import {HanabiCard} from "../hanabi-card.model";
import {JsonType} from "../../../../../core/utils/plain-json.model";

export class HanabiCommandClueValue extends HanabiCommand {

  readonly source: HanabiPlayer;
  readonly target: HanabiPlayer;
  readonly value: number;

  constructor(builder: Builder) {
    super(HanabiCommand.Type.CLUE_VALUE);
    this.source = builder.source;
    this.target = builder.target;
    this.value = builder.value;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiCommandClueValue {
    return HanabiCommandClueValue.builder().build();
  }

  static copy(copy: HanabiCommandClueValue): Builder {
    return HanabiCommandClueValue.builder()
      .withSource(copy.source)
      .withTarget(copy.target)
      .withValue(copy.value);
  }

  static override fromJson(json: any): HanabiCommandClueValue {
    return HanabiCommandClueValue.builder()
      .withSource(HanabiPlayer.fromJson(json.source))
      .withTarget(HanabiPlayer.fromJson(json.target))
      .withValue(json.value)
      .build();
  }

  override toJson(): JsonType<HanabiCommandClueValue> {
    return {
      type: this.type,
      source: this.source.toJson(),
      target: this.target.toJson(),
      value: this.value
    };
  }

  fill(game: HanabiGame): HanabiCommandClueValue {
    return HanabiCommandClueValue.copy(this)
      .withSource(game.currentPlayer() ?? HanabiPlayer.empty())
      .build();
  }

  update(game: HanabiGame): HanabiGame {
    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withCards(p.equals(this.target)
          ? p.cards.map(c => c.value === this.value
            ? HanabiCard.copy(c).withValueClue(c.valueClue.push(this.value)).build()
            : HanabiCard.copy(c).withImpossibleValues(c.impossibleValues.push(this.value)).build())
          : p.cards)
        .build()))
      .withClues(game.clues-1)
      .build()
      .nextTurn();
  }

  revert(game: HanabiGame): HanabiGame {
    return HanabiGame.copy(game)
      .withPlayers(game.players.map((p) => HanabiPlayer.copy(p)
        .withCards(p.equals(this.target)
          ? p.cards.map(c => c.value === this.value
            ? HanabiCard.copy(c).withValueClue(c.valueClue.remove(-1)).build()
            : HanabiCard.copy(c).withImpossibleValues(c.impossibleValues.remove(-1)).build())
          : p.cards)
        .build()))
      .withClues(game.clues+1)
      .build()
      .previousTurn();
  }

  checkError(game: HanabiGame): string {
    return game.clues === 0
      ? `No clue left.`
      : '';
  }

}

export namespace HanabiCommandClueValue {

}

class Builder {
  source: HanabiPlayer = HanabiPlayer.empty();
  target: HanabiPlayer = HanabiPlayer.empty();
  value: number = 0;

  withSource(source: HanabiPlayer): Builder {
    this.source = source;
    return this;
  }

  withTarget(target: HanabiPlayer): Builder {
    this.target = target;
    return this;
  }

  withValue(value: number): Builder {
    this.value = value;
    return this;
  }

  build(): HanabiCommandClueValue {
    return new HanabiCommandClueValue(this);
  }
}
