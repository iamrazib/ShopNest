
import { useEffect, useState } from 'react';
import './App.css';

function getProductIcon(name) {
  const value = name.toLowerCase();

  if (value.includes('backpack')) return '🎒';
  if (value.includes('headphone')) return '🎧';
  if (value.includes('bottle')) return '🥤';
  if (value.includes('watch')) return '⌚';

  return '🛍️';
}

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(price));
}

function App() {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error('Unable to retrieve products.');
        }

        const data = await response.json();

        if (!cancelled) {
          setProducts(data.products || []);
        }
      } catch {
        if (!cancelled) {
          setError(
            'We could not load products. Please check the backend connection.'
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="app" id="top">
      <header className="navbar">
        <a className="brand" href="#top">
          <span className="brand-icon">S</span>
          <span>ShopNest</span>
        </a>

        <nav className="navigation">
          <a href="#top">Home</a>
          <a href="#products">Products</a>
        </nav>

        <button
          className="cart-button"
          type="button"
          aria-label={`Shopping cart, ${cartCount} items`}
        >
          🛒 Cart ({cartCount})
        </button>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">WELCOME TO SHOPNEST</span>

            <h1>
              Find your everyday
              <span> essentials.</span>
            </h1>

            <p>
              Discover useful products, great value and simple shopping
              experiences, all in one place.
            </p>

            <a href="#products" className="shop-button">
              Explore Products →
            </a>
          </div>

          <div className="hero-decoration" aria-hidden="true">
            <span className="hero-circle">🛍️</span>
            <span className="floating-item item-one">🎧</span>
            <span className="floating-item item-two">🎒</span>
            <span className="floating-item item-three">🥤</span>
          </div>
        </section>

        <section className="benefits">
          <div>
            <span>🚚</span>
            <div>
              <strong>Reliable shopping</strong>
              <small>A simple shopping experience</small>
            </div>
          </div>

          <div>
            <span>🔒</span>
            <div>
              <strong>Secure experience</strong>
              <small>Designed with security in mind</small>
            </div>
          </div>

          <div>
            <span>⭐</span>
            <div>
              <strong>Quality products</strong>
              <small>Everyday essentials in one place</small>
            </div>
          </div>
        </section>

        <section className="products-section" id="products">
          <div className="section-heading">
            <div>
              <span className="eyebrow">OUR COLLECTION</span>
              <h2>Featured Products</h2>
              <p>Explore our selection of everyday essentials.</p>
            </div>

            <span className="product-count">
              {products.length} Products
            </span>
          </div>

          {loading && (
            <p className="message" role="status">
              Loading products...
            </p>
          )}

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="message">
              No products are currently available.
            </p>
          )}

          {!loading && !error && products.length > 0 && (
            <div className="product-grid">
              {products.map((product) => (
                <article className="product-card" key={product.id}>
                  <div className="product-image">
                    <span>{getProductIcon(product.name)}</span>
                    <span className="stock-label">
                      {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>

                  <div className="product-details">
                    <h3>{product.name}</h3>

                    <p className="product-description">
                      {product.description}
                    </p>

                    <div className="product-footer">
                      <strong>{formatPrice(product.price)}</strong>

                      <button
                        type="button"
                        disabled={product.stock <= 0}
                        onClick={() =>
                          setCartCount((count) => count + 1)
                        }
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="footer">
        <div className="brand footer-brand">
          <span className="brand-icon">S</span>
          <span>ShopNest</span>
        </div>

        <p>© {new Date().getFullYear()} ShopNest. All rights reserved.</p>
        <small>Built as a DevOps CI/CD demonstration project.</small>
      </footer>
    </div>
  );
}

export default App;
