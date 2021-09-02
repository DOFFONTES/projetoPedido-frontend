import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {ProdutoDto} from "../../models/produto.dto";
import {ProdutoService} from "../../services/domain/produto.service";
import {API_CONFIG} from "../../config/api.config";

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  itens: ProdutoDto[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public produtoService: ProdutoService) {
  }

  ionViewDidLoad() {

    let cat = this.navParams.get("categoria_id")
    this.produtoService.bucaPorCategoria(cat).
      subscribe(response=> {
        this.itens = response['content'];
        this.carregaImagem();
    },
        error => {})

    console.log('ionViewDidLoad ProdutosPage');
  };

  carregaImagem(){
    for(var i = 0; i < this.itens.length; i ++){
      let item = this.itens[i];
      this.produtoService.getImagemPequenaDoBucket(item.id)
        .subscribe(response => {
          item.imagemUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        },
          error => {});

    }
  }
}
