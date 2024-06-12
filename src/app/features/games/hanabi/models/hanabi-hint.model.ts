import {List, ValueObject} from "immutable";
import {HanabiMarker} from "./hanabi-marker.model";

export class HanabiHint implements ValueObject {

  readonly cardId: number;
  readonly isInPovHand: boolean;
  readonly markers: List<HanabiMarker>;

  constructor(builder: Builder) {
    this.cardId = builder.cardId;
    this.isInPovHand = builder.isInPovHand;
    this.markers = builder.markers;
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
      .withIsInPovHand(copy.isInPovHand)
      .withMarkers(copy.markers);
  }

  static fromJson(json: any): HanabiHint {
    return HanabiHint.builder()
      .withCardId(json.cardId)
      .withIsInPovHand(json.isInPovHand)
      .withMarkers(List(json.markers).map(m => HanabiMarker.fromJson(m)))
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
  isInPovHand: boolean = false;
  markers: List<HanabiMarker> = List.of();

  withCardId(cardId: number): Builder {
    this.cardId = cardId;
    return this;
  }

  withIsInPovHand(isInPovHand: boolean): Builder {
    this.isInPovHand = isInPovHand;
    return this;
  }

  withMarkers(markers: List<HanabiMarker>): Builder {
    this.markers = markers;
    return this;
  }

  build(): HanabiHint {
    return new HanabiHint(this);
  }
}
