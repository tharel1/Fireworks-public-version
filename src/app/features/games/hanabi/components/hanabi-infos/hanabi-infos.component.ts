import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {HanabiGame} from "../../models/hanabi-game.model";

@Component({
  selector: 'app-hanabi-infos',
  standalone: true,
  imports: [CommonModule, MatIcon, MatTooltip],
  templateUrl: './hanabi-infos.component.html',
  styleUrls: ['./hanabi-infos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiInfosComponent {
  @Input() game: HanabiGame = HanabiGame.empty();

  protected readonly Array = Array;
}
