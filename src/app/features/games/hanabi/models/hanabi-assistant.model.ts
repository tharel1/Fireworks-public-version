import {Set, ValueObject} from "immutable";
import {HanabiHint} from "./hanabi-hint.model";

export class HanabiAssistant implements ValueObject {

  readonly hints: Set<HanabiHint>;

  constructor(builder: Builder) {
    this.hints = builder.hints;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiAssistant {
    return HanabiAssistant.builder().build();
  }

  static copy(copy: HanabiAssistant): Builder {
    return HanabiAssistant.builder()
      .withHints(copy.hints);
  }

  static fromJson(json: any): HanabiAssistant {
    return HanabiAssistant.builder()
      .withHints(Set(json.hints).map(h => HanabiHint.fromJson(h)))
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

}

export namespace HanabiAssistant {
}

class Builder {

  hints: Set<HanabiHint> = Set.of();

  withHints(hints: Set<HanabiHint>): Builder {
    this.hints = hints;
    return this;
  }

  build(): HanabiAssistant {
    return new HanabiAssistant(this);
  }
}
