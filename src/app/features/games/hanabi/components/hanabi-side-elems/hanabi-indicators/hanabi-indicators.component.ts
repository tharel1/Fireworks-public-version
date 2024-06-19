import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {TooltipInfoComponent} from "../../../../../../shared/components/tooltip-info/tooltip-info.component";
import {Changes} from "../../../../../../core/utils/changes.model";
import {HanabiInfos} from "../../../models/hanabi-infos/hanabi-infos.model";
import {HanabiConstants} from "../../../utils/hanabi-constants";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-hanabi-indicators',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardContent,
    TooltipInfoComponent,
    MatTooltip
  ],
  templateUrl: './hanabi-indicators.component.html',
  styleUrl: './hanabi-indicators.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiIndicatorsComponent implements OnChanges {
  @Input() infos: HanabiInfos = HanabiInfos.empty();

  protected requiredEfficiency: number = 0;
  protected pace: number = 0;
  protected efficiencyDetails: string = '';

  protected readonly HanabiConstants = HanabiConstants;

  ngOnChanges(changes: Changes<HanabiIndicatorsComponent>): void {
    if (changes.infos) {
      this.requiredEfficiency = this.infos.requiredEfficiency();
      this.pace = this.infos.pace();
      this.efficiencyDetails = this.buildEfficiencyDetails(this.infos);
    }
  }

  private buildEfficiencyDetails(infos: HanabiInfos): string {
    return `Remaining cards to clue (=${infos.remainingCardToClue()})
            Remaining clues (=${infos.remainingClues()})`;
  }

}
