import {hash, is, List, ValueObject} from "immutable";
import {JsonType, PlainJson} from "../../../../core/utils/plain-json.model";

export class HanabiCard implements ValueObject, PlainJson<HanabiCard> {

  readonly id: number;
  readonly value: number;
  readonly color: HanabiCard.Color;
  readonly valueClue: List<number>;
  readonly colorClue: List<HanabiCard.Color>;
  readonly impossibleValues: List<number>;
  readonly impossibleColors: List<HanabiCard.Color>;

  constructor(builder: Builder) {
    this.id = builder.id;
    this.value = builder.value;
    this.color = builder.color;
    this.valueClue = builder.valueClue;
    this.colorClue = builder.colorClue;
    this.impossibleValues = builder.impossibleValues;
    this.impossibleColors = builder.impossibleColors;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiCard {
    return HanabiCard.builder().build();
  }

  static copy(copy: HanabiCard): Builder {
    return HanabiCard.builder()
      .withId(copy.id)
      .withValue(copy.value)
      .withColor(copy.color)
      .withValueClue(copy.valueClue)
      .withColorClue(copy.colorClue)
      .withImpossibleValues(copy.impossibleValues)
      .withImpossibleColors(copy.impossibleColors);
  }

  static fromJson(json: any): HanabiCard {
    return HanabiCard.builder()
      .withId(json.id)
      .withValue(json.value)
      .withColor(json.color)
      .withValueClue(List(json.valueClue))
      .withColorClue(List(json.colorClue))
      .withImpossibleValues(List(json.impossibleValues))
      .withImpossibleColors(List(json.impossibleColors))
      .build();
  }

  toJson(): JsonType<HanabiCard> {
    return {
      id: this.id,
      value: this.value,
      color: this.color,
      valueClue: this.valueClue.toArray(),
      colorClue: this.colorClue.toArray(),
      impossibleValues: this.impossibleValues.toArray(),
      impossibleColors: this.impossibleColors.toArray()
    };
  }

  equals(other: unknown): boolean {
    if (!(other instanceof HanabiCard)) {
      return false;
    }
    return is(this.id, other.id);
  }

  hashCode(): number {
    return hash(this.id);
  }

  isIdentical(other: HanabiCard): boolean {
    return this.value === other.value
        && this.color === other.color;
  }

  isClued(): boolean {
    return !this.valueClue.isEmpty()
        || !this.colorClue.isEmpty();
  }

  isFullyClued(): boolean {
    return !this.valueClue.isEmpty()
        && !this.colorClue.isEmpty();
  }

  isValidToPlay(board: List<HanabiCard>): boolean {
    if (this.value === 1)
      return board.filter(c => c.color === this.color).isEmpty();

    return board.filter(c => c.color === this.color && c.value >= this.value).isEmpty()
      && board.some(c => c.color === this.color && c.value === this.value-1);
  }

}

export namespace HanabiCard {
  export enum Color {
    RED = 'red',
    YELLOW = 'yellow',
    GREEN = 'green',
    BLUE = 'blue',
    PURPLE = 'purple',
  }
}

class Builder {
  id: number = 0;
  value: number = 1;
  color: HanabiCard.Color = HanabiCard.Color.RED;
  valueClue: List<number> = List.of();
  colorClue: List<HanabiCard.Color> = List.of();
  impossibleValues: List<number> = List.of();
  impossibleColors: List<HanabiCard.Color> = List.of();

  withId(id: number): Builder {
    this.id = id;
    return this;
  }

  withValue(value: number): Builder {
    this.value = value;
    return this;
  }

  withColor(color: HanabiCard.Color): Builder {
    this.color = color;
    return this;
  }

  withValueClue(valueClue: List<number>): Builder {
    this.valueClue = valueClue;
    return this;
  }

  withColorClue(colorClue: List<HanabiCard.Color>): Builder {
    this.colorClue = colorClue;
    return this;
  }

  withImpossibleValues(impossibleValues: List<number>): Builder {
    this.impossibleValues = impossibleValues;
    return this;
  }

  withImpossibleColors(impossibleColors: List<HanabiCard.Color>): Builder {
    this.impossibleColors = impossibleColors;
    return this;
  }

  build(): HanabiCard {
    return new HanabiCard(this);
  }
}
