import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {HanabiActionsComponent} from "./hanabi-actions/hanabi-actions.component";
import {HanabiHistory} from "../../models/hanabi-history.model";
import {CommonModule} from "@angular/common";
import {HanabiCommandsComponent} from "./hanabi-commands/hanabi-commands.component";
import {HanabiGame} from "../../models/hanabi-game.model";
import {HanabiIndicatorsComponent} from "./hanabi-indicators/hanabi-indicators.component";
import {HanabiHistoryComponent} from "./hanabi-history/hanabi-history.component";
import {HanabiPreferences} from "../../models/hanabi-preferences.model";
import {HanabiAssistant} from "../../models/hanabi-assistant/hanabi-assistant.model";
import {HanabiStateComponent} from "./hanabi-state/hanabi-state.component";
import {HanabiInfosFromPov} from "../../models/hanabi-infos/hanabi-infos-from-pov.model";

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
    HanabiStateComponent,
  ],
  templateUrl: './hanabi-side-elems.component.html',
  styleUrl: './hanabi-side-elems.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiSideElemsComponent {
  @Input() game: HanabiGame = HanabiGame.empty();
  @Input() history: HanabiHistory = HanabiHistory.empty();
  @Input() preferences: HanabiPreferences = HanabiPreferences.empty();
  @Input() infos: HanabiInfosFromPov = HanabiInfosFromPov.empty();
  @Input() assistant: HanabiAssistant = HanabiAssistant.empty();

  @Output() historyUpdate: EventEmitter<HanabiHistory> = new EventEmitter<HanabiHistory>();
  @Output() preferencesUpdate: EventEmitter<HanabiPreferences> = new EventEmitter<HanabiPreferences>();
  @Output() assistantUpdate: EventEmitter<HanabiAssistant> = new EventEmitter<HanabiAssistant>();

  onHistory(history: HanabiHistory): void {
    this.historyUpdate.emit(history);
  }

  onPreferences(preferences: HanabiPreferences): void {
    this.preferencesUpdate.emit(preferences);
  }

  onAssistant(assistant: HanabiAssistant): void {
    this.assistantUpdate.emit(assistant);
  }
}
