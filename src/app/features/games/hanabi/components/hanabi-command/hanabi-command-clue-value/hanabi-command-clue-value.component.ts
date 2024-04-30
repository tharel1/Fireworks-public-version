import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {HanabiCommandClueValue} from "../../../models/hanabi-command/hanabi-command-clue-value.model";
import {UpperCasePipe} from "@angular/common";
import {HanabiNumberPipe} from "../../../pipes/hanabi-number.pipe";

@Component({
  selector: 'app-hanabi-command-clue-value',
  standalone: true,
  imports: [
    UpperCasePipe,
    HanabiNumberPipe
  ],
  templateUrl: './hanabi-command-clue-value.component.html',
  styleUrl: './hanabi-command-clue-value.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiCommandClueValueComponent {
  @Input() command: HanabiCommandClueValue = HanabiCommandClueValue.empty();
}
