import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {List, Map} from "immutable";
import {HanabiCard} from "../../models/hanabi-card.model";
import {MatCardModule} from "@angular/material/card";
import {Changes} from "../../../../../core/utils/changes.model";

@Component({
  selector: 'app-hanabi-discard-pile',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './hanabi-discard-pile.component.html',
  styleUrls: ['./hanabi-discard-pile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiDiscardPileComponent implements OnInit, OnChanges {
  @Input() discardPile: List<HanabiCard> = List.of();
  protected calculatedDiscardPile: Map<HanabiCard.Color, Map<number, number>> = Map();

  protected readonly colors = List.of(
    HanabiCard.Color.RED,
    HanabiCard.Color.YELLOW,
    HanabiCard.Color.GREEN,
    HanabiCard.Color.BLUE,
    HanabiCard.Color.PURPLE,
  );
  protected readonly values = List.of(
    1,
    2,
    3,
    4,
    5
  );

  ngOnInit(): void {
    this.calculatedDiscardPile = this.discardPile
      .groupBy(c => c.color)
      .map(cards => cards
        .map(c => c.value)
        .groupBy(value => value )
        .map(values => values.reduce((reduction) => reduction + 1, 0))
      );
  }

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
