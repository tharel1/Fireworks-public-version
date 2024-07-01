import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatProgressBar} from "@angular/material/progress-bar";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatProgressBar
  ],
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarComponent {
  @Input() loading: boolean = false;
}
