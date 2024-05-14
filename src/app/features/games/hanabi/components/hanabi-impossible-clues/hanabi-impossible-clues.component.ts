import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {HanabiCard} from "../../models/hanabi-card.model";
import {HanabiSettings} from "../../models/hanabi-settings.model";
import {List} from "immutable";
import {Changes} from "../../../../../core/utils/changes.model";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-hanabi-impossible-clues',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './hanabi-impossible-clues.component.html',
  styleUrl: './hanabi-impossible-clues.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiImpossibleCluesComponent implements OnChanges {
  @Input() card: HanabiCard = HanabiCard.empty();
  @Input() settings: HanabiSettings = HanabiSettings.empty();

  protected possibleValues: List<PossibleValue> = List.of();
  protected possibleColors: List<PossibleColor> = List.of();

  ngOnChanges(changes: Changes<HanabiImpossibleCluesComponent>): void {
    if (changes.card) {
      this.possibleValues = this.card.valueClue.isEmpty()
        ? this.settings.values().map(v => ({ value: v, impossible: this.card.impossibleValues.contains(v)}))
        : this.settings.values().map(v => ({ value: v, impossible: this.card.value !== v }));

      this.possibleColors = this.card.colorClue.isEmpty()
        ? this.settings.colors.map(c => ({ color: c, impossible: this.card.impossibleColors.contains(c)}))
        : this.settings.colors.map(c => ({ color: c, impossible: this.card.color !== c }));
    }
  }
}

interface PossibleValue {
  value: number;
  impossible: boolean;
}

interface PossibleColor {
  color: HanabiCard.Color;
  impossible: boolean;
}
