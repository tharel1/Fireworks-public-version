import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {HanabiGame} from "../../models/hanabi-game.model";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-hanabi-state',
  standalone: true,
  imports: [CommonModule, MatIcon, MatTooltip],
  templateUrl: './hanabi-state.component.html',
  styleUrls: ['./hanabi-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiStateComponent {
  @Input() game: HanabiGame = HanabiGame.empty();

  protected readonly Array = Array;
}
