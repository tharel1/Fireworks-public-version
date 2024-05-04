import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {HanabiCommandDiscard} from "../../../../../models/hanabi-command/hanabi-command-discard.model";
import {HanabiNumberPipe} from "../../../../../pipes/hanabi-number.pipe";
import {UpperCasePipe} from "@angular/common";
import {HanabiTinyCardComponent} from "../../../../hanabi-tiny-card/hanabi-tiny-card.component";

@Component({
  selector: 'app-hanabi-command-discard',
  standalone: true,
  imports: [
    HanabiNumberPipe,
    UpperCasePipe,
    HanabiTinyCardComponent
  ],
  templateUrl: './hanabi-command-discard.component.html',
  styleUrl: './hanabi-command-discard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiCommandDiscardComponent {
  @Input() command: HanabiCommandDiscard = HanabiCommandDiscard.empty();
}
