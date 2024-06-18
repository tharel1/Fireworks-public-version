import {ValueObject} from "immutable";

export class HanabiPreferences implements ValueObject {

  readonly showCritical: boolean;
  readonly showTrash: boolean;
  readonly showMarkerWarnings: boolean;
  readonly markerCleaning: boolean;

  constructor(builder: Builder) {
    this.showCritical = builder.showCritical;
    this.showTrash = builder.showTrash;
    this.showMarkerWarnings = builder.showMarkerWarnings;
    this.markerCleaning = builder.markerCleaning;
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
      .withShowTrash(copy.showTrash)
      .withShowMarkerWarnings(copy.showMarkerWarnings)
      .withMarkerCleaning(copy.markerCleaning);
  }

  static fromJson(json: any): HanabiPreferences {
    return HanabiPreferences.builder()
      .withShowCritical(json.showCritical)
      .withShowTrash(json.showTrash)
      .withShowMarkerWarnings(json.showMarkerWarnings)
      .withMarkerCleaning(json.markerCleaning)
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
  showTrash: boolean = false;
  showMarkerWarnings: boolean = false;
  markerCleaning: boolean = false;

  withShowCritical(showCritical: boolean): Builder {
    this.showCritical = showCritical;
    return this;
  }

  withShowTrash(showTrash: boolean): Builder {
    this.showTrash = showTrash;
    return this;
  }

  withShowMarkerWarnings(showMarkerWarnings: boolean): Builder {
    this.showMarkerWarnings = showMarkerWarnings;
    return this;
  }

  withMarkerCleaning(markerCleaning: boolean): Builder {
    this.markerCleaning = markerCleaning;
    return this;
  }

  build(): HanabiPreferences {
    return new HanabiPreferences(this);
  }
}
