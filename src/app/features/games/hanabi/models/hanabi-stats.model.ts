import {ValueObject} from "immutable";

export class HanabiStats implements ValueObject {

  constructor(builder: Builder) {
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiStats {
    return HanabiStats.builder().build();
  }

  static copy(copy: HanabiStats): Builder {
    return HanabiStats.builder();
  }

  static fromJson(json: any): HanabiStats {
    return HanabiStats.builder()
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

}

export namespace HanabiStats {
}

class Builder {

  build(): HanabiStats {
    return new HanabiStats(this);
  }
}
