import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {List} from "immutable";
import {HanabiCard} from "../../../models/hanabi-card.model";
import {MatCard} from "@angular/material/card";
import {Changes} from "../../../../../../core/utils/changes.model";
import {CommonModule} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {ClueAnimator} from "../../../services/clue-animator.service";

@Component({
  selector: 'app-hanabi-clue',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatIcon
  ],
  templateUrl: './hanabi-clue.component.html',
  styleUrl: './hanabi-clue.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiClueComponent implements OnChanges {
  @Input() cardId: number = -1;
  @Input() valueClue: List<number> = List.of();
  @Input() colorClue: List<HanabiCard.Color> = List.of();

  protected value?: number;
  protected color?: HanabiCard.Color;
  protected active: boolean = false;

  constructor(
    private clueAnimator: ClueAnimator
  ) { }

  ngOnChanges(changes: Changes<HanabiClueComponent>): void {
    if (changes.valueClue || changes.colorClue) {
      this.value = this.valueClue.last(undefined);
      this.color = this.colorClue.last(undefined);
      this.active = Boolean(this.value) || Boolean(this.color);

      if (this.clueAnimator.moveScheduledClue(this.cardId)) {
        this.active = false;
      }
    }
  }
}
