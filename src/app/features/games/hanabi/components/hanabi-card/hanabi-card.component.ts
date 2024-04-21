import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {HanabiCard} from "../../models/hanabi-card.model";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {MatChipsModule} from "@angular/material/chips";
import {HanabiNumberPipe} from "../../pipes/hanabi-number.pipe";
import {HanabiClueComponent} from "../hanabi-clue/hanabi-clue.component";
import {CardAnimator} from "../../services/card-animator.service";
import {List} from "immutable";

@Component({
  selector: 'app-hanabi-card',
  templateUrl: './hanabi-card.component.html',
  styleUrls: ['./hanabi-card.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    HanabiNumberPipe,
    HanabiClueComponent
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiCardComponent implements OnInit, OnChanges {
  @Input() card: HanabiCard = HanabiCard.empty();
  @Input() visible: boolean = true;
  @Input() clickable: boolean = false;
  @Input() small: boolean = false;
  @Input() faded: boolean = false;
  @Input() noShadow: boolean = false;
  @Input() noClues: boolean = false;

  protected classes: string[] = [];

  @Output() play: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() discard: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() clueColor: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() clueValue: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  constructor(
    private cardAnimator: CardAnimator
  ) { }

  ngOnInit(): void {
    if (this.cardAnimator.moveScheduledCard(this.card)) {
      this.computeClasses(true)
    }
  }

  ngOnChanges(): void {
    this.computeClasses();
  }

  protected onPlay(): void {
    this.trigger.closeMenu();
    this.play.emit(this.card);
  }

  protected onDiscard(): void {
    this.trigger.closeMenu();
    this.discard.emit(this.card);
  }

  protected onClueColor(): void {
    this.trigger.closeMenu();
    this.clueColor.emit(this.card);
  }

  protected onClueValue(): void {
    this.trigger.closeMenu();
    this.clueValue.emit(this.card);
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
