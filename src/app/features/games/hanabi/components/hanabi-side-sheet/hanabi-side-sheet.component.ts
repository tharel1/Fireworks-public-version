import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {MatDivider} from "@angular/material/divider";
import {MatIconButton} from "@angular/material/button";
import {HanabiAssistant} from "../../models/hanabi-assistant.model";
import {Changes} from "../../../../../core/utils/changes.model";
import {HanabiCardInfos} from "../../models/hanabi-infos/hanabi-card-infos.model";
import {HanabiHint} from "../../models/hanabi-hint.model";
import {HanabiGame} from "../../models/hanabi-game.model";
import {HanabiCard} from "../../models/hanabi-card.model";
import {MatCard, MatCardContent} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {HanabiMarker} from "../../models/hanabi-marker.model";
import {List} from "immutable";
import {HanabiSettings} from "../../models/hanabi-settings.model";
import {HanabiInfosFromPov} from "../../models/hanabi-infos/hanabi-infos-from-pov.model";
import {MatChipListbox} from "@angular/material/chips";
import {HanabiMarkerChipComponent} from "../hanabi-markers/hanabi-marker-chip/hanabi-marker-chip.component";
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-hanabi-side-sheet',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    MatDivider,
    MatIconButton,
    MatCard,
    MatCardContent,
    MatChipListbox,
    HanabiMarkerChipComponent,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatTooltip
  ],
  templateUrl: './hanabi-side-sheet.component.html',
  styleUrl: './hanabi-side-sheet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiSideSheetComponent implements OnChanges {
  @Input() game: HanabiGame = HanabiGame.empty();
  @Input() infos: HanabiInfosFromPov = HanabiInfosFromPov.empty();
  @Input() assistant: HanabiAssistant = HanabiAssistant.empty();

  @Output() assistantUpdate: EventEmitter<HanabiAssistant> = new EventEmitter<HanabiAssistant>();

  protected card: HanabiCard = HanabiCard.empty();
  protected cardInfos: HanabiCardInfos = HanabiCardInfos.empty();
  protected hint: HanabiHint = HanabiHint.empty();

  protected mainMarkerRows: List<List<HanabiMarker>> = List.of();
  protected otherMarkerRows: List<List<HanabiMarker>> = List.of();
  protected isCritical = false;

  ngOnChanges(changes: Changes<HanabiSideSheetComponent>): void {
    if (changes.game || changes.infos || changes.assistant) {
      if (this.assistant.selectedCardId === undefined) return;

      this.card = this.game.allCards().find(c => c.id === this.assistant.selectedCardId) ?? HanabiCard.empty();
      this.cardInfos = this.infos.getCardInfoByCard(this.card);
      this.hint = this.assistant.hints.find(h => h.cardId === this.assistant.selectedCardId) ?? HanabiHint.empty();

      this.mainMarkerRows = this.buildMainMarkerRows(this.card, this.game.settings);
      this.otherMarkerRows = this.buildOtherMarkerRows(this.card, this.game.settings);
      this.isCritical = this.cardInfos.isCritical();
    }
  }

  protected onClose(): void {
    this.assistantUpdate.emit(HanabiAssistant.copy(this.assistant)
      .withSelectedCardId(undefined)
      .build());
  }

  protected onRemoveMarkers(): void {
    const updatedHint = HanabiHint.copy(this.hint)
      .withMarkers(List.of())
      .build();

    this.assistantUpdate.emit(HanabiAssistant.copy(this.assistant)
      .withHints(this.assistant.hints.map(h => h.cardId === updatedHint.cardId ? updatedHint : h))
      .build());
  }

  protected onMarkerChip(marker: HanabiMarker): void {
    const updatedHint = HanabiHint.copy(this.hint)
      .withMarkers(this.hint.markers.some(m => m.isIdentical(marker))
        ? this.hint.markers.filter(m => !m.isIdentical(marker))
        : this.hint.markers.push(marker.applyWarnings(this.card, this.infos.getCardInfoByMarker(marker), this.hint.isInPovHand)))
      .build();

    this.assistantUpdate.emit(HanabiAssistant.copy(this.assistant)
      .withHints(this.assistant.hints.map(h => h.cardId === updatedHint.cardId ? updatedHint : h))
      .build());
  }

  // TODO: perf issue calling this method in template
  protected isSelected(marker: HanabiMarker): boolean {
    return this.hint.markers.some(m => marker.isIdentical(m));
  }



  private buildMainMarkerRows(card: HanabiCard, settings: HanabiSettings): List<List<HanabiMarker>> {
    let rows: List<List<HanabiMarker>> = List.of();

    if (card.isClued()) {
      if (card.valueClue.size > 0 && card.colorClue.size > 0) rows = rows.push();
      else if (card.valueClue.size > 0) rows = rows.push(this.markersByValue(card.valueClue.last(), settings));
      else if (card.colorClue.size > 0) rows = rows.push(this.markersByColor(card.colorClue.last(), settings));
    } else {
      rows = rows.push(...this.allMarkers(settings));
    }

    rows = rows.push(this.specialMarkers());

    return rows;
  }

  private buildOtherMarkerRows(card: HanabiCard, settings: HanabiSettings): List<List<HanabiMarker>> {
    let rows: List<List<HanabiMarker>> = List.of();

    if (card.isClued()) {
      if (card.valueClue.size > 0 && card.colorClue.size > 0) rows = rows.push(...this.allMarkers(settings));
      else if (card.valueClue.size > 0) rows = rows.push(...this.allMarkersWithoutValue(card.valueClue.last(), settings));
      else if (card.colorClue.size > 0) rows = rows.push(...this.allMarkersWithoutColor(card.colorClue.last(), settings));
    }

    rows = rows.push(this.simpleColorMarkers(settings));
    rows = rows.push(this.simpleValueMarkers(settings));

    return rows;
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

  private allMarkers(settings: HanabiSettings): List<List<HanabiMarker>> {
    return settings.colors.map(c => this.markersByColor(c, settings));
  }

  private allMarkersWithoutValue(value: number, settings: HanabiSettings): List<List<HanabiMarker>> {
    return settings.values().filter(v => v !== value).map(v => this.markersByValue(v, settings));
  }

  private allMarkersWithoutColor(color: HanabiCard.Color, settings: HanabiSettings): List<List<HanabiMarker>> {
    return settings.colors.filter(c => c !== color).map(c => this.markersByColor(c, settings));
  }

  private specialMarkers(): List<HanabiMarker> {
    return List.of(
      HanabiMarker.builder().withValue('✨').withSpecial(true).withDescription('Playable').build(),
      HanabiMarker.builder().withValue('📌').withSpecial(true).withDescription('Save').build(),
      HanabiMarker.builder().withValue('🗑️').withSpecial(true).withDescription('Discard').build(),
      HanabiMarker.builder().withValue('🔧').withSpecial(true).withDescription('Fix').build(),
      HanabiMarker.builder().withValue('💥').withSpecial(true).withDescription('Bomb').build()
    )
  }
}
