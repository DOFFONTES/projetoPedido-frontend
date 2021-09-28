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

  itens: ProdutoDTO[] = [];
  page: number = 0;
  checkComplete: boolean = false;

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
    this.produtoService.findByCategoria(cat, this.page, 10)
      .subscribe(response=> {
        let inicio = this.itens.length;
        this.itens = this.itens.concat(response['content']);
        let fim = this.itens.length - 1;
        console.log(this.page);
        console.log(this.itens);
        loader.dismiss();
        this.carregaImagem(inicio, fim);
        if(response["last"] == true) {
          this.checkComplete = true;
        }
      },
      error => {})
  }

  carregaImagem(inicio: number, fim: number){
    for(var i = inicio; i <= fim; i ++){
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
    this.page = 0;
    this.itens = [];
    this.checkComplete = false;
    this.loadData();
    setTimeout(() => {
      refresher.complete();
    }, 1000);
  }

  doInfinite(infiniteScroll) {
    this.page++;
    this.loadData();
    setTimeout(() => {
      infiniteScroll.complete();

    }, 1000);
  }

}
