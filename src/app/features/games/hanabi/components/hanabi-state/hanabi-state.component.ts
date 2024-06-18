import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {HanabiGame} from "../../models/hanabi-game.model";
import {HanabiBoardComponent} from "../hanabi-board/hanabi-board.component";
import {HanabiDrawPileComponent} from "../hanabi-draw-pile/hanabi-draw-pile.component";
import {HanabiInfosComponent} from "../hanabi-infos/hanabi-infos.component";
import {HanabiDiscardPileComponent} from "../hanabi-discard-pile/hanabi-discard-pile.component";
import {HanabiPlayerComponent} from "../hanabi-player/hanabi-player.component";
import {CommonModule} from "@angular/common";
import {Changes} from "../../../../../core/utils/changes.model";
import {List} from "immutable";
import {HanabiPlayer} from "../../models/hanabi-player.model";
import {HanabiHistory} from "../../models/hanabi-history.model";
import {HanabiCommand} from "../../models/hanabi-command/hanabi-command.model";
import {SnackBarService} from "../../../../../shared/services/snack-bar.service";
import {HanabiAssistant} from "../../models/hanabi-assistant/hanabi-assistant.model";
import {HanabiPreferences} from "../../models/hanabi-preferences.model";
import {HanabiInfosFromPov} from "../../models/hanabi-infos/hanabi-infos-from-pov.model";

@Component({
  selector: 'app-hanabi-state',
  standalone: true,
  imports: [
    CommonModule,
    HanabiBoardComponent,
    HanabiDrawPileComponent,
    HanabiInfosComponent,
    HanabiDiscardPileComponent,
    HanabiPlayerComponent
  ],
  templateUrl: './hanabi-state.component.html',
  styleUrls: ['./hanabi-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiStateComponent implements OnChanges {
  @Input() state: HanabiGame = HanabiGame.empty();
  @Input() history: HanabiHistory = HanabiHistory.empty();
  @Input() preferences: HanabiPreferences = HanabiPreferences.empty();
  @Input() infos: HanabiInfosFromPov = HanabiInfosFromPov.empty();
  @Input() assistant: HanabiAssistant = HanabiAssistant.empty();

  @Output() command: EventEmitter<HanabiCommand> = new EventEmitter<HanabiCommand>();
  @Output() assistantUpdate: EventEmitter<HanabiAssistant> = new EventEmitter<HanabiAssistant>();

  protected selfPlayer: HanabiPlayer = HanabiPlayer.empty();
  protected orderedPlayers: List<HanabiPlayer> = List.of();
  protected isInHistory: boolean = false;

  constructor(
    private snackBarService: SnackBarService
  ) { }

  ngOnChanges(changes: Changes<HanabiStateComponent>): void {
    if (changes.state || changes.infos) {
      this.selfPlayer = this.infos.pov;
      this.orderedPlayers = List.of(
        ...this.state.players.skipUntil(p => p.equals(this.selfPlayer)),
        ...this.state.players.takeUntil(p => p.equals(this.selfPlayer)));
    }

    if (changes.history)
      this.isInHistory = this.history.isInHistory();
  }

  protected onCommand(command: HanabiCommand): void {
    if (this.state.finished)
      return this.snackBarService.error(`The game is finished.`);

    if (this.isInHistory)
      return this.snackBarService.error(`Please leave the history.`);

    if (!this.selfPlayer.playing)
      return this.snackBarService.error(`It's not your turn.`);

    const error = command.checkError(this.state);
    if (error)
      return this.snackBarService.warn(error);

    this.selfPlayer = HanabiPlayer.copy(this.selfPlayer).withPlaying(false).build();

    this.command.emit(command.fill(this.state));
  }

  protected onAssistantUpdate(assistant: HanabiAssistant): void {
    this.assistantUpdate.emit(assistant);
  }
}
