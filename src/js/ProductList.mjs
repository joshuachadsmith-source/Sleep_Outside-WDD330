import { renderListWithTemplate } from './utils.mjs';

function productCardTemplate(product) {
    return `          <li class="product-card">
            <a href="product_pages/?product=${product.id}">
              <img
                src="${product.image}"
                alt="${product.name}"
              />
              <h3 class="card__brand">${product.brand}</h3>
              <h2 class="card__name">${product.name}</h2>
              <p class="product-card__price">$${product.price.toFixed(2)}</p>
            </a>
          </li>
          <li class="product-card">`
};

export default class ProductList {
    constructor(category, dataSource, listElement) {
        this.category = category;
        this.dataSource = dataSource;
        this.listElement= listElement;
    }
    async init() {
        const list = await this.dataSource.getData();
        this.renderList(list);
    }

    renderList(list) {
            renderListWithTemplate(productCardTemplate, this.listElement, list);
        }
};


