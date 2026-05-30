import { setLocalStorage } from "./utils.mjs";

export default class ProductDetails {
 
  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
    }
    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();
        
    document
      .getElementById('addToCart')
      .addEventListener('click', this.addToCart.bind(this));
        }
}

function addProductToCart(product) {
  const listArray = getLocalStorage('so-cart') || [];
  listArray.push(product);
  setLocalStorage('so-cart', listArray);
}

function renderProductDetails() {
    console.log(this.product);
}