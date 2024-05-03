import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {TooltipInfoComponent} from "../../../../../shared/components/tooltip-info/tooltip-info.component";
import {HanabiGame} from "../../models/hanabi-game.model";
import {Changes} from "../../../../../core/utils/changes.model";

@Component({
  selector: 'app-hanabi-indicators',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    TooltipInfoComponent
  ],
  templateUrl: './hanabi-indicators.component.html',
  styleUrl: './hanabi-indicators.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiIndicatorsComponent implements OnChanges {
  @Input() game: HanabiGame = HanabiGame.empty();

  protected efficiency?: number;
  protected pace: number = 0;

  ngOnChanges(changes: Changes<HanabiIndicatorsComponent>): void {
    if (changes.game) {
      this.efficiency = this.game.efficiency();
      this.pace = this.game.pace();
    }
  }

}
