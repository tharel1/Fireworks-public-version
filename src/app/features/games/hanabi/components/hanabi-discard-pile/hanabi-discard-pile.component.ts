import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {List, Map} from "immutable";
import {HanabiCard} from "../../models/hanabi-card.model";
import {MatCardModule} from "@angular/material/card";
import {Changes} from "../../../../../core/utils/changes.model";
import {HanabiSettings} from "../../models/hanabi-settings.model";
import {HanabiCardComponent} from "../hanabi-card/hanabi-card.component";

@Component({
  selector: 'app-hanabi-discard-pile',
  standalone: true,
  imports: [CommonModule, MatCardModule, HanabiCardComponent],
  templateUrl: './hanabi-discard-pile.component.html',
  styleUrls: ['./hanabi-discard-pile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiDiscardPileComponent implements OnChanges {
  @Input() discardPile: List<HanabiCard> = List.of();
  @Input() settings: HanabiSettings = HanabiSettings.empty();

  protected calculatedDiscardPile: Map<HanabiCard.Color, Map<number, number>> = Map();

  protected readonly Array = Array;

  ngOnChanges(changes: Changes<HanabiDiscardPileComponent>): void {
    if (changes.discardPile)
      this.calculatedDiscardPile = this.discardPile
        .groupBy(c => c.color)
        .map(cards => cards
          .map(c => c.value)
          .groupBy(value => value )
          .map(values => values.reduce((reduction) => reduction + 1, 0))
        );
  }
}
