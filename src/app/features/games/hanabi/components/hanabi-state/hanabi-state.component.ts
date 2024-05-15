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
import {UserStore} from "../../../../../core/stores/user.store";
import {HanabiHistory} from "../../models/hanabi-history.model";
import {HanabiCommand} from "../../models/hanabi-command/hanabi-command.model";
import {SnackBarService} from "../../../../../shared/services/snack-bar.service";
import {HanabiAssistant} from "../../models/hanabi-assistant.model";
import {HanabiPreferences} from "../../models/hanabi-preferences.model";
import {HanabiInfos} from "../../models/hanabi-infos/hanabi-infos.model";

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
  @Input() game: HanabiGame = HanabiGame.empty();
  @Input() history: HanabiHistory = HanabiHistory.empty();
  @Input() preferences: HanabiPreferences = HanabiPreferences.empty();
  @Input() infos: HanabiInfos = HanabiInfos.empty();
  @Input() assistant: HanabiAssistant = HanabiAssistant.empty();

  @Output() command: EventEmitter<HanabiCommand> = new EventEmitter<HanabiCommand>();
  @Output() assistantUpdate: EventEmitter<HanabiAssistant> = new EventEmitter<HanabiAssistant>();

  protected state: HanabiGame = HanabiGame.empty();
  protected selfPlayer: HanabiPlayer = HanabiPlayer.empty();
  protected orderedPlayers: List<HanabiPlayer> = List.of();
  protected isInHistory: boolean = false;

  constructor(
    private userStore: UserStore,
    private snackBarService: SnackBarService
  ) { }

  ngOnChanges(changes: Changes<HanabiStateComponent>): void {
    if (changes.game || changes.history) {
      this.state = this.history.state ?? this.game;
      this.selfPlayer = this.state.players.find(p => p.user.equals(this.userStore.user)) ?? HanabiPlayer.empty();
      this.orderedPlayers = List.of(
        ...this.state.players.skipUntil(p => p.equals(this.selfPlayer)),
        ...this.state.players.takeUntil(p => p.equals(this.selfPlayer)));
      this.isInHistory = this.history.isInHistory();
    }
  }

  protected playerTrackBy(index: number, player: HanabiPlayer) {
    return player.user.id;
  }

  protected onCommand(command: HanabiCommand): void {
    if (this.isInHistory)
      return this.snackBarService.error(`You have to stop watching the history in order to play.`);

    if (!this.selfPlayer.playing)
      return this.snackBarService.error(`You have to wait your turn in order to play.`);

    const error = command.checkError(this.game);
    if (error)
      return this.snackBarService.warn(error);

    this.selfPlayer = HanabiPlayer.copy(this.selfPlayer).withPlaying(false).build();

    this.command.emit(command.fill(this.game));
  }

  protected onAssistantUpdate(assistant: HanabiAssistant): void {
    this.assistantUpdate.emit(assistant);
  }
}
