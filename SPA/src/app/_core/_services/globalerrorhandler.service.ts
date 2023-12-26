import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CaptionConstants } from '../_constants/message.enum';
import { NgSnotifyService } from './ng-snotify.service';
import { TranslateService } from "@ngx-translate/core";
import { NgxSpinnerService } from 'ngx-spinner';
@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandlerService implements ErrorHandler {

  constructor(private snotify: NgSnotifyService, private zone: NgZone, private translateService: TranslateService, private spinner: NgxSpinnerService) { }
  handleError(error: any): void {
    this.zone.run(() => {
      if (error instanceof HttpErrorResponse) {
        console.log('error 1: ', error);
        this.snotify.error(CaptionConstants.ERROR, `HTTP Error: ${error.status} - ${error.statusText}`);
      } else if (error instanceof Error) {
        console.log('error 2: ', error);
        this.snotify.error(CaptionConstants.ERROR, error.message);
      } else {
      //  this.snotify.error(CaptionConstants.ERROR, error);
      console.log('error 3: ', error);
        this.snotify.error(this.translateService.instant('System.Caption.Error') ,error)
      }
      this.spinner.hide();
    });
  }
}
