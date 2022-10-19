import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpStatusCode, HTTP_INTERCEPTORS, } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable()
export class GlobalHttpInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          // Get client-side error
          errorMessage = error.error.message;
        } else {
          // Get service-side error
          if (error.status === HttpStatusCode.Unauthorized) {
            localStorage.clear();
            // this.router.navigate(['/login']);
          }
          errorMessage = error.error;
        }

        return throwError(() => errorMessage);
      })
    );
  }
}
export const GlobalHttpInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: GlobalHttpInterceptor,
  multi: true
}