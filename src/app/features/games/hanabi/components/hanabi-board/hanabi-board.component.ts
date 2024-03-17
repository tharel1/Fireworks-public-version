import {ChangeDetectionStrategy, Component, Input, OnChanges, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HanabiCardComponent} from "../hanabi-card/hanabi-card.component";
import {List, Map} from "immutable";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {HanabiCard} from "../../models/hanabi-card.model";
import {HanabiBoardCardComponent} from "../hanabi-board-card/hanabi-board-card.component";
import {MatCardModule} from "@angular/material/card";
import {Changes} from "../../../../../core/utils/changes.model";

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
  protected calculatedBoard: Map<HanabiCard.Color, HanabiCard | undefined> = Map();

  protected readonly colors = List.of(
    HanabiCard.Color.RED,
    HanabiCard.Color.YELLOW,
    HanabiCard.Color.GREEN,
    HanabiCard.Color.BLUE,
    HanabiCard.Color.PURPLE,
  );

  ngOnInit(): void {
    this.calculatedBoard = Map([
      [HanabiCard.Color.RED, undefined],
      [HanabiCard.Color.YELLOW, undefined],
      [HanabiCard.Color.GREEN, undefined],
      [HanabiCard.Color.BLUE, undefined],
      [HanabiCard.Color.PURPLE, undefined]
    ]);
    this.calculatedBoard = this.board.groupBy(c => c.color).map(c => c.last());
  }

  ngOnChanges(changes: Changes<HanabiBoardComponent>): void {
    if(changes.board)
      this.calculatedBoard = this.board.groupBy(c => c.color).map(c => c.last());
  }
}
