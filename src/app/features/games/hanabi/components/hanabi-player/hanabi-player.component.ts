import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HanabiCommand} from "../../models/hanabi-command/hanabi-command.model";
import {HanabiHandComponent} from "../hanabi-hand/hanabi-hand.component";
import {HanabiPlayer} from "../../models/hanabi-player.model";
import {MatCardModule} from "@angular/material/card";
import {PlayerWaitingComponent} from "../../../../../shared/components/player-waiting/player-waiting.component";

@Component({
  selector: 'app-hanabi-player',
  standalone: true,
  imports: [CommonModule, HanabiHandComponent, MatCardModule, PlayerWaitingComponent],
  templateUrl: './hanabi-player.component.html',
  styleUrls: ['./hanabi-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiPlayerComponent {
  @Input() player: HanabiPlayer = HanabiPlayer.empty();
  @Input() isSelf: boolean = false;
  @Input() canPlay: boolean = false;

  @Output() command: EventEmitter<HanabiCommand> = new EventEmitter<HanabiCommand>();

  protected onCommand(command: HanabiCommand): void {
    this.command.emit(command);
  }
}
