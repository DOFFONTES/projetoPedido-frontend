import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CategoriaDTO} from "../../models/categoria.dto";
import {API_CONFIG} from "../../config/api.config";
import {Observable} from "rxjs";
import {ProdutoDTO} from "../../models/produto.dto";

@Injectable()
export class ProdutoService {

  constructor(public http: HttpClient){

  }

  bucaPorCategoria(categoria_id: string): Observable<ProdutoDTO[]>{
    return this.http.get<ProdutoDTO[]>(`${API_CONFIG.baseUrl}/produtos/?categorias=${categoria_id}`);
  }

  getImagemPequenaDoBucket(id: string): Observable<any> {
    let url = `${API_CONFIG.bucketBaseUrl}/prod${id}-small.jpg`;
    return this.http.get(url,{responseType: "blob"});
  }

}
