import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {HanabiActionsComponent} from "./hanabi-actions/hanabi-actions.component";
import {HanabiHistory} from "../../models/hanabi-history.model";
import {CommonModule} from "@angular/common";
import {HanabiCommandsComponent} from "./hanabi-commands/hanabi-commands.component";
import {HanabiGame} from "../../models/hanabi-game.model";
import {Changes} from "../../../../../core/utils/changes.model";
import {HanabiIndicatorsComponent} from "./hanabi-indicators/hanabi-indicators.component";
import {HanabiHistoryComponent} from "./hanabi-history/hanabi-history.component";
import {HanabiPreferences} from "../../models/hanabi-preferences.model";

@Component({
  selector: 'app-hanabi-side-elems',
  standalone: true,
  imports: [
    CommonModule,
    HanabiActionsComponent,
    MatDivider,
    HanabiCommandsComponent,
    HanabiIndicatorsComponent,
    HanabiHistoryComponent,
  ],
  templateUrl: './hanabi-side-elems.component.html',
  styleUrl: './hanabi-side-elems.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiSideElemsComponent implements OnChanges {
  @Input() game: HanabiGame = HanabiGame.empty();
  @Input() history: HanabiHistory = HanabiHistory.empty();
  @Input() preferences: HanabiPreferences = HanabiPreferences.empty();

  @Output() historyUpdate: EventEmitter<HanabiHistory> = new EventEmitter<HanabiHistory>();
  @Output() preferencesUpdate: EventEmitter<HanabiPreferences> = new EventEmitter<HanabiPreferences>();

  protected state: HanabiGame = HanabiGame.empty();

  ngOnChanges(changes: Changes<HanabiSideElemsComponent>): void {
    if (changes.game || changes.history) {
      this.state = this.history.state ?? this.game;
    }
  }

  onHistory(history: HanabiHistory): void {
    this.historyUpdate.emit(history);
  }

  onPreferences(preferences: HanabiPreferences): void {
    this.preferencesUpdate.emit(preferences);
  }
}
