import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach(function (value, key) {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  return items.map((item) => {
    return {
      id: item.Id,
      name: item.Name,
      price: item.FinalPrice,
      quantity: 1,
    };
  });
}

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    const amounts = this.list.map((item) => item.FinalPrice);
    this.itemTotal = amounts.reduce((sum, item) => sum + item, 0);
    
    const summaryElement = document.querySelector(`${this.outputSelector} #cartTotal`);
    if(summaryElement) {
      summaryElement.innerText = this.itemTotal.toFixed(2);
    }
  }

  calculateOrderTotal() {
    this.tax = parseFloat((this.itemTotal * 0.06).toFixed(2));
    
    if (this.list.length > 0) {
      this.shipping = 10 + (this.list.length - 1) * 2;
    } else {
      this.shipping = 0;
    }
    
    this.orderTotal = (parseFloat(this.itemTotal) + this.tax + this.shipping).toFixed(2);
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    document.querySelector(`${this.outputSelector} #tax`).innerText = this.tax.toFixed(2);
    document.querySelector(`${this.outputSelector} #shipping`).innerText = this.shipping.toFixed(2);
    document.querySelector(`${this.outputSelector} #orderTotal`).innerText = this.orderTotal;
  }

  async checkout(formElement) {
    const json = formDataToJSON(formElement);
    json.orderDate = new Date().toISOString();
    json.orderTotal = this.orderTotal;
    json.tax = this.tax;
    json.shipping = this.shipping;
    json.items = packageItems(this.list);

    try {
      const res = await services.checkout(json);
      console.log("Order successful!", res);
    } catch (err) {
      console.log(err);
    }
  }
}