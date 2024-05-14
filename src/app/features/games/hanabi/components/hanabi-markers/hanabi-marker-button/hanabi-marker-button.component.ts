import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {MatMenu, MatMenuContent, MatMenuTrigger} from "@angular/material/menu";
import {CommonModule} from "@angular/common";
import {List} from "immutable";
import {HanabiMarker} from "../../../models/hanabi-marker.model";
import {Changes} from "../../../../../../core/utils/changes.model";
import {HanabiCard} from "../../../models/hanabi-card.model";
import {HanabiMarkerChipComponent} from "../hanabi-marker-chip/hanabi-marker-chip.component";
import {MatDivider} from "@angular/material/divider";
import {HanabiSettings} from "../../../models/hanabi-settings.model";

@Component({
  selector: 'app-hanabi-marker-button',
  standalone: true,
  imports: [
    CommonModule,
    MatMenuTrigger,
    MatMenu,
    MatMenuContent,
    HanabiMarkerChipComponent,
    MatDivider,
  ],
  templateUrl: './hanabi-marker-button.component.html',
  styleUrl: './hanabi-marker-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiMarkerButtonComponent implements OnChanges {
  @Input() markers: List<HanabiMarker> = List.of();
  @Input() card: HanabiCard = HanabiCard.empty();
  @Input() settings: HanabiSettings = HanabiSettings.empty();
  @Input() visible: boolean = false;

  @Output() markersUpdate: EventEmitter<List<HanabiMarker>> = new EventEmitter<List<HanabiMarker>>();

  protected updatedMarkers: List<HanabiMarker> = List.of();
  protected mainMarkerRows: List<List<HanabiMarker>> = List.of();
  protected secondaryMarkerRows: List<List<HanabiMarker>> = List.of();

  ngOnChanges(changes: Changes<HanabiMarkerButtonComponent>): void {
    if (changes.markers || changes.card || changes.settings) {
      this.updatedMarkers = this.markers;
    }
  }

  private buildMainMarkerRows(): List<List<HanabiMarker>> {
    let rows: List<List<HanabiMarker>> = List.of();

    if (this.card.isClued()) {
      if (!this.card.valueClue.isEmpty()) rows = rows.push(this.markersByValue(this.card.valueClue.last(), this.settings));
      if (!this.card.colorClue.isEmpty()) rows = rows.push(this.markersByColor(this.card.colorClue.last(), this.settings));
    } else {
      rows = rows.push(
        ...this.settings.colors.map(c => this.markersByColor(c, this.settings))
      );
    }

    rows = rows.push(this.specialMarkers());

    return rows;
  }

  private buildSecondaryMarkerRows(): List<List<HanabiMarker>> {
    return List.of(

    );
  }

  private simpleValueMarkers(settings: HanabiSettings): List<HanabiMarker> {
    return settings.values().map(i => HanabiMarker.builder()
      .withValue((i).toString())
      .build());
  }

  private simpleColorMarkers(settings: HanabiSettings): List<HanabiMarker> {
    return settings.colors.map(c => HanabiMarker.builder()
      .withColor(c)
      .build());
  }

  private markersByValue(value: number, settings: HanabiSettings): List<HanabiMarker> {
    return this.simpleColorMarkers(settings).map(m => HanabiMarker.copy(m)
      .withValue(value.toString())
      .build());
  }

  private markersByColor(color: HanabiCard.Color, settings: HanabiSettings): List<HanabiMarker> {
    return this.simpleValueMarkers(settings).map(m => HanabiMarker.copy(m)
      .withColor(color)
      .build())
  }

  private specialMarkers(): List<HanabiMarker> {
    return List.of(
      HanabiMarker.builder().withValue('✨').build(),
      HanabiMarker.builder().withValue('📍').build(),
      HanabiMarker.builder().withValue('🗑️').build(),
      HanabiMarker.builder().withValue('🔧').build(),
      HanabiMarker.builder().withValue('💥').build(),
      HanabiMarker.builder().withValue('📝').build(),
    )
  }

  // TODO: perf issue calling this method in template
  protected isSelected(marker: HanabiMarker): boolean {
    return this.updatedMarkers.some(m => marker.isIdentical(m));
  }

  protected onSelectMarker(marker: HanabiMarker): void {
    this.updatedMarkers = this.updatedMarkers.push(marker);
  }

  protected onDeselectMarker(marker: HanabiMarker): void {
    this.updatedMarkers = this.updatedMarkers.filter(m => !marker.isIdentical(m));
  }

  protected onMenuOpen(): void {
    this.mainMarkerRows = this.buildMainMarkerRows();
    this.secondaryMarkerRows = this.buildSecondaryMarkerRows();
  }

  protected onMenuClose(): void {
    this.mainMarkerRows = List.of();
    this.secondaryMarkerRows = List.of();
    this.markersUpdate.emit(this.updatedMarkers);
  }
}
