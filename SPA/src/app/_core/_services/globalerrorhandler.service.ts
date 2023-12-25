import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CaptionConstants } from '../_constants/message.enum';
import { NgSnotifyService } from './ng-snotify.service';
import { TranslateService } from "@ngx-translate/core";
@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(private snotify: NgSnotifyService, private zone: NgZone, private translateService: TranslateService) { }
  handleError(error: any): void {
    this.zone.run(() => {
      if (error instanceof HttpErrorResponse) {
        this.snotify.error(CaptionConstants.ERROR, `HTTP Error: ${error.status} - ${error.statusText}`);
      } else if (error instanceof Error) {
        this.snotify.error(CaptionConstants.ERROR, error.message);
      } else {
      //  this.snotify.error(CaptionConstants.ERROR, error);
        this.snotify.error(this.translateService.instant('System.Caption.Error') ,error)
      }
    });
  }
}
