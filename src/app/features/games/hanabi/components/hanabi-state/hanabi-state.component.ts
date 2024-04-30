import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {HanabiGame} from "../../models/hanabi-game.model";
import {HanabiSettings} from "../../models/hanabi-settings.model";
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
import {MatSnackBar} from "@angular/material/snack-bar";

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
  @Input() settings: HanabiSettings = HanabiSettings.empty();
  @Input() history: HanabiHistory = HanabiHistory.empty();

  @Output() gameUpdate: EventEmitter<HanabiGame> = new EventEmitter<HanabiGame>();

  protected state: HanabiGame = HanabiGame.empty();
  protected selfPlayer: HanabiPlayer = HanabiPlayer.empty();
  protected orderedPlayers: List<HanabiPlayer> = List.of();
  protected isInHistory: boolean = false;

  constructor(
    private userStore: UserStore,
    private matSnackBar: MatSnackBar
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

  protected onCommand(command: HanabiCommand): void {
    if (this.isInHistory) throw new Error(`Can't update game while in history mode.`);

    const error = command.checkError(this.game);
    if (error) {
      this.matSnackBar.open(error, 'Close', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      return;
    }

    this.selfPlayer = HanabiPlayer.copy(this.selfPlayer).withPlaying(false).build();

    const filledCommand = command.fill(this.game);
    this.gameUpdate.emit(HanabiGame.copy(filledCommand.update(this.game))
      .withHistory(this.game.history.push(filledCommand))
      .build())
  }
}
