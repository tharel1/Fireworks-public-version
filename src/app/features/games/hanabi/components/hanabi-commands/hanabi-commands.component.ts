import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {HanabiCommandComponent} from "./hanabi-command/hanabi-command.component";
import {CommonModule} from "@angular/common";
import {HanabiCommand} from "../../models/hanabi-command/hanabi-command.model";
import {HanabiHistory} from "../../models/hanabi-history.model";
import {List} from "immutable";
import {Changes} from "../../../../../core/utils/changes.model";
import {MatIcon} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-hanabi-commands',
  standalone: true,
  imports: [
    CommonModule,
    HanabiCommandComponent,
    MatIcon,
    MatDivider
  ],
  templateUrl: './hanabi-commands.component.html',
  styleUrl: './hanabi-commands.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiCommandsComponent implements OnChanges {
  @Input() history: HanabiHistory = HanabiHistory.empty();

  @Output() historyUpdate: EventEmitter<HanabiHistory> = new EventEmitter<HanabiHistory>();

  protected isInHistory: boolean = false;
  protected futureCommands: List<HanabiCommand> = List.of();
  protected pastCommands: List<HanabiCommand> = List.of();

  ngOnChanges(changes: Changes<HanabiCommandsComponent>): void {
    if (changes.history) {
      this.isInHistory = this.history.isInHistory();
      const commands = this.history.commands;
      this.futureCommands = commands.take(this.history.index !== undefined ? this.history.index : commands.size);
      this.pastCommands = commands.skip(this.history.index !== undefined ? this.history.index : commands.size);
    }
  }

  onCommand(command: HanabiCommand): void {
    this.historyUpdate.emit(this.history.goTo(command));
  }
}
