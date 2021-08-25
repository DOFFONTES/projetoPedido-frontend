import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_CONFIG} from "../config/api.config";
import {CredenciaisDTO} from "../models/Credenciais.dto";
import {StorageService} from "./storage.service";
import {LocalUser} from "../models/local_user";
import {JwtHelper} from "angular2-jwt";

@Injectable()
export class AuthService {

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(public http: HttpClient, public storage: StorageService) {
  }

  autenticao(cred: CredenciaisDTO){
    return this.http.post(`${API_CONFIG.baseUrl}/login`,
      cred,
      {
        observe: "response",
        responseType: "text"
      });
  }

  loginComSucesso(authorizationValue: string){
    let tok = authorizationValue.substring(7);
    let user : LocalUser = {
      token : tok,
      email : this.jwtHelper.decodeToken(tok).sub
    };
    this.storage.setLocalUser(user);
  }

  logout(){
    this.storage.setLocalUser(null);
  }
}

