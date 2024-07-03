import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {HanabiGame} from "../../../../models/hanabi-game.model";
import {CommonModule} from "@angular/common";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {Observable, timer} from "rxjs";
import {Changes} from "../../../../../../../core/utils/changes.model";

@Component({
  selector: 'app-hanabi-state-self-turn',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './hanabi-state-self-turn.component.html',
  styleUrl: './hanabi-state-self-turn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiStateSelfTurnComponent implements OnChanges {
  @Input() game: HanabiGame = HanabiGame.empty();

  protected infoMessage?: string;

  protected readonly beat$: Observable<number> = timer(0, 1500);

  ngOnChanges(changes: Changes<HanabiStateSelfTurnComponent>): void {
    if (changes.game) {
      this.infoMessage = this.game.infoMessage();
    }
  }
}
