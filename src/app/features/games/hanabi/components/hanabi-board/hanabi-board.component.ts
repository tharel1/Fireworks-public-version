import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HanabiCardComponent} from "../hanabi-card/hanabi-card.component";
import {List, Map} from "immutable";
import {HanabiCard} from "../../models/hanabi-card.model";
import {MatCard} from "@angular/material/card";
import {Changes} from "../../../../../core/utils/changes.model";
import {HanabiSettings} from "../../models/hanabi-settings.model";

@Component({
  selector: 'app-hanabi-board',
  standalone: true,
  imports: [
    HanabiCardComponent,
    MatCard,
    CommonModule
  ],
  templateUrl: './hanabi-board.component.html',
  styleUrls: ['./hanabi-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiBoardComponent implements OnChanges {
  @Input() board: List<HanabiCard> = List.of();
  @Input() settings: HanabiSettings = HanabiSettings.empty();

  protected calculatedBoard: Map<HanabiCard.Color, List<HanabiCard>> = Map();

  ngOnChanges(changes: Changes<HanabiBoardComponent>): void {
    if(changes.board)
      this.calculatedBoard = this.board.groupBy(c => c.color);
  }
}
