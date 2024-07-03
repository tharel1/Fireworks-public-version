import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {HanabiGame} from "../../../../models/hanabi-game.model";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {
  HanabiScoresDialogComponent,
  HanabiScoresDialogData
} from "../../hanabi-scores-dialog/hanabi-scores-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {HanabiInfosFromPov} from "../../../../models/hanabi-infos/hanabi-infos-from-pov.model";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-hanabi-state-finished',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './hanabi-state-finished.component.html',
  styleUrl: './hanabi-state-finished.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiStateFinishedComponent {
  @Input() game: HanabiGame = HanabiGame.empty();
  @Input() infos: HanabiInfosFromPov = HanabiInfosFromPov.empty();

  constructor(
    private readonly dialog: MatDialog,
  ) {}

  protected onScores(): void {
    this.dialog.open<HanabiScoresDialogComponent, HanabiScoresDialogData>(
      HanabiScoresDialogComponent,
      { data: { game: this.game, infos: this.infos }}
    );
  }
}
