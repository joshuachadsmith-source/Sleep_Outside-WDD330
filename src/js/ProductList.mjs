export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    try {
      const list = await this.dataSource.getData(this.category);
      
      const filteredList = list.filter(item => 
        ['880RR', '985RF', '985PR', '344YJ'].includes(item.Id)
      );
      
      const finalItems = filteredList.length > 0 ? filteredList : list;

      this.renderList(finalItems);
      this.setupQuickView();
    } catch (error) {
      console.error("Error loading products:", error);
    }
  }

  renderList(list) {
    const htmlStrings = list.map((product) => this.productCardTemplate(product));
    this.listElement.innerHTML = htmlStrings.join("");
  }

  productCardTemplate(product) {
    let imageUrl = product.Image || "";
    if (product.Images && product.Images.PrimaryMedium) {
        imageUrl = product.Images.PrimaryMedium;
    }
    
    let brandName = "";
    if (product.Brand && product.Brand.Name) {
        brandName = product.Brand.Name;
    }

    let name = product.NameWithoutBrand || product.Name || "Unknown Product";
    
    return `<li class="product-card">
      <a href="/product_pages/index.html?product=${product.Id}">
        <img src="${imageUrl}" alt="${name}" />
        <h3 class="card__brand">${brandName}</h3>
        <h2 class="card__name">${name}</h2>
        <p class="product-card__price">$${product.FinalPrice}</p>
      </a>
      <button class="quick-view-btn" data-id="${product.Id}">Quick View</button>
    </li>`;
  }

  setupQuickView() {
    const buttons = document.querySelectorAll(".quick-view-btn");
    buttons.forEach((button) => {
      button.addEventListener("click", async (e) => {
        const id = e.target.dataset.id;
        try {
          const product = await this.dataSource.findProductById(id);
          this.renderModalDetails(product);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      });
    });

    const modal = document.getElementById("quickViewModal");
    const closeBtn = document.querySelector(".close-modal");

    if (closeBtn && modal) {
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });

      window.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.style.display = "none";
        }
      });
    }
  }

  renderModalDetails(product) {
    const modalBody = document.getElementById("modal-body");
    
    let imageUrl = product.Image || "";
    if (product.Images && product.Images.PrimaryLarge) {
        imageUrl = product.Images.PrimaryLarge;
    }

    modalBody.innerHTML = `
      <h2>${product.Name}</h2>
      <img src="${imageUrl}" alt="${product.Name}" style="max-width: 100%; margin: 10px 0;">
      <p class="product-card__price" style="font-size: 1.5em; margin-bottom: 10px;">$${product.FinalPrice}</p>
      <p>${product.DescriptionHtmlSimple}</p>
    `;
    
    document.getElementById("quickViewModal").style.display = "block";
  }
}