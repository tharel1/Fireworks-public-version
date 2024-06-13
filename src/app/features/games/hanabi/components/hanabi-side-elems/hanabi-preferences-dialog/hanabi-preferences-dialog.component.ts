import {ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {HanabiPreferences} from "../../../models/hanabi-preferences.model";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatCheckbox} from "@angular/material/checkbox";
import {TooltipInfoComponent} from "../../../../../../shared/components/tooltip-info/tooltip-info.component";
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-hanabi-preferences-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatCheckbox,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    TooltipInfoComponent,
    MatIcon
  ],
  templateUrl: './hanabi-preferences-dialog.component.html',
  styleUrl: './hanabi-preferences-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HanabiPreferencesDialogComponent {

  protected formGroup = this.fb.group({
    showCritical: this.fb.control<boolean>(false),
    showMarkerWarnings: this.fb.control<boolean>(false),
    markerCleaning: this.fb.control<boolean>(false),
  });

  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) protected preferences: HanabiPreferences,
  ) {
    this.formGroup.patchValue({
      showCritical: this.preferences.showCritical,
      showMarkerWarnings: this.preferences.showMarkerWarnings,
      markerCleaning: this.preferences.markerCleaning,
    })
  }

  onSave(): HanabiPreferences | undefined {
    if (!this.formGroup.dirty) return undefined;

    const value = this.formGroup.value;

    return HanabiPreferences.builder()
      .withShowCritical(value.showCritical ?? false)
      .withShowMarkerWarnings(value.showMarkerWarnings ?? false)
      .withMarkerCleaning(value.markerCleaning ?? false)
      .build();
  }
}
