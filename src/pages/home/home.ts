import {Component} from '@angular/core';
import {IonicPage, MenuController, NavController} from 'ionic-angular';
import {CredenciaisDTO} from "../../models/CredenciaisDTO";

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

  constructor(public navCtrl: NavController, public menu: MenuController) {

  }
  ionViewWillEnter(){
    this.menu.swipeEnable(false);
  }

  ionViewDidLeave(){
    this.menu.swipeEnable(true);
  }

  login(){

    console.log(this.cred)
    this.navCtrl.setRoot("CategoriasPage");
  }

}
