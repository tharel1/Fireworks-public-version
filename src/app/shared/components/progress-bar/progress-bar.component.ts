import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatProgressBar} from "@angular/material/progress-bar";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [
    MatProgressBar,
    NgIf
  ],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
  @Input() loading: boolean = false;
}
