import {ValueObject} from "immutable";
import {HanabiCard} from "../hanabi-card.model";

export class HanabiCardInfos implements ValueObject {

  readonly card: HanabiCard;
  readonly remaining: number;
  readonly played: number;
  readonly discarded: number;
  readonly visible: number;

  constructor(builder: Builder) {
    this.card = builder.card;
    this.remaining = builder.remaining;
    this.played = builder.played;
    this.discarded = builder.discarded;
    this.visible = builder.visible;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiCardInfos {
    return HanabiCardInfos.builder().build();
  }

  static copy(copy: HanabiCardInfos): Builder {
    return HanabiCardInfos.builder()
      .withCard(copy.card)
      .withRemaining(copy.remaining)
      .withPlayed(copy.played)
      .withDiscarded(copy.discarded)
      .withVisible(copy.visible);
  }

  static fromJson(json: any): HanabiCardInfos {
    return HanabiCardInfos.builder()
      .withCard(HanabiCard.fromJson(json.card))
      .withRemaining(json.remaining)
      .withPlayed(json.played)
      .withDiscarded(json.discarded)
      .withVisible(json.visible)
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

  static incrRemaining(prev: HanabiCardInfos): HanabiCardInfos {
    return HanabiCardInfos.copy(prev)
      .withRemaining(prev.remaining+1)
      .build();
  }

  static incrPlayed(prev: HanabiCardInfos): HanabiCardInfos {
    return HanabiCardInfos.copy(prev)
      .withPlayed(prev.played+1)
      .build();
  }

  static incrDiscarded(prev: HanabiCardInfos): HanabiCardInfos {
    return HanabiCardInfos.copy(prev)
      .withDiscarded(prev.discarded+1)
      .build();
  }

  static incrVisible(prev: HanabiCardInfos): HanabiCardInfos {
    return HanabiCardInfos.copy(prev)
      .withVisible(prev.visible+1)
      .build();
  }

  isLost(): boolean {
    return this.played === 0
        && this.remaining === 0;
  }

  allVisible(): boolean {
    return this.remaining === this.visible;
  }

}

export namespace HanabiCardInfos {
}

class Builder {

  card: HanabiCard = HanabiCard.empty();
  remaining: number = 0;
  played: number = 0;
  discarded: number = 0;
  visible: number = 0;

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

  withVisible(visible: number): Builder {
    this.visible = visible;
    return this;
  }

  build(): HanabiCardInfos {
    return new HanabiCardInfos(this);
  }
}
