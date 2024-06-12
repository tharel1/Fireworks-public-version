import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HanabiCardComponent} from "../hanabi-card/hanabi-card.component";
import {List} from "immutable";
import {HanabiCard} from "../../models/hanabi-card.model";
import {HanabiAssistant} from "../../models/hanabi-assistant.model";
import {Changes} from "../../../../../core/utils/changes.model";
import {HanabiHint} from "../../models/hanabi-hint.model";
import {HanabiPreferences} from "../../models/hanabi-preferences.model";
import {HanabiSettings} from "../../models/hanabi-settings.model";
import {HanabiInfos} from "../../models/hanabi-infos/hanabi-infos.model";
import {HanabiCardInfos} from "../../models/hanabi-infos/hanabi-card-infos.model";

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
  @Input() settings: HanabiSettings = HanabiSettings.empty();
  @Input() preferences: HanabiPreferences = HanabiPreferences.empty();
  @Input() infos: HanabiInfos = HanabiInfos.empty();
  @Input() assistant: HanabiAssistant = HanabiAssistant.empty();
  @Input() visible: boolean = false;

  @Output() play: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() discard: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() clueColor: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() clueValue: EventEmitter<HanabiCard> = new EventEmitter<HanabiCard>();
  @Output() assistantUpdate: EventEmitter<HanabiAssistant> = new EventEmitter<HanabiAssistant>();

  protected cardsWithInfos: List<CardWithInfos> = List.of();

  ngOnChanges(changes: Changes<HanabiHandComponent>) {
    if (changes.hand || changes.assistant) {
      this.cardsWithInfos = this.hand.map(c => ({
        card: c,
        infos: this.infos.getCardInfoByCard(c),
        hint: this.assistant.hints.find(h => h.cardId === c.id) ?? HanabiHint.empty(),
        selected: this.assistant.selectedCardId === c.id
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

  protected onHintUpdate(hint: HanabiHint): void {
    this.assistantUpdate.emit(HanabiAssistant.copy(this.assistant)
      .withHints(this.assistant.hints.map(h => h.cardId === hint.cardId ? hint : h))
      .build());
  }

  protected onSelectedCardUpdate(card: HanabiCard): void {
    this.assistantUpdate.emit(HanabiAssistant.copy(this.assistant)
      .withSelectedCardId(this.assistant.selectedCardId === card.id ? undefined : card.id)
      .build());
  }
}

interface CardWithInfos {
  readonly card: HanabiCard,
  readonly infos: HanabiCardInfos,
  readonly hint: HanabiHint,
  readonly selected: boolean
}
