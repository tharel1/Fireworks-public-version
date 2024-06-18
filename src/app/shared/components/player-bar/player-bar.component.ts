import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {HanabiHandComponent} from "../../../features/games/hanabi/components/hanabi-hand/hanabi-hand.component";
import {MatCard} from "@angular/material/card";
import {AsyncPipe, NgForOf, NgIf} from "@angular/common";
import {Observable, timer} from "rxjs";

@Component({
  selector: 'app-player-bar',
  standalone: true,
  imports: [
    HanabiHandComponent,
    MatCard,
    NgIf,
    AsyncPipe,
    NgForOf
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
