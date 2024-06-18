import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {HanabiCommandClueColor} from "../../../../../models/hanabi-command/hanabi-command-clue-color.model";
import {TitleCasePipe} from "@angular/common";

@Component({
  selector: 'app-hanabi-command-clue-color',
  standalone: true,
  imports: [
    TitleCasePipe
  ],
  templateUrl: './hanabi-command-clue-color.component.html',
  styleUrl: './hanabi-command-clue-color.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiCommandClueColorComponent {
  @Input() command: HanabiCommandClueColor = HanabiCommandClueColor.empty();
}
