import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { API_CONFIG } from '../../config/api.config';
import { ProdutoDTO } from '../../models/produto.dto';
import { ProdutoService } from '../../services/domain/produto.service';

@IonicPage()
@Component({
  selector: 'page-produto-detalhes',
  templateUrl: 'produto-detalhes.html',
})
export class ProdutoDetalhesPage {

  item: ProdutoDTO;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public produtoService: ProdutoService) {
  }

  ionViewDidLoad() {
    let produto_id = this.navParams.get('prod');
    this.produtoService.buscaPorId(produto_id)
    .subscribe(response => {
      this.item = response;
      this.getImagemUrlSeExiste();
    }, error => {});
  }

  getImagemUrlSeExiste(){
    this.produtoService.getImagemDoBucket(this.item.id)
    .subscribe(() =>{
      this.item.imagemUrl = `${API_CONFIG.bucketBaseUrl}/prod${this.item.id}.jpg`;
    }, error => {} );
  }
}
