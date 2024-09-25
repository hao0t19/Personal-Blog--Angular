import { HttpInterceptorFn } from '@angular/common/http';
// src/app/interceptors/http-request.interceptor.ts
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
    // Clone the request to add any necessary headers
    const clonedRequest = req.clone({
      // Example: Add an Authorization header
      // headers: req.headers.set('Authorization', 'Bearer YOUR_TOKEN'),
    });

    console.log('HTTP Request:', clonedRequest); // Log the request

    return next.handle(clonedRequest).pipe(
      catchError((error) => {
        console.error('HTTP Error:', error); // Handle errors globally
        return of(error); // Return an observable with the error
      })
    );
  }
}
