import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hanabi-infos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hanabi-infos.component.html',
  styleUrls: ['./hanabi-infos.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiInfosComponent {

}
