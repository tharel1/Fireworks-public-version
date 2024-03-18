import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HanabiCardComponent} from "../hanabi-card/hanabi-card.component";
import {List, Map} from "immutable";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {HanabiCard} from "../../models/hanabi-card.model";
import {HanabiBoardCardComponent} from "../hanabi-board-card/hanabi-board-card.component";
import {MatCardModule} from "@angular/material/card";
import {Changes} from "../../../../../core/utils/changes.model";
import {HanabiSettings} from "../../models/hanabi-settings.model";

@Component({
  selector: 'app-hanabi-board',
  standalone: true,
  imports: [CommonModule, HanabiCardComponent, DragDropModule, HanabiBoardCardComponent, MatCardModule],
  templateUrl: './hanabi-board.component.html',
  styleUrls: ['./hanabi-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiBoardComponent implements OnInit, OnChanges {
  @Input() board: List<HanabiCard> = List.of();
  @Input() settings: HanabiSettings = HanabiSettings.empty();

  protected calculatedBoard: Map<HanabiCard.Color, HanabiCard | undefined> = Map();

  ngOnInit(): void {
    this.calculatedBoard = this.board.groupBy(c => c.color).map(c => c.last());
  }

  ngOnChanges(changes: Changes<HanabiBoardComponent>): void {
    if(changes.board)
      this.calculatedBoard = this.board.groupBy(c => c.color).map(c => c.last());
  }
}
