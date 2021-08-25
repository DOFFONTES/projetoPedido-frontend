import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import {catchError} from "rxjs/operators";
import {StorageService} from "../services/storage.service";
import {AlertController} from "ionic-angular"; // IMPORTANTE: IMPORT ATUALIZADO

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(public storage: StorageService, public alertCtrl: AlertController) {
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

            case 401:
              this.erro401();
              break;

            case 403:
              this.erro403();
              break;

            default:
              this.erroPadrao(errorObj);
              break;
          }

          return Observable.throw(errorObj);
        })) as any;
  }

  erro401(){
    let alert = this.alertCtrl.create({
      title: 'Erro 401: falha de autenticação',
      message: 'Email ou senha incorretos',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'ok'
        }
      ]
    });
    alert.present();
  }

  erro403(){
    this.storage.setLocalUser(null);
  }

  erroPadrao(erroObj){
    let alert = this.alertCtrl.create({
      title: 'Erro ' + erroObj.status + ': ' + erroObj.err + '.',
      message: erroObj.message + '.',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'ok'
        }
      ]
    });
    alert.present();
  }

}

export const ErrorInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
