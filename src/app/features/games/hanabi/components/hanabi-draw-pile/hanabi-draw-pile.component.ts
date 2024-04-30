import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {List} from "immutable";
import {HanabiCard} from "../../models/hanabi-card.model";
import {HanabiCardComponent} from "../hanabi-card/hanabi-card.component";
import {MatCard} from "@angular/material/card";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-hanabi-draw-pile',
  standalone: true,
  imports: [CommonModule, MatTooltip, HanabiCardComponent, MatCard],
  templateUrl: './hanabi-draw-pile.component.html',
  styleUrls: ['./hanabi-draw-pile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiDrawPileComponent {
  @Input() drawPile: List<HanabiCard> = List.of();
}
