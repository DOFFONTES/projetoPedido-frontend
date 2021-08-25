import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import {catchError} from "rxjs/operators";
import {StorageService} from "../services/storage.service"; // IMPORTANTE: IMPORT ATUALIZADO

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public storage: StorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log("Passou no interceptor");
    return next.handle(req)
      .pipe(
        catchError(error => {

          let errorObj = error;
          if(errorObj.error ){
            errorObj = errorObj.error;
          }
          if(!errorObj.status){
            errorObj = JSON.parse(errorObj);
          }

          console.log("Erro detectado pelo interceptor");
          console.log(errorObj);

          switch (errorObj.status) {

            case 403:
              this.erro403();
              break;
          }

          return Observable.throw(errorObj);
        })) as any;
  }

  erro403(){
    this.storage.setLocalUser(null);
  }

}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
