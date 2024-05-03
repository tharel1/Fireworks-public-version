import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatTooltip, TooltipPosition} from "@angular/material/tooltip";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-tooltip-info',
  standalone: true,
  imports: [
    MatIcon,
    MatTooltip
  ],
  templateUrl: './tooltip-info.component.html',
  styleUrl: './tooltip-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TooltipInfoComponent {
  @Input() info: string = '';
  @Input() position: TooltipPosition = 'above';
}
