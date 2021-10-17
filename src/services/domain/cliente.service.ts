import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {API_CONFIG} from "../../config/api.config";
import {ClienteDTO} from "../../models/cliente.dto";
import {Observable} from "rxjs";
import {StorageService} from "../storage.service";
import {ImagemUtilService} from "../imagem-util.service";

@Injectable()
export class ClienteService{

  constructor(public http: HttpClient,
              public storage: StorageService,
              public imagemUtilService: ImagemUtilService
              ) {
  }

  buscaPorEmail(email: string) {
    return this.http.get(
      `${API_CONFIG.baseUrl}/clientes/busca/email?value=${email}`);
  }

  buscaPorId(id: string) {
    return this.http.get(
      `${API_CONFIG.baseUrl}/clientes/${id}`);
  }

  getImagemDoBucket(id : string) : Observable<any> {
    let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`
    return this.http.get(url, {responseType : 'blob'});
  }

  insert(obj : ClienteDTO) {
    return this.http.post(
      `${API_CONFIG.baseUrl}/clientes`,
      obj,
      {
        observe: "response",
        responseType: "text"
      }
    );
  }

  uploadPicture(picture){
    let pictureBlob = this.imagemUtilService.dataUriToBlob(picture);
    let formData: FormData = new FormData();
    formData.set('file', pictureBlob, 'file.png');

    return this.http.post(
      `${API_CONFIG.baseUrl}/clientes/picture`,
      formData,
      {
        observe: "response",
        responseType: "text"
      }
    );
  }
}
