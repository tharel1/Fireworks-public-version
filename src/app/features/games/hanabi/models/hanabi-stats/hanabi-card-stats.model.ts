import {ValueObject} from "immutable";
import {HanabiCard} from "../hanabi-card.model";

export class HanabiCardStats implements ValueObject {

  readonly card: HanabiCard;
  readonly remaining: number;
  readonly played: number;
  readonly discarded: number;

  constructor(builder: Builder) {
    this.card = builder.card;
    this.remaining = builder.remaining;
    this.played = builder.played;
    this.discarded = builder.discarded;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiCardStats {
    return HanabiCardStats.builder().build();
  }

  static copy(copy: HanabiCardStats): Builder {
    return HanabiCardStats.builder()
      .withCard(copy.card)
      .withRemaining(copy.remaining)
      .withPlayed(copy.played)
      .withDiscarded(copy.discarded);
  }

  static fromJson(json: any): HanabiCardStats {
    return HanabiCardStats.builder()
      .withCard(HanabiCard.fromJson(json.card))
      .withRemaining(json.remaining)
      .withPlayed(json.played)
      .withDiscarded(json.discarded)
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

  isCritical(): boolean {
    return this.played === 0
        && this.remaining === 1;
  }

}

export namespace HanabiCardStats {
}

class Builder {

  card: HanabiCard = HanabiCard.empty();
  remaining: number = 0;
  played: number = 0;
  discarded: number = 0;

  withCard(card: HanabiCard): Builder {
    this.card = card;
    return this;
  }

  withRemaining(remaining: number): Builder {
    this.remaining = remaining;
    return this;
  }

  withPlayed(played: number): Builder {
    this.played = played;
    return this;
  }

  withDiscarded(discarded: number): Builder {
    this.discarded = discarded;
    return this;
  }

  build(): HanabiCardStats {
    return new HanabiCardStats(this);
  }
}
