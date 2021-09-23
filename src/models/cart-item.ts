import { ProdutoDTO } from "./produto.dto";

export interface CartItem {
    produto: ProdutoDTO;
    quantidade: number;

}
