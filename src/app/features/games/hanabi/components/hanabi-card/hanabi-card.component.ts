import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {HanabiCard} from "../../models/hanabi-card.model";
import {MatIcon} from "@angular/material/icon";
import {MatMenu, MatMenuContent, MatMenuItem, MatMenuTrigger} from "@angular/material/menu";
import {HanabiNumberPipe} from "../../pipes/hanabi-number.pipe";
import {HanabiClueComponent} from "../hanabi-clue/hanabi-clue.component";
import {CardAnimator} from "../../services/card-animator.service";
import {List} from "immutable";
import {HanabiHint} from "../../models/hanabi-hint.model";
import {HanabiMarkersComponent} from "../hanabi-markers/hanabi-markers.component";
import {HanabiSettings} from "../../models/hanabi-settings.model";
import {HanabiMarker} from "../../models/hanabi-marker.model";
import {HanabiCardInfos} from "../../models/hanabi-infos/hanabi-card-infos.model";
import {Changes} from "../../../../../core/utils/changes.model";
import {HanabiCriticalComponent} from "../hanabi-critical/hanabi-critical.component";
import {HanabiImpossibleCluesComponent} from "../hanabi-impossible-clues/hanabi-impossible-clues.component";

@Component({
  selector: 'app-hanabi-card',
  templateUrl: './hanabi-card.component.html',
  styleUrls: ['./hanabi-card.component.scss'],
  imports: [
    CommonModule,
    HanabiClueComponent,
    MatCard,
    MatMenuTrigger,
    MatCardContent,
    MatIcon,
    MatMenu,
    MatMenuItem,
    HanabiNumberPipe,
    HanabiMarkersComponent,
    MatMenuContent,
    HanabiCriticalComponent,
    HanabiImpossibleCluesComponent,
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiCardComponent implements OnInit, OnChanges {
  @Input() card: HanabiCard = HanabiCard.empty();
  @Input() settings: HanabiSettings = HanabiSettings.empty();
  @Input() infos: HanabiCardInfos = HanabiCardInfos.empty();
  @Input() hint: HanabiHint = HanabiHint.empty();
  @Input() visible: boolean = true;
  @Input() clickable: boolean = false;
  @Input() small: boolean = false;
  @Input() faded: boolean = false;
  @Input() noShadow: boolean = false;
  @Input() noClues: boolean = false;
  @Input() showCritical: boolean = false;
  @Input() showMarkers: boolean = false;
  @Input() showImpossibleClues: boolean = false;

  @Output() play: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() discard: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() clueColor: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() clueValue: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() hintUpdate: EventEmitter<HanabiHint> = new EventEmitter<HanabiHint>();

  protected isCritical = false;
  protected markerButtonVisible = false;

  protected classes: string[] = [];

  constructor(
    private cardAnimator: CardAnimator
  ) { }

  ngOnInit(): void {
    if (this.cardAnimator.moveScheduledCard(this.card)) {
      this.computeClasses(true);
    }
  }

  ngOnChanges(changes: Changes<HanabiCardComponent>): void {
    this.computeClasses();

    if (changes.infos) {
      this.isCritical = this.infos.isCritical();
    }
  }

  protected onPlay(): void {
    this.play.emit(this.card);
  }

  protected onDiscard(): void {
    this.discard.emit(this.card);
  }

  protected onClueColor(): void {
    this.clueColor.emit(this.card);
  }

  protected onClueValue(): void {
    this.clueValue.emit(this.card);
  }

  protected onMarkersUpdate(markers: List<HanabiMarker>): void {
    return this.hintUpdate.emit(HanabiHint.copy(this.hint)
      .withMarkers(markers)
      .build())
  }

  private computeClasses(animating: boolean = false): void {
    let classes = List.of('');

    if (this.clickable) {
      classes = classes.push('clickable');
    }
    if (this.small) {
      classes = classes.push('small');
    }
    if (this.faded) {
      classes = classes.push('faded');
    }
    if (this.noShadow) {
      classes = classes.push('no-shadow');
    }

    if (animating) {
      classes = classes.push('hide');
      classes = classes.filter(str => str !== 'faded');
    }

    this.classes = classes.toArray();
  }
}
