import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule} from "@angular/material/dialog";
import {HanabiScore} from "../../../models/hanabi-score.model";
import {MatTableModule} from "@angular/material/table";
import {MatButton} from "@angular/material/button";
import {CommonModule} from "@angular/common";
import {HanabiGame} from "../../../models/hanabi-game.model";
import {HanabiInfosFromPov} from "../../../models/hanabi-infos/hanabi-infos-from-pov.model";
import {HanabiPlayer} from "../../../models/hanabi-player.model";

@Component({
  selector: 'app-hanabi-scores-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatButton
  ],
  templateUrl: './hanabi-scores-dialog.component.html',
  styleUrl: './hanabi-scores-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiScoresDialogComponent {

  protected scores: HanabiScore[] = [];
  protected maxScore: number = 0;
  protected selfPlayer: HanabiPlayer = HanabiPlayer.empty();
  protected selfTrend: HanabiScore.Trend;
  protected title: string = '';

  protected readonly columns: string[] = ['name', 'score'];

  constructor(
    @Inject(MAT_DIALOG_DATA) private readonly data: HanabiScoresDialogData
  ) {
    this.scores = data.game.createScores().sortBy(s => s.rank).toArray();
    this.maxScore = data.game.settings.maxScore();
    this.selfPlayer = data.infos.pov;
    this.selfTrend = (this.scores.find(s => s.user.equals(this.selfPlayer.user)) ?? HanabiScore.empty()).trend(data.game);
    this.title = this.buildTitle(this.selfTrend);
  }

  private buildTitle(trend: HanabiScore.Trend): string {
    switch (trend) {
      case "perfect":
        return `Perfect!`;
      case "great":
        return `Well played!`;
      case "ok":
        return `Not bad!`;
      case "bad":
        return `Try again!`;
    }
  }

}

export interface HanabiScoresDialogData {
  game: HanabiGame,
  infos: HanabiInfosFromPov
}
