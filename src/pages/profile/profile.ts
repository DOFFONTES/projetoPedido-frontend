import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {StorageService} from "../../services/storage.service";
import {ClienteDTO} from "../../models/cliente.dto";
import {ClienteService} from "../../services/domain/cliente.service";
import {API_CONFIG} from "../../config/api.config";
import { Camera, CameraOptions } from "@ionic-native/camera";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;
  picture: string;
  cameraOn: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: StorageService,
              public clienteService: ClienteService,
              public camera: Camera
              ) {
  }

  ionViewDidLoad() {
    let localUser = this.storage.getLocalUser();
    if(localUser && localUser.email){
      this.clienteService.buscaPorEmail(localUser.email)
        .subscribe(response => {
            this.cliente = response as ClienteDTO;
            this.getImageSeExiste();
          },
          error => {
            if(error.status == 403){
              this.navCtrl.setRoot("HomePage");
            }
          });
    }else{
      this.navCtrl.setRoot("HomePage");
    }
  }

  getImageSeExiste() {

    this.clienteService.getImagemDoBucket(this.cliente.id)
      .subscribe(response => {
          this.cliente.imagemUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
        },
        error => {});
  }

  getCameraPicture(){

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      this.picture = 'data:image/png;base64,' + imageData;

      this.cameraOn = false;
    }, (err) => {
      // Handle error
    });
  }

}
