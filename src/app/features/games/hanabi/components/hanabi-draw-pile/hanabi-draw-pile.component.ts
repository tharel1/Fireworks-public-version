import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {List} from "immutable";
import {HanabiCard} from "../../models/hanabi-card.model";
import {HanabiCardComponent} from "../hanabi-card/hanabi-card.component";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";

@Component({
  selector: 'app-hanabi-draw-pile',
  standalone: true,
  imports: [CommonModule, HanabiCardComponent, MatCardModule, MatIconModule, MatTooltipModule],
  templateUrl: './hanabi-draw-pile.component.html',
  styleUrls: ['./hanabi-draw-pile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiDrawPileComponent {
  @Input() drawPile: List<HanabiCard> = List.of();
}
