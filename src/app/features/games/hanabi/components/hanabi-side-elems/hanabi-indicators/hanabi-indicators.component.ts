import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {TooltipInfoComponent} from "../../../../../../shared/components/tooltip-info/tooltip-info.component";
import {Changes} from "../../../../../../core/utils/changes.model";
import {HanabiInfos} from "../../../models/hanabi-infos/hanabi-infos.model";

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
  @Input() infos: HanabiInfos = HanabiInfos.empty();

  protected efficiency: number = 0;
  protected pace: number = 0;

  ngOnChanges(changes: Changes<HanabiIndicatorsComponent>): void {
    if (changes.infos) {
      this.efficiency = this.infos.efficiency();
      this.pace = this.infos.pace();
    }
  }

}
