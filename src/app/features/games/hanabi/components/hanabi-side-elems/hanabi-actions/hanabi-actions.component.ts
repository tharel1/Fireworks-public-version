import {ChangeDetectionStrategy, Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatDivider} from "@angular/material/divider";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {HanabiPreferencesDialogComponent} from "../hanabi-preferences-dialog/hanabi-preferences-dialog.component";
import {HanabiPreferences} from "../../../models/hanabi-preferences.model";
import {CommonModule} from "@angular/common";
import {HanabiAssistant} from "../../../models/hanabi-assistant.model";

@Component({
  selector: 'app-hanabi-actions',
  standalone: true,
  imports: [
    CommonModule,
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
  @Input() assistant: HanabiAssistant = HanabiAssistant.empty();

  @Output() preferencesUpdate: EventEmitter<HanabiPreferences> = new EventEmitter<HanabiPreferences>();
  @Output() assistantUpdate: EventEmitter<HanabiAssistant> = new EventEmitter<HanabiAssistant>();

  constructor(
    public dialog: MatDialog
  ) {}

  onPreferences(): void {
    this.dialog.open(HanabiPreferencesDialogComponent, {data: this.preferences})
      .afterClosed().subscribe((preferences: HanabiPreferences) => {
        if (preferences) this.preferencesUpdate.emit(preferences);
      });
  }

  @HostListener('window:keydown.alt.v')
  showImpossibleClues(): void {
    if (this.assistant.showImpossibleClues) return;

    this.assistantUpdate.emit(HanabiAssistant.copy(this.assistant)
      .withShowImpossibleClues(true)
      .build());
  }

  @HostListener('window:keyup', ['$event'])
  hideImpossibleClues(event?: KeyboardEvent): void {
    if (!this.assistant.showImpossibleClues) return;

    if (event && !event.altKey && event.key !== 'v') return;

    this.assistantUpdate.emit(HanabiAssistant.copy(this.assistant)
      .withShowImpossibleClues(false)
      .build());
  }
}
