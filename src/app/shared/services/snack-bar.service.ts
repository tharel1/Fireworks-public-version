import {Injectable} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

   constructor(
     private matSnackBar: MatSnackBar
   ) { }

  private open(message: string, panelClass: string): void {
    this.matSnackBar.open(message, '', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: [panelClass]
    });
  }

  success(message: string): void {
    this.open(message, 'success');
  }

  warn(message: string): void {
    this.open(message, 'warn');
  }

  error(message: string): void {
    this.open(message, 'error');
  }

  fatal(message: string): void {
    this.open(message, 'fatal');
  }
}
