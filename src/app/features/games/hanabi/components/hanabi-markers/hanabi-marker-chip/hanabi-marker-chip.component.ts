import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {HanabiMarker} from "../../../models/hanabi-marker.model";
import {MatChipOption} from "@angular/material/chips";

@Component({
  selector: 'app-hanabi-marker-chip',
  standalone: true,
  imports: [
    MatChipOption
  ],
  templateUrl: './hanabi-marker-chip.component.html',
  styleUrl: './hanabi-marker-chip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiMarkerChipComponent {
  @Input() marker: HanabiMarker = HanabiMarker.empty();
  @Input() selected: boolean = false;

  @Output() selectMarker: EventEmitter<HanabiMarker> = new EventEmitter<HanabiMarker>();
  @Output() deselectMarker: EventEmitter<HanabiMarker> = new EventEmitter<HanabiMarker>();

  protected onClick(): void {
    if (this.selected) this.deselectMarker.emit(this.marker);
    else this.selectMarker.emit(this.marker);
  }
}
