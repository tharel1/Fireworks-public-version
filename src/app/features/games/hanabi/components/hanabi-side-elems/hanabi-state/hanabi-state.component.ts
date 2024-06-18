import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {HanabiGame} from "../../../models/hanabi-game.model";
import {CommonModule} from "@angular/common";
import {MatCard, MatCardContent} from "@angular/material/card";
import {TooltipInfoComponent} from "../../../../../../shared/components/tooltip-info/tooltip-info.component";
import {HanabiInfosFromPov} from "../../../models/hanabi-infos/hanabi-infos-from-pov.model";
import {HanabiPlayer} from "../../../models/hanabi-player.model";
import {Changes} from "../../../../../../core/utils/changes.model";
import {MatIcon} from "@angular/material/icon";
import {Observable, timer} from "rxjs";
import {MatIconButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {HanabiHistory} from "../../../models/hanabi-history.model";
import {
  HanabiScoresDialogComponent,
  HanabiScoresDialogData
} from "../hanabi-scores-dialog/hanabi-scores-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-hanabi-state',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    TooltipInfoComponent,
    MatIcon,
    MatIconButton,
    MatTooltip
  ],
  templateUrl: './hanabi-state.component.html',
  styleUrl: './hanabi-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiStateComponent implements OnChanges {
  @Input() game: HanabiGame = HanabiGame.empty();
  @Input() history: HanabiHistory = HanabiHistory.empty();
  @Input() infos: HanabiInfosFromPov = HanabiInfosFromPov.empty();

  protected currentPlayer?: HanabiPlayer;
  protected state?: HanabiState;

  protected readonly beat$: Observable<number> = timer(0, 1500);
  protected readonly HanabiState = HanabiState;

  constructor(
    private readonly dialog: MatDialog,
  ) {}

  ngOnChanges(changes: Changes<HanabiStateComponent>): void {
    if (changes.game || changes.history || changes.infos) {
      this.currentPlayer = this.game.currentPlayer();
      this.state = this.buildState(this.history.isInHistory(), this.game.finished, this.currentPlayer, this.infos.pov);
    }
  }

  private buildState(isInHistory: boolean,
                     finished: boolean,
                     currentPlayer: HanabiPlayer | undefined,
                     selfPlayer: HanabiPlayer): HanabiState | undefined {

    if (isInHistory) return HanabiState.IN_HISTORY;
    else if (finished) return HanabiState.GAME_FINISHED;
    else if (selfPlayer.equals(currentPlayer)) return HanabiState.SELF_TURN;
    else if (currentPlayer) return HanabiState.OTHER_TURN;
    return undefined;
  }

  protected onScores(): void {
    this.dialog.open<HanabiScoresDialogComponent, HanabiScoresDialogData>(
      HanabiScoresDialogComponent,
      { data: { game: this.game, infos: this.infos }}
    );
  }
}

enum HanabiState {
  SELF_TURN = 'SELF_TURN',
  OTHER_TURN = 'OTHER_TURN',
  IN_HISTORY = 'IN_HISTORY',
  GAME_FINISHED = 'GAME_FINISHED'
}
