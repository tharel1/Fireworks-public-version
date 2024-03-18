import {List, ValueObject} from "immutable";
import {HanabiCard} from "./hanabi-card.model";

export class HanabiSettings implements ValueObject {

  readonly playersNumber: number;
  readonly maxValue: number;
  readonly colors: List<HanabiCard.Color>;

  constructor(builder: Builder) {
    this.playersNumber = builder.playersNumber;
    this.maxValue = builder.maxValue;
    this.colors = builder.colors;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiSettings {
    return HanabiSettings.builder().build();
  }

  static copy(copy: HanabiSettings): Builder {
    return HanabiSettings.builder()
      .withPlayersNumber(copy.playersNumber)
      .withMaxValue(copy.maxValue)
      .withColors(copy.colors)
  }

  static fromJson(json: any): HanabiSettings {
    return HanabiSettings.builder()
      .withPlayersNumber(json.playersNumber)
      .withMaxValue(json.maxValue)
      .withColors(List(json.colors))
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

}

export namespace HanabiSettings {
}

class Builder {

  playersNumber: number = 0;
  maxValue: number = 0;
  colors: List<HanabiCard.Color> = List.of();

  withPlayersNumber(playersNumber: number): Builder {
    this.playersNumber = playersNumber;
    return this;
  }

  withMaxValue(maxValue: number): Builder {
    this.maxValue = maxValue;
    return this;
  }

  withColors(colors: List<HanabiCard.Color>): Builder {
    this.colors = colors;
    return this;
  }

  build(): HanabiSettings {
    return new HanabiSettings(this);
  }
}
