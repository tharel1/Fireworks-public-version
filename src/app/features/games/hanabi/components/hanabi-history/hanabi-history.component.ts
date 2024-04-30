import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatMiniFabButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatBadge} from "@angular/material/badge";
import {MatTooltip} from "@angular/material/tooltip";
import {HanabiHistory} from "../../models/hanabi-history.model";
import {Changes} from "../../../../../core/utils/changes.model";

@Component({
  selector: 'app-hanabi-history',
  standalone: true,
  imports: [CommonModule, MatIcon, MatBadge, MatTooltip, MatMiniFabButton],
  templateUrl: './hanabi-history.component.html',
  styleUrls: ['./hanabi-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiHistoryComponent implements OnChanges {
  @Input() history: HanabiHistory = HanabiHistory.empty();

  @Output() historyUpdate: EventEmitter<HanabiHistory> = new EventEmitter<HanabiHistory>();

  protected isInHistory: boolean = false;
  protected canGoBack: boolean = false;

  ngOnChanges(changes: Changes<HanabiHistoryComponent>): void {
    if (changes.history) {
      this.isInHistory = this.history.isInHistory();
      this.canGoBack = this.history.canGoBack();
    }
  }

  goBack(): void {
    this.historyUpdate.emit(this.history.goBackward());
  }

  goForward(): void {
    this.historyUpdate.emit(this.history.goForward());
  }

  cancel(): void {
    this.historyUpdate.emit(this.history.cancel());
  }
}
