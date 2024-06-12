import {ValueObject} from "immutable";
import {HanabiCard} from "./hanabi-card.model";
import {HanabiCardInfos} from "./hanabi-infos/hanabi-card-infos.model";

export class HanabiMarker implements ValueObject {

  readonly value: string;
  readonly color?: HanabiCard.Color;
  readonly description: string;
  readonly special: boolean;
  readonly warning: boolean;

  constructor(builder: Builder) {
    this.value = builder.value;
    this.color = builder.color;
    this.description = builder.description;
    this.special = builder.special;
    this.warning = builder.warning;
  }

  static builder(): Builder {
    return new Builder();
  }

  static empty(): HanabiMarker {
    return HanabiMarker.builder().build();
  }

  static copy(copy: HanabiMarker): Builder {
    return HanabiMarker.builder()
      .withValue(copy.value)
      .withColor(copy.color)
      .withDescription(copy.description)
      .withSpecial(copy.special)
      .withWarning(copy.warning);
  }

  static fromJson(json: any): HanabiMarker {
    return HanabiMarker.builder()
      .withValue(json.value)
      .withColor(json.color)
      .withDescription(json.description)
      .withSpecial(json.special)
      .withWarning(json.warning)
      .build();
  }

  equals(other: unknown): boolean {
    return false;
  }

  hashCode(): number {
    return 0;
  }

  isIdentical(other: HanabiMarker): boolean {
    return this.value === other.value
        && this.color === other.color;
  }

  applyWarnings(card: HanabiCard, markerCardInfo: HanabiCardInfos, isInPovHand: boolean): HanabiMarker {
    if (this.special) return this;

    let description: string = '';
    if (!description) description = this.checkClueWarning(card);
    if (!description) description = this.checkImpossibleWarning(card);
    if (!description) description = this.checkVisibilityWarning(markerCardInfo, isInPovHand);
    if (!description) return HanabiMarker.copy(this)
      .withDescription('')
      .withWarning(false)
      .build();

    return HanabiMarker.copy(this)
      .withDescription(description)
      .withWarning(true)
      .build();
  }

  private checkClueWarning(card: HanabiCard): string {

    if (card.valueClue.size > 0 && card.colorClue.size > 0
      && (this.value !== card.value.toString() || this.color !== card.color))
      return `Card is ${card.color}${card.value}`;

    if (this.value && card.valueClue.size > 0 && !card.valueClue.contains(+this.value))
      return `Card already clued '${card.valueClue.last()}'`;

    if (this.color && card.colorClue.size > 0 && this.color && !card.colorClue.contains(this.color))
      return `Card already clued '${card.colorClue.last()}'`;

    return '';
  }

  private checkImpossibleWarning(card: HanabiCard): string {
    let description = '';

    if (card.impossibleColors.size > 0 && this.color && card.impossibleColors.contains(this.color)) {
      description += `'${this.color}'`;
    }
    if (card.impossibleValues.size > 0 && card.impossibleValues.contains(+this.value)) {
      description += `'${this.value}'`;
    }

    if (description)
      return `Card can't be ${description}`;

    return '';
  }

  private checkVisibilityWarning(markerCardInfo: HanabiCardInfos, isInPovHand: boolean): string {
    if (!this.isFull()) return '';

    if (isInPovHand && markerCardInfo.allVisible())
      return `All ${this.color}${this.value} are visible`

    return '';
  }

  private isFull(): boolean {
    return !!this.value
        && !!this.color;
  }

}

export namespace HanabiMarker {
}

class Builder {

  value: string = '';
  color?: HanabiCard.Color;
  description: string = '';
  special: boolean = false;
  warning: boolean = false;

  withValue(value: string): Builder {
    this.value = value;
    return this;
  }

  withColor(color?: HanabiCard.Color): Builder {
    this.color = color;
    return this;
  }

  withDescription(description: string): Builder {
    this.description = description;
    return this;
  }

  withSpecial(special: boolean): Builder {
    this.special = special;
    return this;
  }

  withWarning(warning: boolean): Builder {
    this.warning = warning;
    return this;
  }

  build(): HanabiMarker {
    return new HanabiMarker(this);
  }
}
