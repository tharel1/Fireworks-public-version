import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {HanabiCard} from "../../models/hanabi-card.model";
import {HanabiCardComponent} from "../hanabi-card/hanabi-card.component";
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-hanabi-board-card',
  standalone: true,
  imports: [CommonModule, HanabiCardComponent, MatCardModule, MatIconModule],
  templateUrl: './hanabi-board-card.component.html',
  styleUrls: ['./hanabi-board-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiBoardCardComponent {
  @Input() color!: HanabiCard.Color;
  @Input() card?: HanabiCard;
}
