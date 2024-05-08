import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {HanabiMarkerComponent} from "./hanabi-marker/hanabi-marker.component";
import {HanabiMarkerButtonComponent} from "./hanabi-marker-button/hanabi-marker-button.component";
import {HanabiCard} from "../../models/hanabi-card.model";
import {List} from "immutable";
import {HanabiMarker} from "../../models/hanabi-marker.model";
import {HanabiSettings} from "../../models/hanabi-settings.model";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-hanabi-markers',
  standalone: true,
  imports: [
    CommonModule,
    HanabiMarkerButtonComponent,
    HanabiMarkerComponent
  ],
  templateUrl: './hanabi-markers.component.html',
  styleUrl: './hanabi-markers.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiMarkersComponent {
  @Input() markers: List<HanabiMarker> = List.of();
  @Input() card: HanabiCard = HanabiCard.empty();
  @Input() settings: HanabiSettings = HanabiSettings.empty();
  @Input() buttonVisible: boolean = false;

  @Output() markersUpdate: EventEmitter<List<HanabiMarker>> = new EventEmitter<List<HanabiMarker>>();

  protected onMarkersUpdate(markers: List<HanabiMarker>): void {
    this.markersUpdate.emit(markers);
  }

  protected onMarkerClick(marker: HanabiMarker): void {
    this.markersUpdate.emit(this.markers.filter(m => !marker.isIdentical(m)));
  }
}
