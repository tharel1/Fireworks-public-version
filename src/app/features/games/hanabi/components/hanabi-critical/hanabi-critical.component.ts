import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {CommonModule} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'app-hanabi-critical',
  standalone: true,
  imports: [
    CommonModule,
    MatTooltip
  ],
  templateUrl: './hanabi-critical.component.html',
  styleUrl: './hanabi-critical.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiCriticalComponent {
  @Input() isCritical: boolean = false;
}
