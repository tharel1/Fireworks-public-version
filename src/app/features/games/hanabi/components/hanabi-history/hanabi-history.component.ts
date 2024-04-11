import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HanabiGame} from "../../models/hanabi-game.model";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatBadgeModule} from "@angular/material/badge";
import {MatTooltipModule} from "@angular/material/tooltip";
import {HanabiHistory} from "../../models/hanabi-history.model";

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
  @Input() history: HanabiHistory = HanabiHistory.empty();

  @Output() onHistory: EventEmitter<HanabiHistory> = new EventEmitter<HanabiHistory>();

  back(): void {
    this.onHistory.emit(this.history.backward(this.game));
  }

  forward(): void {
    this.onHistory.emit(this.history.forward(this.game));
  }

  cancel(): void {
    this.onHistory.emit(this.history.cancel());
  }
}
