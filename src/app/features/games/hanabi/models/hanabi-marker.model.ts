import {ValueObject} from "immutable";
import {HanabiCard} from "./hanabi-card.model";

export class HanabiMarker implements ValueObject {

  readonly value: string;
  readonly color?: HanabiCard.Color;

  constructor(builder: Builder) {
    this.value = builder.value;
    this.color = builder.color;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiMarker {
    return HanabiMarker.builder().build();
  }

  static copy(copy: HanabiMarker): Builder {
    return HanabiMarker.builder()
      .withValue(copy.value)
      .withColor(copy.color);
  }

  static fromJson(json: any): HanabiMarker {
    return HanabiMarker.builder()
      .withValue(json.value)
      .withColor(json.color)
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

  isIdentical(other: HanabiMarker): boolean {
    return this.value === other.value
        && this.color === other.color;
  }

}

export namespace HanabiMarker {
}

class Builder {

  value: string = '';
  color?: HanabiCard.Color;

  withValue(value: string): Builder {
    this.value = value;
    return this;
  }

  withColor(color?: HanabiCard.Color): Builder {
    this.color = color;
    return this;
  }

  build(): HanabiMarker {
    return new HanabiMarker(this);
  }
}
