import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {HanabiCommandPlay} from "../../../models/hanabi-command/hanabi-command-play.model";

@Component({
  selector: 'app-hanabi-command-play',
  standalone: true,
  imports: [],
  templateUrl: './hanabi-command-play.component.html',
  styleUrl: './hanabi-command-play.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiCommandPlayComponent {
  @Input() command: HanabiCommandPlay = HanabiCommandPlay.empty();
}
