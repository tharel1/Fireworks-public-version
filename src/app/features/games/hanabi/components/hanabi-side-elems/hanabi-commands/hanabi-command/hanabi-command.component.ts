import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {HanabiCommand} from "../../../../models/hanabi-command/hanabi-command.model";
import {CommonModule} from "@angular/common";
import {MatCard, MatCardContent} from "@angular/material/card";
import {HanabiCommandPlayComponent} from "./hanabi-command-play/hanabi-command-play.component";
import {HanabiCommandPlay} from "../../../../models/hanabi-command/hanabi-command-play.model";
import {HanabiCommandDiscardComponent} from "./hanabi-command-discard/hanabi-command-discard.component";
import {HanabiCommandClueColorComponent} from "./hanabi-command-clue-color/hanabi-command-clue-color.component";
import {HanabiCommandClueValueComponent} from "./hanabi-command-clue-value/hanabi-command-clue-value.component";
import {Changes} from "../../../../../../../core/utils/changes.model";
import {HanabiCommandDiscard} from "../../../../models/hanabi-command/hanabi-command-discard.model";
import {HanabiCommandClueColor} from "../../../../models/hanabi-command/hanabi-command-clue-color.model";
import {HanabiCommandClueValue} from "../../../../models/hanabi-command/hanabi-command-clue-value.model";

@Component({
  selector: 'app-hanabi-command',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    HanabiCommandPlayComponent,
    HanabiCommandDiscardComponent,
    HanabiCommandClueColorComponent,
    HanabiCommandClueValueComponent
  ],
  templateUrl: './hanabi-command.component.html',
  styleUrl: './hanabi-command.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiCommandComponent implements OnChanges {
  @Input() command: HanabiCommand = HanabiCommandPlay.empty();

  @Output() commandUpdate: EventEmitter<HanabiCommand> = new EventEmitter<HanabiCommand>();

  protected commandPlay: HanabiCommandPlay = HanabiCommandPlay.empty();
  protected commandDiscard: HanabiCommandDiscard = HanabiCommandDiscard.empty();
  protected commandClueColor: HanabiCommandClueColor = HanabiCommandClueColor.empty();
  protected commandClueValue: HanabiCommandClueValue = HanabiCommandClueValue.empty();

  protected readonly Type = HanabiCommand.Type;

  ngOnChanges(changes: Changes<HanabiCommandComponent>): void {
    if (changes.command) {
      switch (this.command.type) {
        case HanabiCommand.Type.PLAY:
          this.commandPlay = this.command as HanabiCommandPlay;
          break;
        case HanabiCommand.Type.DISCARD:
          this.commandDiscard = this.command as HanabiCommandDiscard;
          break;
        case HanabiCommand.Type.CLUE_COLOR:
          this.commandClueColor = this.command as HanabiCommandClueColor;
          break;
        case HanabiCommand.Type.CLUE_VALUE:
          this.commandClueValue = this.command as HanabiCommandClueValue;
      }
    }
  }

  protected onClick(): void {
    this.commandUpdate.emit(this.command);
  }
}
