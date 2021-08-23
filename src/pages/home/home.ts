import {Component} from '@angular/core';
import {IonicPage, MenuController, NavController} from 'ionic-angular';
import {CredenciaisDTO} from "../../models/CredenciaisDTO";
import {AuthService} from "../../services/AuthService";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  cred: CredenciaisDTO = {
  email: "",
  senha: ""
};

  constructor(public navCtrl: NavController,
              public menu: MenuController,
              public auth: AuthService) {

  }
  ionViewWillEnter(){
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave(){
    this.menu.swipeEnable(true);
  }

  login(){

    this.auth.autenticao(this.cred)
      .subscribe(response => {
          this.auth.loginComSucesso(response.headers.get('Authorization'));
          this.navCtrl.setRoot("CategoriasPage");
        },
        error => {});
  }

}
