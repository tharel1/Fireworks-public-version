import {Set, ValueObject} from "immutable";
import {HanabiHint} from "./hanabi-hint.model";
import {HanabiInfosFromPov} from "../hanabi-infos/hanabi-infos-from-pov.model";
import {HanabiCard} from "../hanabi-card.model";

export class HanabiAssistant implements ValueObject {

  readonly hints: Set<HanabiHint>;
  readonly selectedCardId?: number;
  readonly showImpossibleClues: boolean;

  constructor(builder: Builder) {
    this.hints = builder.hints;
    this.selectedCardId = builder.selectedCardId;
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
      .withSelectedCardId(copy.selectedCardId)
      .withShowImpossibleClues(copy.showImpossibleClues);
  }

  static fromJson(json: any): HanabiAssistant {
    return HanabiAssistant.builder()
      .withHints(Set(json.hints).map(h => HanabiHint.fromJson(h)))
      .withSelectedCardId(json.selectedCardId)
      .withShowImpossibleClues(json.showImpossibleClues)
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

  update(infos: HanabiInfosFromPov): HanabiAssistant {
    return HanabiAssistant.copy(this)
      .withHints(this.hints.map(h => {
        const card = infos.game.allCards().find(c => c.id === h.cardId) ?? HanabiCard.empty();
        const isInPovHand = infos.pov.cards.some(c => c.equals(card));

        return HanabiHint.copy(h)
          .withIsInPovHand(isInPovHand)
          .withMarkers(h.markers.map(m => m.applyWarnings(card, infos.getCardInfoByMarker(m), isInPovHand)))
          .build()
      }))
      .build();
  }

}

export namespace HanabiAssistant {
}

class Builder {

  hints: Set<HanabiHint> = Set.of();
  selectedCardId?: number = undefined;
  showImpossibleClues: boolean = false;

  withHints(hints: Set<HanabiHint>): Builder {
    this.hints = hints;
    return this;
  }

  withSelectedCardId(selectedCardId?: number): Builder {
    this.selectedCardId = selectedCardId;
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
