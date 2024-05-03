import {ValueObject} from "immutable";

export class HanabiPreferences implements ValueObject {

  constructor(builder: Builder) {
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiPreferences {
    return HanabiPreferences.builder().build();
  }

  static copy(copy: HanabiPreferences): Builder {
    return HanabiPreferences.builder();
  }

  static fromJson(json: any): HanabiPreferences {
    return HanabiPreferences.builder()
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

}

export namespace HanabiPreferences {
}

class Builder {

  build(): HanabiPreferences {
    return new HanabiPreferences(this);
  }
}
