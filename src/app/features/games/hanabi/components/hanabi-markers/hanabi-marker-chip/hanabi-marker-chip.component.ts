import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {HanabiMarker} from "../../../models/hanabi-marker.model";
import {MatChipOption} from "@angular/material/chips";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-hanabi-marker-chip',
  standalone: true,
  imports: [
    MatChipOption,
    MatTooltip
  ],
  templateUrl: './hanabi-marker-chip.component.html',
  styleUrl: './hanabi-marker-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiMarkerChipComponent {
  @Input() marker: HanabiMarker = HanabiMarker.empty();
  @Input() selected: boolean = false;
}
