import {ErrorHandler, Injectable} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {SnackBarService} from "./shared/services/snack-bar.service";

@Injectable()
export class AppErrorHandler implements ErrorHandler {

  constructor(private snackBarService: SnackBarService) {
  }

  handleError(error: any): void {
    if (error instanceof HttpErrorResponse)
      return this.handleHttpError(error);

    this.snackBarService.fatal('A technical error has occurred.');
    console.error(error);
  }

  private handleHttpError(error: HttpErrorResponse): void {
    console.error(error);
  }

}
