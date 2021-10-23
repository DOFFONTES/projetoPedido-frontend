import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {StorageService} from "../../services/storage.service";
import {ClienteDTO} from "../../models/cliente.dto";
import {ClienteService} from "../../services/domain/cliente.service";
import {API_CONFIG} from "../../config/api.config";
import { Camera, CameraOptions } from "@ionic-native/camera";
import {DomSanitizer} from "@angular/platform-browser";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  cliente: ClienteDTO;
  picture: string;
  imagemDoPerfil;
  cameraOn: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: StorageService,
              public clienteService: ClienteService,
              public camera: Camera,
              public domSanitizer: DomSanitizer
              ) {
    this.imagemDoPerfil = 'assets/imgs/avatar-blank.png';
  }

  ionViewDidLoad() {
   this.loadData();
  }

  loadData(){
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
          this.blobToDataUrl(response).then(dataUrl => {
            let str = dataUrl as string;
            this.imagemDoPerfil = this.domSanitizer.bypassSecurityTrustUrl(str);
          });
        },
        error => {
          this.imagemDoPerfil = 'assets/imgs/avatar-blank.png';
        });
  }

  // https://gist.github.com/frumbert/3bf7a68ffa2ba59061bdcfc016add9ee
  blobToDataUrl(blob) {
    return new Promise((fulfill, reject) => {
      let reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => fulfill(reader.result);
      reader.readAsDataURL(blob);
    })
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
      this.picture = 'data:image/png;base64,' + imageData;

      this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
    });
  }

  getGaleriaPicture(){

    this.cameraOn = true;

    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.picture = 'data:image/png;base64,' + imageData;

      this.cameraOn = false;
    }, (err) => {
      this.cameraOn = false;
    });
  }

  enviaFoto(){
    this.clienteService.uploadPicture(this.picture)
      .subscribe(response => {
        this.picture = null;
        this.getImageSeExiste();
      },
          error => {
          });
  }

  cancel(){
    this.picture = null;
  }
}
