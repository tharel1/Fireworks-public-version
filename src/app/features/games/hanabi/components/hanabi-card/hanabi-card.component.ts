import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {HanabiCard} from "../../models/hanabi-card.model";
import {MatIconModule} from "@angular/material/icon";
import {HanabiCommand} from "../../models/hanabi-command/hanabi-command.model";
import {HanabiCommandAdd} from "../../models/hanabi-command/hanabi-command-add.model";
import {MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {HanabiCommandRemove} from "../../models/hanabi-command/hanabi-command-remove.model";
import {MatChipsModule} from "@angular/material/chips";
import {HanabiNumberPipe} from "../../pipes/hanabi-number.pipe";
import {HanabiClueComponent} from "../hanabi-clue/hanabi-clue.component";

@Component({
  selector: 'app-hanabi-card',
  templateUrl: './hanabi-card.component.html',
  styleUrls: ['./hanabi-card.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    HanabiNumberPipe,
    HanabiClueComponent
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiCardComponent {
  @Input() card: HanabiCard = HanabiCard.empty();
  @Input() visible: boolean = true;
  @Input() canPlay: boolean = false;
  @Input() inHand: boolean = false;

  @Output() command: EventEmitter<HanabiCommand> = new EventEmitter<HanabiCommand>();

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  protected onAdd(): void {
    this.trigger.closeMenu();
    this.command.emit(HanabiCommandAdd.builder()
      .withValue(this.card.value)
      .build());
  }

  protected onRemove(): void {
    this.trigger.closeMenu();
    this.command.emit(HanabiCommandRemove.builder()
      .withValue(this.card.value)
      .build());
  }
}
