import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hanabi-state',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hanabi-state.component.html',
  styleUrls: ['./hanabi-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiStateComponent {

}
