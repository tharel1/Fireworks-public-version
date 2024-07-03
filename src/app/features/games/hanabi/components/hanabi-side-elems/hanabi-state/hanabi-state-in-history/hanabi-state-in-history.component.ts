import {ChangeDetectionStrategy, Component} from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-hanabi-state-in-history',
  standalone: true,
    imports: [
        MatCardModule,
        MatIconModule
    ],
  templateUrl: './hanabi-state-in-history.component.html',
  styleUrl: './hanabi-state-in-history.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiStateInHistoryComponent {

}
