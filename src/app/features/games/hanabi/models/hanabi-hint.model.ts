import {ValueObject} from "immutable";

export class HanabiHint implements ValueObject {

  readonly cardId: number;
  readonly critical: boolean;

  constructor(builder: Builder) {
    this.cardId = builder.cardId;
    this.critical = builder.critical;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiHint {
    return HanabiHint.builder().build();
  }

  static copy(copy: HanabiHint): Builder {
    return HanabiHint.builder()
      .withCardId(copy.cardId)
      .withCritical(copy.critical);
  }

  static fromJson(json: any): HanabiHint {
    return HanabiHint.builder()
      .withCardId(json.cardId)
      .withCritical(json.critical)
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

}

export namespace HanabiHint {
}

class Builder {

  cardId: number = 0;
  critical: boolean = false;

  withCardId(cardId: number): Builder {
    this.cardId = cardId;
    return this;
  }

  withCritical(critical: boolean): Builder {
    this.critical = critical;
    return this;
  }

  build(): HanabiHint {
    return new HanabiHint(this);
  }
}
