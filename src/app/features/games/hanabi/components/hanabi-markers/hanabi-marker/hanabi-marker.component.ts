import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {HanabiMarker} from "../../../models/hanabi-assistant/hanabi-marker.model";
import {MatCard} from "@angular/material/card";
import {MatRipple} from "@angular/material/core";
import {MatTooltip} from "@angular/material/tooltip";
import {MatBadge} from "@angular/material/badge";
import {Changes} from "../../../../../../core/utils/changes.model";

@Component({
  selector: 'app-hanabi-marker',
  standalone: true,
  imports: [
    MatCard,
    MatRipple,
    MatTooltip,
    MatBadge
  ],
  templateUrl: './hanabi-marker.component.html',
  styleUrl: './hanabi-marker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiMarkerComponent implements OnChanges {
  @Input() marker: HanabiMarker = HanabiMarker.empty();
  @Input() showWarning: boolean = false;

  protected tooltip: string = '';

  ngOnChanges(changes: Changes<HanabiMarkerComponent>): void {
    if (changes.marker || changes.showWarning)
      this.tooltip = this.marker.warning
        ? (this.showWarning ? this.marker.description : '')
        : this.marker.description;
  }
}
