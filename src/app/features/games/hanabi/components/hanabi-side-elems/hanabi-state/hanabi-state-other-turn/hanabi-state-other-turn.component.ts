import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {HanabiGame} from "../../../../models/hanabi-game.model";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {HanabiPlayer} from "../../../../models/hanabi-player.model";
import {Changes} from "../../../../../../../core/utils/changes.model";

@Component({
  selector: 'app-hanabi-state-other-turn',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './hanabi-state-other-turn.component.html',
  styleUrl: './hanabi-state-other-turn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiStateOtherTurnComponent implements OnChanges {
  @Input() game: HanabiGame = HanabiGame.empty();

  protected currentPlayer?: HanabiPlayer;
  protected infoMessage?: string;

  ngOnChanges(changes: Changes<HanabiStateOtherTurnComponent>): void {
    if (changes.game) {
      this.currentPlayer = this.game.currentPlayer();
      this.infoMessage = this.game.infoMessage();
    }
  }
}
