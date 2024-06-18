import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {HanabiCommandClueValue} from "../../../../../models/hanabi-command/hanabi-command-clue-value.model";
import {TitleCasePipe} from "@angular/common";
import {HanabiNumberPipe} from "../../../../../pipes/hanabi-number.pipe";

@Component({
  selector: 'app-hanabi-command-clue-value',
  standalone: true,
  imports: [
    HanabiNumberPipe,
    TitleCasePipe
  ],
  templateUrl: './hanabi-command-clue-value.component.html',
  styleUrl: './hanabi-command-clue-value.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiCommandClueValueComponent {
  @Input() command: HanabiCommandClueValue = HanabiCommandClueValue.empty();
}
