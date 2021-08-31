import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Rx";
import {API_CONFIG} from "../../config/api.config";
import {Injectable} from "@angular/core";
import {CidadeDTO} from "../../models/cidade.dto";

@Injectable()
export class CidadeService {

  constructor(public http: HttpClient) {
  }

  buscaTodos(estado_id: string): Observable<CidadeDTO[]>{
    return this.http.get<CidadeDTO[]>(`${API_CONFIG.baseUrl}/estados/${estado_id}/cidades`);
  }
}
