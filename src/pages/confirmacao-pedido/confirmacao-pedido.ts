import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {PedidoDTO} from "../../models/pedido.dto";
import {CartItem} from "../../models/cart-item";
import {CartService} from "../../services/domain/cart.service";
import {ClienteDTO} from "../../models/cliente.dto";
import {EnderecoDTO} from "../../models/endereco.dto";
import {ClienteService} from "../../services/domain/cliente.service";
import {PedidoService} from "../../services/domain/pedido.service";

@IonicPage()
@Component({
  selector: 'page-confirmacao-pedido',
  templateUrl: 'confirmacao-pedido.html',
})
export class ConfirmacaoPedidoPage {

  pedido: PedidoDTO;
  cartItems: CartItem[];
  cliente: ClienteDTO;
  endereco: EnderecoDTO;
  codePedido: string;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public cartService: CartService,
              public clienteService: ClienteService,
              public pedidoService: PedidoService
              ) {

   this.pedido = this.navParams.get('pedido');
  }

  ionViewDidLoad() {
    this.cartItems = this.cartService.getCart().items;

    this.clienteService.buscaPorId(this.pedido.cliente.id)
      .subscribe(response => {
        this.cliente = response as ClienteDTO;
        this.endereco = this.buscaEndereco(this.pedido.enderecoDeEntrega.id, response['enderecos']);
      },
        error => this.navCtrl.setRoot("HomePage"));
  }

  private buscaEndereco(id: string, lista: EnderecoDTO[]): EnderecoDTO {
    let posicao = lista.findIndex(x => x.id == id);
    return lista[posicao];
  }

  total(){
    return this.cartService.total();
  }

  voltar(){
    this.navCtrl.setRoot('CartPage');
  }

  salvaPedido(){
    this.pedidoService.insert(this.pedido)
      .subscribe(response =>{
        this.cartService.createOrClearCart();
        this.codePedido = this.extraiId(response.headers.get('location'));
      },
        error => {
          if (error.status == 403){
            this.navCtrl.setRoot('HomePage');
          }
        });
  }

  private extraiId(location: string): string{
    let posicao = location.lastIndexOf('/');
    return location.substring(posicao + 1, location.length);
  }

  home(){
    this.navCtrl.setRoot("CategoriasPage");
  }
}
