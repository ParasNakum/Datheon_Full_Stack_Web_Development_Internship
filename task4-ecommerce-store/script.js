/**
 * Modern E-Commerce Storefront
 * Datheon Full Stack Web Development Internship (Task 4)
 * Student: Paras Nakum (ID: DT-2026-YQFWW)
 */

document.addEventListener('DOMContentLoaded', () => {
    const CART_STORAGE_KEY = 'nexstore_paras_cart';

    // State
    let products = [];
    let cart = loadCartFromStorage();
    let currentCategory = 'all';
    let currentSearchQuery = '';
    let currentSort = 'featured';

    // DOM Elements
    const productsGrid = document.getElementById('productsGrid');
    const storeLoading = document.getElementById('storeLoading');
    const emptyProducts = document.getElementById('emptyProducts');
    const catalogTitle = document.getElementById('catalogTitle');
    const catalogCount = document.getElementById('catalogCount');

    const categoryTabs = document.getElementById('categoryTabs');
    const storeSearchInput = document.getElementById('storeSearchInput');
    const sortSelect = document.getElementById('sortSelect');

    // Cart Elements
    const openCartBtn = document.getElementById('openCartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartDrawer = document.getElementById('cartDrawer');
    const cartOverlay = document.getElementById('cartOverlay');
    const cartBadgeCount = document.getElementById('cartBadgeCount');
    const cartDrawerCount = document.getElementById('cartDrawerCount');
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCartState = document.getElementById('emptyCartState');
    const cartSubtotalEl = document.getElementById('cartSubtotal');
    const cartTaxEl = document.getElementById('cartTax');
    const cartShippingEl = document.getElementById('cartShipping');
    const cartGrandTotalEl = document.getElementById('cartGrandTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Checkout Modal Elements
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutModal = document.getElementById('closeCheckoutModal');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutModalBody = document.getElementById('checkoutModalBody');
    const orderConfirmedView = document.getElementById('orderConfirmedView');
    const checkoutOrderTotal = document.getElementById('checkoutOrderTotal');
    const orderRefNumber = document.getElementById('orderRefNumber');
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');

    // Toast
    const storeToast = document.getElementById('storeToast');
    const storeToastMsg = document.getElementById('storeToastMsg');

    // Initialize
    updateCartUI();
    fetchProducts();

    // 1. FETCH PRODUCTS (FakeStoreAPI with fallback)
    async function fetchProducts() {
        storeLoading.style.display = 'block';
        emptyProducts.style.display = 'none';

        try {
            const res = await fetch('https://fakestoreapi.com/products');
            if (!res.ok) throw new Error('Network response was not ok');
            products = await res.json();
            renderCatalog();
        } catch (error) {
            console.warn('FakeStoreAPI fetch failed, loading curated local fallback catalog:', error);
            products = getFallbackProducts();
            renderCatalog();
        } finally {
            storeLoading.style.display = 'none';
        }
    }

    // 2. RENDER CATALOG
    function renderCatalog() {
        productsGrid.innerHTML = '';

        let filtered = products.filter(p => {
            const matchesCat = currentCategory === 'all' || p.category.toLowerCase() === currentCategory.toLowerCase();
            const matchesSearch = !currentSearchQuery || 
                p.title.toLowerCase().includes(currentSearchQuery.toLowerCase()) || 
                p.description.toLowerCase().includes(currentSearchQuery.toLowerCase());
            return matchesCat && matchesSearch;
        });

        // Sorting
        if (currentSort === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (currentSort === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (currentSort === 'rating') {
            filtered.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        }

        // Update Headers
        catalogTitle.textContent = currentCategory === 'all' ? 'All Products' : currentCategory;
        catalogCount.textContent = `Showing ${filtered.length} product(s)`;

        if (filtered.length === 0) {
            emptyProducts.style.display = 'block';
            return;
        }

        emptyProducts.style.display = 'none';

        filtered.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';

            const rate = product.rating ? product.rating.rate : 4.5;
            const count = product.rating ? product.rating.count : 42;

            card.innerHTML = `
                <div class="product-thumb">
                    <span class="category-tag">${product.category}</span>
                    <img src="${product.image}" alt="${escapeHTML(product.title)}" loading="lazy">
                </div>
                <div class="product-content">
                    <div class="rating-box">
                        <i class="fas fa-star"></i>
                        <span>${rate}</span>
                        <span class="rating-count">(${count})</span>
                    </div>
                    <h3 class="product-name" title="${escapeHTML(product.title)}">${escapeHTML(product.title)}</h3>
                    <div class="product-bottom">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        <button class="btn-add-cart" data-id="${product.id}">
                            <i class="fas fa-plus"></i> Add
                        </button>
                    </div>
                </div>
            `;

            const addBtn = card.querySelector('.btn-add-cart');
            addBtn.addEventListener('click', () => addToCart(product.id));

            productsGrid.appendChild(card);
        });
    }

    // 3. CART OPERATIONS
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        saveCartToStorage();
        updateCartUI();
        showToast(`Added "${product.title.slice(0, 24)}..." to bag!`);
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        saveCartToStorage();
        updateCartUI();
    }

    function updateQuantity(productId, delta) {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                removeFromCart(productId);
                return;
            }
            saveCartToStorage();
            updateCartUI();
        }
    }

    function calculateCartTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.08;
        const shipping = subtotal > 50 || subtotal === 0 ? 0 : 5.99;
        const grandTotal = subtotal + tax + shipping;

        return { subtotal, tax, shipping, grandTotal };
    }

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartBadgeCount.textContent = totalItems;
        cartDrawerCount.textContent = totalItems;

        if (cart.length === 0) {
            emptyCartState.style.display = 'block';
            cartItemsList.innerHTML = '';
        } else {
            emptyCartState.style.display = 'none';
            cartItemsList.innerHTML = cart.map(item => `
                <li class="cart-item">
                    <img src="${item.image}" alt="${escapeHTML(item.title)}" class="cart-item-img">
                    <div class="cart-item-info">
                        <span class="cart-item-title">${escapeHTML(item.title)}</span>
                        <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                        <div class="cart-item-controls">
                            <div class="qty-control">
                                <button class="qty-btn" onclick="window.dispatchCartQty(${item.id}, -1)">-</button>
                                <span class="qty-value">${item.quantity}</span>
                                <button class="qty-btn" onclick="window.dispatchCartQty(${item.id}, 1)">+</button>
                            </div>
                            <button class="btn-remove-item" onclick="window.dispatchCartRemove(${item.id})" title="Remove">
                                <i class="fas fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                </li>
            `).join('');
        }

        const totals = calculateCartTotals();
        cartSubtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
        cartTaxEl.textContent = `$${totals.tax.toFixed(2)}`;
        cartShippingEl.textContent = totals.shipping === 0 ? 'FREE' : `$${totals.shipping.toFixed(2)}`;
        cartGrandTotalEl.textContent = `$${totals.grandTotal.toFixed(2)}`;
        checkoutOrderTotal.textContent = `$${totals.grandTotal.toFixed(2)}`;
    }

    // Expose handlers to window for inline onclicks
    window.dispatchCartQty = (id, delta) => updateQuantity(id, delta);
    window.dispatchCartRemove = (id) => removeFromCart(id);

    // 4. DRAWER CONTROLS
    function openCart() {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    openCartBtn.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // 5. CHECKOUT FLOW
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty! Add products first.');
            return;
        }
        closeCart();
        orderConfirmedView.style.display = 'none';
        checkoutModalBody.style.display = 'block';
        checkoutModal.classList.add('active');
    });

    closeCheckoutModal.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
    });

    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Generate Order Ref
        const randomRef = 'ORD-' + Math.floor(100000 + Math.random() * 900000) + '-DT';
        orderRefNumber.textContent = randomRef;

        // Clear cart
        cart = [];
        saveCartToStorage();
        updateCartUI();

        // Switch to Confirmation
        checkoutModalBody.style.display = 'none';
        orderConfirmedView.style.display = 'block';
    });

    continueShoppingBtn.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
    });

    // 6. FILTERS, SEARCH & SORTING
    categoryTabs.addEventListener('click', (e) => {
        if (e.target.classList.contains('cat-pill')) {
            document.querySelectorAll('.cat-pill').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            currentCategory = e.target.getAttribute('data-category');
            renderCatalog();
        }
    });

    storeSearchInput.addEventListener('input', (e) => {
        currentSearchQuery = e.target.value.trim();
        renderCatalog();
    });

    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderCatalog();
    });

    // 7. TOAST NOTIFICATION
    function showToast(message) {
        storeToastMsg.textContent = message;
        storeToast.classList.add('show');
        setTimeout(() => storeToast.classList.remove('show'), 2600);
    }

    // 8. STORAGE HELPERS
    function saveCartToStorage() {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }

    function loadCartFromStorage() {
        try {
            const data = localStorage.getItem(CART_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    function escapeHTML(str) {
        return str ? str.replace(/[&<>'"]/g, tag => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
        }[tag] || tag)) : '';
    }

    // 9. ROBUST LOCAL FALLBACK DATA (in case FakeStoreAPI has temporary network or CORS latency)
    function getFallbackProducts() {
        return [
            {
                id: 1,
                title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
                price: 109.95,
                description: "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve.",
                category: "men's clothing",
                image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
                rating: { rate: 3.9, count: 120 }
            },
            {
                id: 2,
                title: "Mens Casual Premium Slim Fit T-Shirts",
                price: 22.3,
                description: "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric.",
                category: "men's clothing",
                image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UT_.jpg",
                rating: { rate: 4.1, count: 259 }
            },
            {
                id: 5,
                title: "John Hardy Women's Legends Naga Gold & Silver Dragon Station Bracelet",
                price: 695,
                description: "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl.",
                category: "jewelery",
                image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
                rating: { rate: 4.6, count: 400 }
            },
            {
                id: 9,
                title: "WD 2TB Elements Portable External Hard Drive - USB 3.0",
                price: 64,
                description: "USB 3.0 and USB 2.0 Compatibility Fast data transfers Improve PC Performance High Capacity.",
                category: "electronics",
                image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg",
                rating: { rate: 3.3, count: 203 }
            },
            {
                id: 10,
                title: "SanDisk SSD PLUS 1TB Internal SSD - SATA III 6 Gb/s",
                price: 109,
                description: "Easy upgrade for faster boot up, shutdown, application load and response. Boosts burst write performance.",
                category: "electronics",
                image: "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
                rating: { rate: 2.9, count: 470 }
            },
            {
                id: 15,
                title: "BIYLACLESEN Women's 3-in-1 Snowboard Jacket Winter Coat",
                price: 56.99,
                description: "Note: The Jackets is US standard size, Please choose size as your usual wear. Material: 100% Polyester.",
                category: "women's clothing",
                image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg",
                rating: { rate: 2.6, count: 235 }
            }
        ];
    }
});
