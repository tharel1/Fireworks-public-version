import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HanabiGame} from "../../models/hanabi-game.model";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatBadgeModule} from "@angular/material/badge";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-hanabi-history',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatBadgeModule, MatTooltipModule],
  templateUrl: './hanabi-history.component.html',
  styleUrls: ['./hanabi-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiHistoryComponent {

  @Input() game: HanabiGame = HanabiGame.empty();

  @Output() onHistory: EventEmitter<HanabiGame> = new EventEmitter<HanabiGame>();

  protected historyIndex?: number;
  protected history?: HanabiGame;

  back(): void {
    if (this.historyIndex===undefined || !this.history) {
      this.historyIndex = 0;
      this.history = this.game;
    } else {
      this.historyIndex++;
    }

    const command = this.game.history.get(this.historyIndex);
    if (command) {
      this.history = command.revert(this.history);
      this.onHistory.emit(this.history);
    }
  }

  forward(): void {
    if (this.historyIndex===undefined || !this.history) return;

    if (this.historyIndex === 0) {
      this.cancel()
      return;
    }

    const command = this.game.history.get(this.historyIndex);
    if (command) {
      this.history = command.update(this.history);
      this.onHistory.emit(this.history);
    }
    this.historyIndex--;
  }

  cancel(): void {
    this.historyIndex = undefined;
    this.history = undefined;
    this.onHistory.emit(this.history);
  }
}
