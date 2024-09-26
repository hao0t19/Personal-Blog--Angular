import { HttpInterceptorFn } from '@angular/common/http';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Injectable } from '@angular/core';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const clonedRequest = req.clone({
    });

    return next.handle(clonedRequest).pipe(
      catchError((error) => {
        console.error('HTTP Error:', error); 
        return of(error); 
      })
    );
  }
}
