import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {HanabiHistoryComponent} from "../hanabi-history/hanabi-history.component";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {HanabiHistory} from "../../../models/hanabi-history.model";

@Component({
  selector: 'app-hanabi-actions',
  standalone: true,
    imports: [
        HanabiHistoryComponent,
        MatCard,
        MatCardContent,
        MatDivider,
        MatIcon
    ],
  templateUrl: './hanabi-actions.component.html',
  styleUrl: './hanabi-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiActionsComponent {
  @Input() history: HanabiHistory = HanabiHistory.empty();

  @Output() historyUpdate: EventEmitter<HanabiHistory> = new EventEmitter<HanabiHistory>();

  onHistory(history: HanabiHistory): void {
    this.historyUpdate.emit(history);
  }
}
