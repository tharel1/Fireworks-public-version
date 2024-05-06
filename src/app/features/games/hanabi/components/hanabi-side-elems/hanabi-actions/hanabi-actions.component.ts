import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {HanabiPreferencesDialogComponent} from "../hanabi-preferences-dialog/hanabi-preferences-dialog.component";
import {HanabiPreferences} from "../../../models/hanabi-preferences.model";

@Component({
  selector: 'app-hanabi-actions',
  standalone: true,
  imports: [
    MatCard,
    MatCardContent,
    MatIconButton,
    MatIcon,
    MatDivider
  ],
  templateUrl: './hanabi-actions.component.html',
  styleUrl: './hanabi-actions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiActionsComponent {

  @Input() preferences: HanabiPreferences = HanabiPreferences.empty();

  @Output() preferencesUpdate: EventEmitter<HanabiPreferences> = new EventEmitter<HanabiPreferences>();

  constructor(
    public dialog: MatDialog
  ) {}

  onPreferences(): void {
    this.dialog.open(HanabiPreferencesDialogComponent, {data: this.preferences})
      .afterClosed().subscribe((preferences: HanabiPreferences) => {
        if (preferences) this.preferencesUpdate.emit(preferences);
      });
  }
}
