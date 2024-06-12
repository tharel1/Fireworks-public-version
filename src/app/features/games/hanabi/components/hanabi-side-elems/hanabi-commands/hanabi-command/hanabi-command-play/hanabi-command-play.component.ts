import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {HanabiCommandPlay} from "../../../../../models/hanabi-command/hanabi-command-play.model";
import {CommonModule} from "@angular/common";
import {HanabiTinyCardComponent} from "../../../../hanabi-card/hanabi-tiny-card/hanabi-tiny-card.component";

@Component({
  selector: 'app-hanabi-command-play',
  standalone: true,
  imports: [
    CommonModule,
    HanabiTinyCardComponent
  ],
  templateUrl: './hanabi-command-play.component.html',
  styleUrl: './hanabi-command-play.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiCommandPlayComponent {
  @Input() command: HanabiCommandPlay = HanabiCommandPlay.empty();
}
