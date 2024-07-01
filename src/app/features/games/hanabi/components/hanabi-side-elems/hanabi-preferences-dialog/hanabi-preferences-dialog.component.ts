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
import {HanabiConstants} from "../../../utils/hanabi-constants";

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
    showTrash: this.fb.control<boolean>(false),
    showMarkerWarnings: this.fb.control<boolean>(false),
    markerCleaning: this.fb.control<boolean>(false),
  });

  protected readonly HanabiConstants = HanabiConstants;

  constructor(
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private readonly preferences: HanabiPreferences,
  ) {
    this.formGroup.patchValue({
      showCritical: this.preferences.showCritical,
      showTrash: this.preferences.showTrash,
      showMarkerWarnings: this.preferences.showMarkerWarnings,
      markerCleaning: this.preferences.markerCleaning,
    });
  }

  onSave(): HanabiPreferences | undefined {
    if (!this.formGroup.dirty) return undefined;

    const value = this.formGroup.value;

    return HanabiPreferences.builder()
      .withShowCritical(value.showCritical ?? false)
      .withShowTrash(value.showTrash ?? false)
      .withShowMarkerWarnings(value.showMarkerWarnings ?? false)
      .withMarkerCleaning(value.markerCleaning ?? false)
      .build();
  }
}
