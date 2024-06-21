import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {Changes} from "../../../../core/utils/changes.model";
import {AsyncPipe, CommonModule, TitleCasePipe} from "@angular/common";
import {Observable, timer} from "rxjs";
import {RoadmapFeature} from "../../models/roadmap-feature.model";

@Component({
  selector: 'app-roadmap-feature-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    TitleCasePipe,
    AsyncPipe
  ],
  templateUrl: './roadmap-feature-card.component.html',
  styleUrl: './roadmap-feature-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoadmapFeatureCardComponent implements OnChanges {
  @Input() feature: RoadmapFeature = RoadmapFeature.empty();

  protected color: string = '';
  protected icon: string = '';
  protected isWip: boolean = false;

  protected readonly beat$: Observable<number> = timer(0, 1000);

  ngOnChanges(changes: Changes<RoadmapFeatureCardComponent>): void {
    if (changes.feature) {
      this.color = this.feature.color();
      this.icon = this.feature.icon();
      this.isWip = this.feature.type === RoadmapFeature.Type.WIP;
    }
  }
}
