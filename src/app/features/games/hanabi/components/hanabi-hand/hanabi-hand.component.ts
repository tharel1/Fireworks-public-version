import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HanabiCardComponent} from "../hanabi-card/hanabi-card.component";
import {List} from "immutable";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {HanabiCard} from "../../models/hanabi-card.model";
import {HanabiCommand} from "../../models/hanabi-command/hanabi-command.model";
import {MatCardModule} from "@angular/material/card";

@Component({
  selector: 'app-hanabi-hand',
  standalone: true,
  imports: [CommonModule, HanabiCardComponent, DragDropModule, MatCardModule],
  templateUrl: './hanabi-hand.component.html',
  styleUrls: ['./hanabi-hand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiHandComponent {
  @Input() cards: List<HanabiCard> = List.of();
  @Input() visible: boolean = false;
  @Input() canPlay: boolean = false;

  @Output() command: EventEmitter<HanabiCommand> = new EventEmitter<HanabiCommand>();

  protected onCommand(command: HanabiCommand): void {
    this.command.emit(command);
  }
}
