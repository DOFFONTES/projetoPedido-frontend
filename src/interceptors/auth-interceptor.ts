import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import {StorageService} from "../services/storage.service";
import {API_CONFIG} from "../config/api.config"; // IMPORTANTE: IMPORT ATUALIZADO

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(public storageService: StorageService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    let localUser = this.storageService.getLocalUser();

    let N = API_CONFIG.baseUrl.length;
    let x = req.url.substring(0, N) == API_CONFIG.baseUrl

    if(localUser && x){
      let authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + localUser.token)});
      return next.handle(authReq);
    }else{
      return next.handle(req);
    }

  }

}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
