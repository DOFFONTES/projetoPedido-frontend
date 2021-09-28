import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ProdutoDTO} from "../../models/produto.dto";
import {ProdutoService} from "../../services/domain/produto.service";
import {API_CONFIG} from "../../config/api.config";

@IonicPage()
@Component({
  selector: 'page-produtos',
  templateUrl: 'produtos.html',
})
export class ProdutosPage {

  itens: ProdutoDTO[];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public produtoService: ProdutoService,
              public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    this.loadData();
  }

  loadData(){
    let cat = this.navParams.get("categoria_id")
    let loader = this.presentLoading();
    this.produtoService.findByCategoria(cat).
    subscribe(response=> {
        this.itens = response['content'];
        loader.dismiss();
        this.carregaImagem();
      },
      error => {})
  }

  carregaImagem(){
    for(var i = 0; i < this.itens.length; i ++){
      let item = this.itens[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imagemUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.id}-small.jpg`;
        },
          error => {});
    }
  }

  mostraDetalhes(produto_id: string){
    this.navCtrl.push("ProdutoDetalhesPage", {produto_id: produto_id});
  }

  presentLoading() {
    let loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    loader.present();
    return loader;
  }

  doRefresh(refresher) {
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }
}
