import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HanabiCommand} from "../../models/hanabi-command/hanabi-command.model";
import {HanabiHandComponent} from "../hanabi-hand/hanabi-hand.component";
import {HanabiPlayer} from "../../models/hanabi-player.model";
import {MatCardModule} from "@angular/material/card";
import {PlayerWaitingComponent} from "../../../../../shared/components/player-waiting/player-waiting.component";
import {HanabiCard} from "../../models/hanabi-card.model";
import {HanabiCommandClueColor} from "../../models/hanabi-command/hanabi-command-clue-color.model";
import {HanabiCommandClueValue} from "../../models/hanabi-command/hanabi-command-clue-value.model";
import {HanabiCommandPlay} from "../../models/hanabi-command/hanabi-command-play.model";
import {HanabiCommandDiscard} from "../../models/hanabi-command/hanabi-command-discard.model";

@Component({
  selector: 'app-hanabi-player',
  standalone: true,
  imports: [CommonModule, HanabiHandComponent, MatCardModule, PlayerWaitingComponent],
  templateUrl: './hanabi-player.component.html',
  styleUrls: ['./hanabi-player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiPlayerComponent {
  @Input() player: HanabiPlayer = HanabiPlayer.empty();
  @Input() isSelf: boolean = false;
  @Input() canPlay: boolean = false;

  @Output() command: EventEmitter<HanabiCommand> = new EventEmitter<HanabiCommand>();

  protected onPlay(card: HanabiCard): void {
    this.command.emit(HanabiCommandPlay.builder()
      .withTarget(this.player)
      .withCard(card)
      .withIndex(this.player.cards.findIndex(c => c.equals(card)))
      .build()
    );
  }

  protected onDiscard(card: HanabiCard): void {
    this.command.emit(HanabiCommandDiscard.builder()
      .withTarget(this.player)
      .withCard(card)
      .withIndex(this.player.cards.findIndex(c => c.equals(card)))
      .build()
    );
  }

  protected onClueColor(card: HanabiCard): void {
    this.command.emit(HanabiCommandClueColor.builder()
      .withTarget(this.player)
      .withColor(card.color)
      .build()
    );
  }

  protected onClueValue(card: HanabiCard): void {
    this.command.emit(HanabiCommandClueValue.builder()
      .withTarget(this.player)
      .withValue(card.value)
      .build()
    );
  }
}
