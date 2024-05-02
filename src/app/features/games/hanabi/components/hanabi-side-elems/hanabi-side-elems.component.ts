import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatDivider} from "@angular/material/divider";
import {HanabiActionsComponent} from "../hanabi-actions/hanabi-actions.component";
import {HanabiHistory} from "../../models/hanabi-history.model";
import {CommonModule} from "@angular/common";
import {HanabiCommandsComponent} from "../hanabi-commands/hanabi-commands.component";

@Component({
  selector: 'app-hanabi-side-elems',
  standalone: true,
  imports: [
    CommonModule,
    HanabiActionsComponent,
    MatDivider,
    HanabiCommandsComponent,
  ],
  templateUrl: './hanabi-side-elems.component.html',
  styleUrl: './hanabi-side-elems.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiSideElemsComponent {
  @Input() history: HanabiHistory = HanabiHistory.empty();

  @Output() historyUpdate: EventEmitter<HanabiHistory> = new EventEmitter<HanabiHistory>();

  onHistory(history: HanabiHistory): void {
    this.historyUpdate.emit(history);
  }
}
