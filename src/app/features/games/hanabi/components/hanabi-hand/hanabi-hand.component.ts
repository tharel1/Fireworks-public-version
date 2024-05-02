import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HanabiCardComponent} from "../hanabi-card/hanabi-card.component";
import {List} from "immutable";
import {HanabiCard} from "../../models/hanabi-card.model";

@Component({
  selector: 'app-hanabi-hand',
  standalone: true,
  imports: [CommonModule, HanabiCardComponent],
  templateUrl: './hanabi-hand.component.html',
  styleUrls: ['./hanabi-hand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiHandComponent {
  @Input() hand: List<HanabiCard> = List.of();
  @Input() visible: boolean = false;

  @Output() play: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() discard: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() clueColor: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() clueValue: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();

  protected onPlay(card: HanabiCard): void {
    this.play.emit(card);
  }

  protected onDiscard(card: HanabiCard): void {
    this.discard.emit(card);
  }

  protected onClueColor(card: HanabiCard): void {
    this.clueColor.emit(card);
  }

  protected onClueValue(card: HanabiCard): void {
    this.clueValue.emit(card);
  }
}
