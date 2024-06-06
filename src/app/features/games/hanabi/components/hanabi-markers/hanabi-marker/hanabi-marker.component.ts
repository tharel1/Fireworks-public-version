import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {HanabiMarker} from "../../../models/hanabi-marker.model";
import {MatCard} from "@angular/material/card";
import {MatRipple} from "@angular/material/core";

@Component({
  selector: 'app-hanabi-marker',
  standalone: true,
  imports: [
    MatCard,
    MatRipple
  ],
  templateUrl: './hanabi-marker.component.html',
  styleUrl: './hanabi-marker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiMarkerComponent {
  @Input() marker: HanabiMarker = HanabiMarker.empty();
}
