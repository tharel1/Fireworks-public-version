import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {HanabiCard} from "../../../models/hanabi-card.model";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-hanabi-tiny-card',
  standalone: true,
  imports: [
    MatTooltip
  ],
  templateUrl: './hanabi-tiny-card.component.html',
  styleUrl: './hanabi-tiny-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiTinyCardComponent {
  @Input() card: HanabiCard = HanabiCard.empty();
}
