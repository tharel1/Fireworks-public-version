import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {HanabiCommandClueColor} from "../../../models/hanabi-command/hanabi-command-clue-color.model";
import {UpperCasePipe} from "@angular/common";

@Component({
  selector: 'app-hanabi-command-clue-color',
  standalone: true,
  imports: [
    UpperCasePipe
  ],
  templateUrl: './hanabi-command-clue-color.component.html',
  styleUrl: './hanabi-command-clue-color.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiCommandClueColorComponent {
  @Input() command: HanabiCommandClueColor = HanabiCommandClueColor.empty();
}
