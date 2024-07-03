import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {HanabiGame} from "../../../models/hanabi-game.model";
import {CommonModule} from "@angular/common";
import {HanabiInfosFromPov} from "../../../models/hanabi-infos/hanabi-infos-from-pov.model";
import {HanabiPlayer} from "../../../models/hanabi-player.model";
import {Changes} from "../../../../../../core/utils/changes.model";
import {HanabiHistory} from "../../../models/hanabi-history.model";
import {HanabiStateFinishedComponent} from "./hanabi-state-finished/hanabi-state-finished.component";
import {HanabiStateInHistoryComponent} from "./hanabi-state-in-history/hanabi-state-in-history.component";
import {HanabiStateOtherTurnComponent} from "./hanabi-state-other-turn/hanabi-state-other-turn.component";
import {HanabiStateSelfTurnComponent} from "./hanabi-state-self-turn/hanabi-state-self-turn.component";

@Component({
  selector: 'app-hanabi-state',
  standalone: true,
  imports: [
    CommonModule,
    HanabiStateFinishedComponent,
    HanabiStateInHistoryComponent,
    HanabiStateOtherTurnComponent,
    HanabiStateSelfTurnComponent
  ],
  templateUrl: './hanabi-state.component.html',
  styleUrl: './hanabi-state.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiStateComponent implements OnChanges {
  @Input() game: HanabiGame = HanabiGame.empty();
  @Input() history: HanabiHistory = HanabiHistory.empty();
  @Input() infos: HanabiInfosFromPov = HanabiInfosFromPov.empty();

  protected state?: HanabiState;

  protected readonly HanabiState = HanabiState;

  ngOnChanges(changes: Changes<HanabiStateComponent>): void {
    if (changes.game || changes.history || changes.infos) {
      this.state = this.buildState(this.history.isInHistory(), this.game.finished, this.game.currentPlayer(), this.infos.pov);
    }
  }

  private buildState(isInHistory: boolean,
                     finished: boolean,
                     currentPlayer: HanabiPlayer | undefined,
                     selfPlayer: HanabiPlayer): HanabiState | undefined {

    if (isInHistory) return HanabiState.IN_HISTORY;
    else if (finished) return HanabiState.FINISHED;
    else if (selfPlayer.equals(currentPlayer)) return HanabiState.SELF_TURN;
    else if (currentPlayer) return HanabiState.OTHER_TURN;
    return undefined;
  }
}

enum HanabiState {
  SELF_TURN = 'SELF_TURN',
  OTHER_TURN = 'OTHER_TURN',
  IN_HISTORY = 'IN_HISTORY',
  FINISHED = 'FINISHED'
}
