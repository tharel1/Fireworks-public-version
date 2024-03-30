import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {HanabiCard} from "../../models/hanabi-card.model";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule, MatMenuTrigger} from "@angular/material/menu";
import {MatChipsModule} from "@angular/material/chips";
import {HanabiNumberPipe} from "../../pipes/hanabi-number.pipe";
import {HanabiClueComponent} from "../hanabi-clue/hanabi-clue.component";

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
export class HanabiCardComponent {
  @Input() card: HanabiCard = HanabiCard.empty();
  @Input() visible: boolean = true;
  @Input() canPlay: boolean = false;
  @Input() inHand: boolean = false;
  @Input() noShadow: boolean = false;

  @Output() play: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() clueColor: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() clueValue: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();

  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;

  protected onPlay(): void {
    this.trigger.closeMenu();
    this.play.emit(this.card);
  }

  protected onClueColor(): void {
    this.trigger.closeMenu();
    this.clueColor.emit(this.card);
  }

  protected onClueValue(): void {
    this.trigger.closeMenu();
    this.clueValue.emit(this.card);
  }
}
