import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MatCard} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {Observable, timer} from "rxjs";

@Component({
  selector: 'app-player-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatCard
  ],
  templateUrl: './player-bar.component.html',
  styleUrl: './player-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayerBarComponent {
  @Input() name: string = '';
  @Input() playing: boolean = false;

  protected readonly beat$: Observable<number> = timer(0, 1000);
}
