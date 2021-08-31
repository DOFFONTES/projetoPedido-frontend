import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Rx";
import {API_CONFIG} from "../../config/api.config";
import {Injectable} from "@angular/core";
import {EstadoDTO} from "../../models/estado.dto";

@Injectable()
export class EstadoService {

  constructor(public http: HttpClient) {
  }

  buscaTodos(): Observable<EstadoDTO[]>{
    return this.http.get<EstadoDTO[]>(`${API_CONFIG.baseUrl}/estados`);
  }
}
