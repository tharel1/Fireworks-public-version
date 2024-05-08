import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {HanabiMarker} from "../../../models/hanabi-marker.model";

@Component({
  selector: 'app-hanabi-marker',
  standalone: true,
  imports: [
  ],
  templateUrl: './hanabi-marker.component.html',
  styleUrl: './hanabi-marker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiMarkerComponent {
  @Input() marker: HanabiMarker = HanabiMarker.empty();
}
