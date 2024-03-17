import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Observable, timer} from "rxjs";

@Component({
  selector: 'app-player-waiting',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player-waiting.component.html',
  styleUrls: ['./player-waiting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerWaitingComponent {
  protected beat$: Observable<number> = timer(0, 1000);
}
