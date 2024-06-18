import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {HanabiGame} from "../../models/hanabi-game.model";
import {Changes} from "../../../../../core/utils/changes.model";
import {MatCard, MatCardContent} from "@angular/material/card";
import {TooltipInfoComponent} from "../../../../../shared/components/tooltip-info/tooltip-info.component";

@Component({
  selector: 'app-hanabi-infos',
  standalone: true,
  imports: [CommonModule, MatIcon, MatTooltip, MatCard, MatCardContent, TooltipInfoComponent],
  templateUrl: './hanabi-infos.component.html',
  styleUrls: ['./hanabi-infos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiInfosComponent implements OnChanges {
  @Input() game: HanabiGame = HanabiGame.empty();

  protected score: number = 0;
  protected maxScore: number = 0;
  protected maxPossibleScore: number = 0;

  ngOnChanges(changes: Changes<HanabiInfosComponent>): void {
    if (changes.game) {
      this.score = this.game.score();
      this.maxScore = this.game.settings.maxScore();
      this.maxPossibleScore = this.game.maxPossibleScore();
    }
  }
}
