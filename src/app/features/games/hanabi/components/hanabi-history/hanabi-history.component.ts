import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatCardModule} from "@angular/material/card";
import {MatBadgeModule} from "@angular/material/badge";
import {MatTooltipModule} from "@angular/material/tooltip";
import {HanabiHistory} from "../../models/hanabi-history.model";
import {Changes} from "../../../../../core/utils/changes.model";

@Component({
  selector: 'app-hanabi-history',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule, MatBadgeModule, MatTooltipModule],
  templateUrl: './hanabi-history.component.html',
  styleUrls: ['./hanabi-history.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiHistoryComponent implements OnChanges {
  @Input() history: HanabiHistory = HanabiHistory.empty();

  @Output() onHistory: EventEmitter<HanabiHistory> = new EventEmitter<HanabiHistory>();

  protected isInHistory: boolean = false;
  protected canGoBack: boolean = false;

  ngOnChanges(changes: Changes<HanabiHistoryComponent>): void {
    if (changes.history) {
      this.isInHistory = this.history.isInHistory();
      this.canGoBack = this.history.canGoBack();
    }
  }

  goBack(): void {
    this.onHistory.emit(this.history.goBackward());
  }

  goForward(): void {
    this.onHistory.emit(this.history.goForward());
  }

  cancel(): void {
    this.onHistory.emit(this.history.cancel());
  }
}
