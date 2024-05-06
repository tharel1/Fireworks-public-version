import {ValueObject} from "immutable";

export class HanabiPreferences implements ValueObject {

  readonly showCritical: boolean;
  readonly markerCleaning: boolean;
  readonly markerSuggestions: boolean;

  constructor(builder: Builder) {
    this.showCritical = builder.showCritical;
    this.markerCleaning = builder.markerCleaning;
    this.markerSuggestions = builder.markerSuggestions;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiPreferences {
    return HanabiPreferences.builder().build();
  }

  static copy(copy: HanabiPreferences): Builder {
    return HanabiPreferences.builder()
      .withShowCritical(copy.showCritical)
      .withMarkerCleaning(copy.markerCleaning)
      .withMarkerSuggestions(copy.markerSuggestions);
  }

  static fromJson(json: any): HanabiPreferences {
    return HanabiPreferences.builder()
      .withShowCritical(json.showCritical)
      .withMarkerCleaning(json.markerCleaning)
      .withMarkerSuggestions(json.markerSuggestions)
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

  showCritical: boolean = false;
  markerCleaning: boolean = false;
  markerSuggestions: boolean = false;

  withShowCritical(showCritical: boolean): Builder {
    this.showCritical = showCritical;
    return this;
  }

  withMarkerCleaning(markerCleaning: boolean): Builder {
    this.markerCleaning = markerCleaning;
    return this;
  }

  withMarkerSuggestions(markerSuggestions: boolean): Builder {
    this.markerSuggestions = markerSuggestions;
    return this;
  }

  build(): HanabiPreferences {
    return new HanabiPreferences(this);
  }
}
