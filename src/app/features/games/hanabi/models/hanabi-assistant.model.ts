import {Set, ValueObject} from "immutable";
import {HanabiHint} from "./hanabi-hint.model";

export class HanabiAssistant implements ValueObject {

  readonly hints: Set<HanabiHint>;
  readonly showImpossibleClues: boolean;

  constructor(builder: Builder) {
    this.hints = builder.hints;
    this.showImpossibleClues = builder.showImpossibleClues;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiAssistant {
    return HanabiAssistant.builder().build();
  }

  static copy(copy: HanabiAssistant): Builder {
    return HanabiAssistant.builder()
      .withHints(copy.hints)
      .withShowImpossibleClues(copy.showImpossibleClues);
  }

  static fromJson(json: any): HanabiAssistant {
    return HanabiAssistant.builder()
      .withHints(Set(json.hints).map(h => HanabiHint.fromJson(h)))
      .withShowImpossibleClues(json.showImpossibleClues)
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
  showImpossibleClues: boolean = false;

  withHints(hints: Set<HanabiHint>): Builder {
    this.hints = hints;
    return this;
  }

  withShowImpossibleClues(showImpossibleClues: boolean): Builder {
    this.showImpossibleClues = showImpossibleClues;
    return this;
  }

  build(): HanabiAssistant {
    return new HanabiAssistant(this);
  }
}
