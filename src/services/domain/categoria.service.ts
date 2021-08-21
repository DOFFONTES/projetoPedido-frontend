import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Rx";
import {CategoriaDTO} from "../../models/categoria.dto";
import {API_CONFIG} from "../../config/api.config";
import {Injectable} from "@angular/core";

@Injectable()
export class CategoriaService {

  constructor(public http: HttpClient) {
  }

  buscaTodos(): Observable<CategoriaDTO[]>{
    return this.http.get<CategoriaDTO[]>(`${API_CONFIG.baseUrl}/categorias`);
  }
}
