import {List, Set, ValueObject} from "immutable";
import {HanabiCardStats} from "./hanabi-card-stats.model";
import {HanabiCard} from "../hanabi-card.model";
import {HanabiSettings} from "../hanabi-settings.model";

export class HanabiStats implements ValueObject {

  readonly cards: Set<HanabiCardStats>;

  constructor(builder: Builder) {
    this.cards = builder.cards;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiStats {
    return HanabiStats.builder().build();
  }

  static copy(copy: HanabiStats): Builder {
    return HanabiStats.builder()
      .withCards(copy.cards);
  }

  static fromJson(json: any): HanabiStats {
    return HanabiStats.builder()
      .withCards(Set(json.cards).map(c => HanabiCardStats.fromJson(c)))
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

  emptyCardStats(settings: HanabiSettings): HanabiStats {
    const emptyCardStats = settings.colors.flatMap(color =>
      settings.values().map(i => {
        return HanabiCardStats.builder()
          .withCard(HanabiCard.builder()
            .withValue(i+1)
            .withColor(color)
            .build())
          .build()
      })
    ).toSet();

    return HanabiStats.copy(this)
      .withCards(emptyCardStats)
      .build();
  }

  modifyCardStats(cards: List<HanabiCard>, modifier: (prev: HanabiCardStats) => HanabiCardStats): HanabiStats {
    let cardStats = this.cards.toList();

    cards.forEach(c => {
      const index = cardStats.findIndex(s => c.isIdentical(s.card));
      const cardStat = cardStats.get(index)!;
      cardStats = cardStats.set(index, modifier(cardStat));
    });

    return HanabiStats.copy(this)
      .withCards(cardStats.toSet())
      .build();
  }

}

export namespace HanabiStats {
}

class Builder {

  cards: Set<HanabiCardStats> = Set.of();

  withCards(cards: Set<HanabiCardStats>): Builder {
    this.cards = cards;
    return this;
  }

  build(): HanabiStats {
    return new HanabiStats(this);
  }
}
