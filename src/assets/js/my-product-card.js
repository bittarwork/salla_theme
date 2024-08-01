class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.product = null;
    this.horizontal = false;
    this.showWishlist = false;
  }

  connectedCallback() {
    // Parse product data from the attribute
    this.product = JSON.parse(this.getAttribute('product'));

    // Set properties from attributes
    this.horizontal = this.getAttribute('horizontal') === 'true';
    this.showWishlist = this.getAttribute('show-wishlist') === 'true';

    // Add CSS classes and ID
    this.classList.add('product-block');
    this.id = `product_${this.product.id}`;
    if (this.product.is_out_of_stock) {
      this.classList.add('is-out');
    }

    // Ensure Salla library is ready before rendering
    salla.onReady(() => {
      let fitType = salla.config.get('store.settings.product.fit_type');
      if (fitType) {
        this.classList.add(fitType);
      }
      this.render();
      if (!salla.lang.translationsLoaded) {
        salla.lang.onLoaded(() => this.render());
      }
    });
  }

  render() {
    // Determine source page
    this.source = salla.config.get('page.slug');
    if (this.source == 'landing-page') {
      this.hideAddBtn = true;
      this.showQuantity = true;
    }

    // Fetch translations
    const remained = salla.lang.get('pages.products.remained');
    const outOfStock = salla.lang.get('pages.products.out_of_stock');
    const calories = salla.lang.get('pages.products.calories');

    // Generate HTML content
    this.innerHTML = `
      <div class="product-block__thumb">
        <img class="lazy-load" src="${this.product.image}" alt="${this.product.name}">
        <span class="promotion-title">${this.product.promotion_title || ''}</span>
      </div>
      <div class="product-block__info">
        <h3>${this.product.name}</h3>
        <p class="product-price">${this.product.price}</p>
        <div class="product-description">${this.product.description}</div>
        <button class="add-to-cart">أضف للسلة</button>
      </div>
    `;

    // Lazy load images
    document.lazyLoadInstance?.update(document.querySelectorAll('.product-block__thumb .lazy-load'));
  }
}

// Register custom element
customElements.define('custom-salla-product-card', ProductCard);
