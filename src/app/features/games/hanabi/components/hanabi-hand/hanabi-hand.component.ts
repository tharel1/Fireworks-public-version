import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HanabiCardComponent} from "../hanabi-card/hanabi-card.component";
import {List} from "immutable";
import {HanabiCard} from "../../models/hanabi-card.model";
import {HanabiAssistant} from "../../models/hanabi-assistant.model";
import {Changes} from "../../../../../core/utils/changes.model";
import {HanabiHint} from "../../models/hanabi-hint.model";
import {HanabiPreferences} from "../../models/hanabi-preferences.model";

@Component({
  selector: 'app-hanabi-hand',
  standalone: true,
  imports: [CommonModule, HanabiCardComponent],
  templateUrl: './hanabi-hand.component.html',
  styleUrls: ['./hanabi-hand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiHandComponent implements OnChanges {
  @Input() hand: List<HanabiCard> = List.of();
  @Input() preferences: HanabiPreferences = HanabiPreferences.empty();
  @Input() assistant: HanabiAssistant = HanabiAssistant.empty();
  @Input() visible: boolean = false;

  @Output() play: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() discard: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() clueColor: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() clueValue: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();

  protected cardsWithHint: List<CardWithHint> = List.of();

  ngOnChanges(changes: Changes<HanabiHandComponent>) {
    if (changes.hand || changes.assistant) {
      this.cardsWithHint = this.hand.map(c => ({
        card: c,
        hint: this.assistant.hints.find(h => h.cardId === c.id) ?? HanabiHint.empty()
      }));
    }
  }

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

interface CardWithHint {
  readonly card: HanabiCard,
  readonly hint: HanabiHint
}
