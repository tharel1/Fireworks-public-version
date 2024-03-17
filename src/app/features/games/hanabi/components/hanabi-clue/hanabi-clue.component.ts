import {ChangeDetectionStrategy, Component, Input, OnChanges} from '@angular/core';
import {List} from "immutable";
import {HanabiCard} from "../../models/hanabi-card.model";
import {MatCard, MatCardContent} from "@angular/material/card";
import {Changes} from "../../../../../core/utils/changes.model";
import {NgClass, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-hanabi-clue',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    NgIf,
    NgClass,
    MatIcon
  ],
  templateUrl: './hanabi-clue.component.html',
  styleUrl: './hanabi-clue.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiClueComponent implements OnChanges {
  @Input() valueClue: List<number> = List.of();
  @Input() colorClue: List<HanabiCard.Color> = List.of();

  protected value?: number;
  protected color?: HanabiCard.Color;

  ngOnChanges(changes: Changes<HanabiClueComponent>): void {
    if (changes.valueClue) this.value = this.valueClue.last(undefined);
    if (changes.colorClue) this.color = this.colorClue.last(undefined);
  }
}
