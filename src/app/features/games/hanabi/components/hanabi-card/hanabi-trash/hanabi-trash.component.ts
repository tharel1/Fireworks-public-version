import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {MatTooltip} from "@angular/material/tooltip";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-hanabi-trash',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatTooltip
  ],
  templateUrl: './hanabi-trash.component.html',
  styleUrl: './hanabi-trash.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiTrashComponent {
}
