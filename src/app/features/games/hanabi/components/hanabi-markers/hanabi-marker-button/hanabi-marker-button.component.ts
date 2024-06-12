import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatCard} from "@angular/material/card";
import {MatRipple} from "@angular/material/core";

@Component({
  selector: 'app-hanabi-marker-button',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatRipple
  ],
  templateUrl: './hanabi-marker-button.component.html',
  styleUrl: './hanabi-marker-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiMarkerButtonComponent {
  @Input() visible: boolean = false;
}
