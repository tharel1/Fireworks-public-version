import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {RoadmapFeature} from "../../models/roadmap-feature.model";
import {RoadmapFeatureCardComponent} from "../roadmap-feature-card/roadmap-feature-card.component";
import {MatCard} from "@angular/material/card";
import {Changes} from "../../../../core/utils/changes.model";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-roadmap-feature',
  standalone: true,
  imports: [
    CommonModule,
    RoadmapFeatureCardComponent,
    MatCard,
    MatIcon,
    MatTooltip
  ],
  templateUrl: './roadmap-feature.component.html',
  styleUrl: './roadmap-feature.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoadmapFeatureComponent implements OnChanges {
  @Input() feature: RoadmapFeature = RoadmapFeature.empty();
  @Input() direction: RoadmapDirection = 'left';

  protected color: string = '';
  protected isWip: boolean = false;

  ngOnChanges(changes: Changes<RoadmapFeatureComponent>): void {
    if (changes.feature) {
      this.color = this.feature.color();
      this.isWip = this.feature.type === RoadmapFeature.Type.WIP;
    }
  }
}

export type RoadmapDirection = 'left' | 'right';
