import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {HanabiGame} from "../../models/hanabi-game.model";
import {Changes} from "../../../../../core/utils/changes.model";

@Component({
  selector: 'app-hanabi-infos',
  standalone: true,
  imports: [CommonModule, MatIcon, MatTooltip],
  templateUrl: './hanabi-infos.component.html',
  styleUrls: ['./hanabi-infos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiInfosComponent implements OnChanges {
  @Input() game: HanabiGame = HanabiGame.empty();

  protected score: number = 0;
  protected maxScore: number = 0;

  ngOnChanges(changes: Changes<HanabiInfosComponent>): void {
    if (changes.game) {
      this.score = this.game.score();
      this.maxScore = this.game.settings.maxScore();
    }
  }
}
