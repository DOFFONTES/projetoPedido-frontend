import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_CONFIG} from "../config/api.config";
import {CredenciaisDTO} from "../models/CredenciaisDTO";

@Injectable()
export class AuthService {

  constructor(public http: HttpClient) {
  }

  autenticao(cred: CredenciaisDTO){
    return this.http.post(`${API_CONFIG.baseUrl}/login`,
      cred,
      {
        observe: "response",
        responseType: "text"
      });
  }
}
