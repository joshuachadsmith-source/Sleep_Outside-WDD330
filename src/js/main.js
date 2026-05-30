import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';

const dataSource = new ExternalServices();
const element = document.querySelector('.product-list');
const listing = new ProductList('tents', dataSource, element);

listing.init();