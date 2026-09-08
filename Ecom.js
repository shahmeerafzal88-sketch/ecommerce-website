// =========================
// WISHLIST
// =========================

const wishlistButtons = document.querySelectorAll(".wishlist-btn");

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

wishlistButtons.forEach(function(button, index) {

    if (wishlist.includes(index)) {
        button.classList.add("active");
    }

    button.addEventListener("click", function() {

        if (wishlist.includes(index)) {

            wishlist = wishlist.filter(function(item) {
                return item !== index;
            });

            button.classList.remove("active");

        } else {

            wishlist.push(index);

            button.classList.add("active");
        }

        localStorage.setItem("wishlist", JSON.stringify(wishlist));

    });

});
// =========================
// CART
// =========================

const addCartButtons =
    document.querySelectorAll(".add-cart-btn");

let cart =
    JSON.parse(localStorage.getItem("cart")) || [];

const cartCount =
    document.querySelector(".cart-count");


// =========================
// UPDATE CART COUNT
// =========================

function updateCartCount() {

    if (cartCount) {

        cartCount.textContent =
            cart.length;

    }

}


// =========================
// ADD TO CART
// =========================

addCartButtons.forEach(function(button, index) {

    button.addEventListener("click", function() {

        const productCard =
            button.closest(".product-card");


        const productName =
            productCard
                .querySelector("h3")
                .textContent;


        const productPrice =
            productCard
                .querySelector(".price")
                .textContent;


        const productImage =
            productCard
                .querySelector(".product-image > img")
                .src;


        // Check existing product
        const alreadyInCart =
            cart.some(function(product) {

                return product.id === index;

            });


        if (alreadyInCart) {

            console.log(
                productName +
                " is already in cart"
            );

            return;

        }


        // Product object
        const product = {

            id: index,

            name: productName,

            price: productPrice,

            image: productImage,

            quantity: 1

        };


        // Add product
        cart.push(product);


        // Save cart
        localStorage.setItem(
            "cart",
            JSON.stringify(cart)
        );


        // Update count
        updateCartCount();


        console.log(
            productName +
            " added to cart"
        );

    });

});


// =========================
// INITIAL CART COUNT
// =========================

updateCartCount();


// =========================
// CART PAGE ELEMENTS
// =========================

const cartItems =
    document.querySelector(".cart-items");


const cartSubtotal =
    document.querySelector("#cart-subtotal");


const cartTotal =
    document.querySelector("#cart-total");


const checkoutButton =
    document.querySelector(".checkout-btn");


// =========================
// UPDATE CART SUMMARY
// =========================

function updateCartSummary() {

    if (!cartSubtotal || !cartTotal) {
        return;
    }


    let subtotal = 0;


    cart.forEach(function(product) {

        // Old products ke liye
        // quantity automatically 1
        if (!product.quantity) {

            product.quantity = 1;

        }


        // "Rs. 3,000" → 3000
        const price =
            Number(
                product.price
                    .replace("Rs.", "")
                    .replace(/,/g, "")
                    .trim()
            );


        subtotal +=
            price * product.quantity;

    });


    cartSubtotal.textContent =
        "Rs. " +
        subtotal.toLocaleString();


    cartTotal.textContent =
        "Rs. " +
        subtotal.toLocaleString();

}


// =========================
// CART PAGE
// =========================

if (cartItems) {

    function displayCart() {

        cartItems.innerHTML = "";

        // =========================
        // EMPTY CART
        // =========================

        if (cart.length === 0) {

            cartItems.innerHTML = `

                <div class="empty-cart">

                    <div class="empty-cart-icon">
                        🛒
                    </div>

                    <h2>
                        Your Cart is Empty
                    </h2>

                    <p>
                        Looks like you haven't added
                        anything to your cart yet.
                    </p>

                    <a
                        href="index.html"
                        class="empty-cart-btn"
                    >
                        Start Shopping
                    </a>

                </div>

            `;

            updateCartSummary();

            if (checkoutButton) {
                checkoutButton.disabled = true;
            }

            return;
        }


        // =========================
        // ENABLE CHECKOUT
        // =========================

        if (checkoutButton) {
            checkoutButton.disabled = false;
        }


        // =========================
        // DISPLAY PRODUCTS
        // =========================

        cart.forEach(function(product) {

            if (!product.quantity) {
                product.quantity = 1;
            }


            const cartItem =
                document.createElement("div");


            cartItem.classList.add(
                "cart-item"
            );


            cartItem.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >


                <div class="cart-item-info">

                    <h3>
                        ${product.name}
                    </h3>


                    <p>
                        ${product.price}
                    </p>


                    ${
                        product.size
                        ? `<p>Size: ${product.size}</p>`
                        : ""
                    }


                    ${
                        product.color
                        ? `<p>Color: ${product.color}</p>`
                        : ""
                    }


                    <!-- QUANTITY -->

                    <div class="quantity">

                        <button
                            class="quantity-btn minus-btn"
                            data-id="${product.id}"
                            type="button"
                        >
                            −
                        </button>


                        <span class="quantity-value">
                            ${product.quantity}
                        </span>


                        <button
                            class="quantity-btn plus-btn"
                            data-id="${product.id}"
                            type="button"
                        >
                            +
                        </button>

                    </div>


                    <!-- REMOVE -->

                    <button
                        class="remove-cart-btn"
                        data-id="${product.id}"
                        type="button"
                    >
                        Remove
                    </button>

                </div>

            `;


            cartItems.appendChild(cartItem);

        });


        // =========================
        // REMOVE BUTTONS
        // =========================

        const removeButtons =
            document.querySelectorAll(
                ".remove-cart-btn"
            );


        removeButtons.forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const productId =
                        button.dataset.id;


                    cart =
                        cart.filter(
                            function(product) {

                                return String(product.id) !==
                                       String(productId);

                            }
                        );


                    localStorage.setItem(
                        "cart",
                        JSON.stringify(cart)
                    );


                    displayCart();

                    updateCartCount();

                }
            );

        });


        // =========================
        // MINUS BUTTONS
        // =========================

        const minusButtons =
            document.querySelectorAll(
                ".minus-btn"
            );


        minusButtons.forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const productId =
                        button.dataset.id;


                    const product =
                        cart.find(
                            function(product) {

                                return String(product.id) ===
                                       String(productId);

                            }
                        );


                    if (
                        product &&
                        product.quantity > 1
                    ) {

                        product.quantity--;


                        localStorage.setItem(
                            "cart",
                            JSON.stringify(cart)
                        );


                        displayCart();

                    }

                }
            );

        });


        // =========================
        // PLUS BUTTONS
        // =========================

        const plusButtons =
            document.querySelectorAll(
                ".plus-btn"
            );


        plusButtons.forEach(function(button) {

            button.addEventListener(
                "click",
                function() {

                    const productId =
                        button.dataset.id;


                    const product =
                        cart.find(
                            function(product) {

                                return String(product.id) ===
                                       String(productId);

                            }
                        );


                    if (product) {

                        product.quantity++;


                        localStorage.setItem(
                            "cart",
                            JSON.stringify(cart)
                        );


                        displayCart();

                    }

                }
            );

        });


        // =========================
        // UPDATE SUMMARY
        // =========================

        updateCartSummary();

    }


    // =========================
    // CHECKOUT BUTTON
    // =========================

    if (checkoutButton) {

        checkoutButton.addEventListener(
            "click",
            function() {

                if (cart.length === 0) {
                    return;
                }


                alert(
                    "Checkout will be available soon!"
                );

            }
        );

    }


    // =========================
    // INITIAL DISPLAY
    // =========================

    displayCart();

}
// =========================
// SHOP PRODUCT CLICK
// =========================

const shopProductCards = document.querySelectorAll(".shop-product-card");

shopProductCards.forEach(function(card) {

    card.addEventListener("click", function(event) {

        // Wishlist button click par product page open nahi hoga
        if (event.target.closest(".wishlist-btn")) {
            return;
        }

        const productId = card.dataset.id;

        window.location.href = `product.html?id=${productId}`;

    });

});
let selectedCategory = "all products";
let searchValue = "";


// =========================
// CATEGORY FROM URL
// =========================

const urlParams =
    new URLSearchParams(window.location.search);

const urlCategory =
    urlParams.get("category");

if (urlCategory) {

    selectedCategory =
        urlCategory
            .toLowerCase()
            .trim();

    filterProducts();

}

// =========================
// FILTER PRODUCTS
// =========================

function filterProducts() {

    const shopCards = document.querySelectorAll(".shop-product-card");

    shopCards.forEach(function (card) {

        const productName = card
            .querySelector(".shop-product-info h3")
            .textContent
            .toLowerCase()
            .trim();

        const productCategory = card.dataset.category
            ? card.dataset.category.toLowerCase().trim()
            : "";

        // Search match
        const matchesSearch =
            productName.includes(searchValue);


        // Category match
        let matchesCategory = false;

        if (selectedCategory === "all products") {

            matchesCategory = true;

        } else if (selectedCategory === "new arrivals") {

            const badge = card.querySelector(".product-badge");

            matchesCategory = badge !== null;

        } else {

            matchesCategory =
                productCategory === selectedCategory;

        }


        // Final result
        if (matchesSearch && matchesCategory) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}


// =========================
// CATEGORY
// =========================

const categoryLinks = document.querySelectorAll(".category-link");

categoryLinks.forEach(function (link) {

    link.addEventListener("click", function (event) {

        event.preventDefault();

        // Active category
        categoryLinks.forEach(function (item) {
            item.classList.remove("active");
        });

        link.classList.add("active");


        // Selected category
        selectedCategory = link.textContent
            .trim()
            .split("(")[0]
            .trim()
            .toLowerCase();


        // Apply filter
        filterProducts();

    });

});


// =========================
// NAVBAR SEARCH
// =========================

const searchButton = document.querySelector(
    '.nav-icons button[aria-label="Search"]'
);

if (searchButton) {

    searchButton.addEventListener("click", function () {

        if (document.querySelector(".search-box")) {
            return;
        }


        // Create search box
        const searchBox = document.createElement("div");

        searchBox.className = "search-box";

        searchBox.innerHTML = `
            <input
                type="text"
                id="productSearch"
                placeholder="Search products..."
                autocomplete="off"
            >

            <button id="closeSearch">
                ×
            </button>
        `;

        document.body.appendChild(searchBox);


        const searchInput =
            document.querySelector("#productSearch");

        const closeSearch =
            document.querySelector("#closeSearch");


        searchInput.focus();


        // =========================
        // SEARCH INPUT
        // =========================

        searchInput.addEventListener("input", function () {

            searchValue = searchInput.value
                .toLowerCase()
                .trim();

            filterProducts();

        });


        // =========================
        // CLOSE SEARCH
        // =========================

        closeSearch.addEventListener("click", function () {

            searchBox.remove();

            searchValue = "";

            filterProducts();

        });

    });

}
// =========================
// PRICE SORTING
// =========================

const sortSelect = document.querySelector(".sort-select");
const productGrid = document.querySelector(".shop-product-grid");

if (sortSelect && productGrid) {

    sortSelect.addEventListener("change", function () {

        const products = Array.from(
            productGrid.querySelectorAll(".shop-product-card")
        );

        if (sortSelect.value === "price-low") {

            products.sort(function (a, b) {

                const priceA = parseInt(
                    a.querySelector(".shop-product-info p")
                    .textContent
                    .replace(/[^0-9]/g, "")
                );

                const priceB = parseInt(
                    b.querySelector(".shop-product-info p")
                    .textContent
                    .replace(/[^0-9]/g, "")
                );

                return priceA - priceB;
            });

        }

        else if (sortSelect.value === "price-high") {

            products.sort(function (a, b) {

                const priceA = parseInt(
                    a.querySelector(".shop-product-info p")
                    .textContent
                    .replace(/[^0-9]/g, "")
                );

                const priceB = parseInt(
                    b.querySelector(".shop-product-info p")
                    .textContent
                    .replace(/[^0-9]/g, "")
                );

                return priceB - priceA;
            });

        }

        products.forEach(function (product) {
            productGrid.appendChild(product);
        });

    });
}
// =========================
// PRODUCT PAGE
// =========================

const productData = {

    "running-shoes": {
        price: "Rs. 3,000",
        image: "nike4.jpg",
        category: "Men",
        description:
            "Experience ultimate comfort and style with our premium running shoes. Designed for performance and everyday wear.",
        sizes: ["40", "41", "42", "43", "44", "45"],
        colors: ["Black & White", "Gray", "Beige"],
        reviews: 32
    },


    "classic-tshirt": {
        price: "Rs. 2,500",
        image: "t.jpg",
        category: "T-Shirts",
        description:
            "A classic everyday t-shirt designed with soft fabric and a comfortable fit for effortless everyday style.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White", "Gray"],
        reviews: 24
    },


    "best-hoodie": {
        price: "Rs. 5,000",
        image: "hd.jpg",
        category: "Hoodies",
        description:
            "Stay comfortable and stylish with our premium hoodie. Perfect for casual everyday wear and cooler days.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "Gray", "Beige"],
        reviews: 28
    },


    "nike-cap": {
        price: "Rs. 2,000",
        image: "cap.jpg",
        category: "Accessories",
        description:
            "Complete your casual look with this stylish and comfortable cap, designed for everyday wear.",
        sizes: ["One Size"],
        colors: ["Black", "White", "Beige"],
        reviews: 18
    },


    "seilin-sneakers": {
        price: "Rs. 3,500",
        image: "ad.jpg",
        category: "Shoes",
        description:
            "Modern sneakers combining everyday comfort with a clean and stylish design.",
        sizes: ["40", "41", "42", "43", "44", "45"],
        colors: ["White", "Black", "Gray"],
        reviews: 21
    },


    "comfort-trouser": {
        price: "Rs. 1,500",
        image: "t.webp",
        category: "Men",
        description:
            "Comfortable everyday trousers with a versatile design that works perfectly for casual outfits.",
        sizes: ["30", "32", "34", "36", "38"],
        colors: ["Black", "Gray", "Beige"],
        reviews: 16
    },


    "oversized-shirt": {
        price: "Rs. 4,000",
        image: "s.jpg",
        category: "T-Shirts",
        description:
            "A relaxed oversized shirt with a modern silhouette, perfect for creating effortless casual outfits.",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Black", "White", "Gray"],
        reviews: 26
    },


    "nike-bag": {
        price: "Rs. 4,000",
        image: "bag (2).jpg",
        category: "Accessories",
        description:
            "A practical and stylish everyday bag designed to carry your essentials with ease.",
        sizes: ["One Size"],
        colors: ["Black", "Gray", "Beige"],
        reviews: 20
    }

};


// =========================
// GET PRODUCT ID
// =========================

const productPage =
    document.querySelector(".product-page");


if (productPage) {

    const urlParams =
        new URLSearchParams(window.location.search);

    const productId =
        urlParams.get("id");


    const product =
        productData[productId];


    // =========================
    // PRODUCT NOT FOUND
    // =========================

    if (!product) {

        console.log("Product not found");

    } else {


        // =========================
        // BASIC PRODUCT INFO
        // =========================

        const productTitle =
            document.querySelector(".product-title");

        const productPrice =
            document.querySelector(".product-price");

        const productDescription =
            document.querySelector(".product-description");

        const mainProductImage =
            document.querySelector("#main-product-image");


        if (productTitle) {
            productTitle.textContent =
                product.name;
        }


        if (productPrice) {
            productPrice.textContent =
                product.price;
        }


        if (productDescription) {
            productDescription.textContent =
                product.description;
        }


        if (mainProductImage) {
            mainProductImage.src =
                product.image;

            mainProductImage.alt =
                product.name;
        }


        // =========================
        // BREADCRUMB
        // =========================

        const breadcrumbSpans =
            document.querySelectorAll(
                ".product-breadcrumb span"
            );


        if (breadcrumbSpans.length >= 4) {

            breadcrumbSpans[2].textContent =
                product.category;

            breadcrumbSpans[3].textContent =
                product.name;

        }


        // =========================
        // SIZE OPTIONS
        // =========================

        const sizeOptions =
            document.querySelector(".size-options");

        const selectedSize =
            document.querySelector(".selected-size");


        if (sizeOptions) {

            sizeOptions.innerHTML = "";


            product.sizes.forEach(function(size, index) {

                const button =
                    document.createElement("button");

                button.classList.add("size-btn");

                button.textContent =
                    size;


                if (index === 0) {
                    button.classList.add("active");

                    if (selectedSize) {
                        selectedSize.textContent =
                            size;
                    }
                }


                sizeOptions.appendChild(button);

            });

        }


        // =========================
        // SIZE CLICK
        // =========================

        const sizeButtons =
            document.querySelectorAll(".size-btn");


        sizeButtons.forEach(function(button) {

            button.addEventListener("click", function() {

                sizeButtons.forEach(function(item) {

                    item.classList.remove("active");

                });


                button.classList.add("active");


                if (selectedSize) {

                    selectedSize.textContent =
                        button.textContent.trim();

                }

            });

        });


        // =========================
        // COLOR OPTIONS
        // =========================

        const colorOptions =
            document.querySelector(".color-options");


        if (colorOptions) {

            colorOptions.innerHTML = "";


            product.colors.forEach(function(color, index) {

                const button =
                    document.createElement("button");


                button.classList.add(
                    "color-btn"
                );


                button.dataset.color =
                    color;


                // Color classes

                if (color === "Gray") {
                    button.classList.add("gray");
                }

                if (color === "Beige") {
                    button.classList.add("beige");
                }


                if (index === 0) {
                    button.classList.add("active");
                }


                colorOptions.appendChild(button);

            });

        }


        // =========================
        // COLOR CLICK
        // =========================

        const colorButtons =
            document.querySelectorAll(".color-btn");


        colorButtons.forEach(function(button) {

            button.addEventListener("click", function() {

                colorButtons.forEach(function(item) {

                    item.classList.remove("active");

                });


                button.classList.add("active");

            });

        });


        // =========================
        // QUANTITY
        // =========================

        const quantityMinus =
            document.querySelector(".quantity-minus");

        const quantityPlus =
            document.querySelector(".quantity-plus");

        const quantityNumber =
            document.querySelector(".quantity-number");


        let quantity = 1;


        if (
            quantityMinus &&
            quantityPlus &&
            quantityNumber
        ) {


            quantityMinus.addEventListener(
                "click",
                function() {

                    if (quantity > 1) {

                        quantity--;

                        quantityNumber.textContent =
                            quantity;

                    }

                }
            );


            quantityPlus.addEventListener(
                "click",
                function() {

                    quantity++;

                    quantityNumber.textContent =
                        quantity;

                }
            );

        }


        // =========================
        // ADD TO CART
        // =========================

        const productAddCart =
            document.querySelector(
                ".product-add-cart"
            );


        if (productAddCart) {

            productAddCart.addEventListener(
                "click",
                function() {


                    const activeSize =
                        document.querySelector(
                            ".size-btn.active"
                        );


                    const activeColor =
                        document.querySelector(
                            ".color-btn.active"
                        );


                    const quantityElement =
                        document.querySelector(
                            ".quantity-number"
                        );


                    const selectedProduct = {

                        id: productId,

                        name: product.name,

                        price: product.price,

                        image: product.image,

                        size: activeSize
                            ? activeSize.textContent.trim()
                            : product.sizes[0],

                        color: activeColor
                            ? activeColor.dataset.color
                            : product.colors[0],

                        quantity: quantityElement
                            ? Number(
                                quantityElement.textContent
                            )
                            : 1

                    };


                    let currentCart =
                        JSON.parse(
                            localStorage.getItem("cart")
                        ) || [];


                    // =========================
                    // ADD PRODUCT TO CART
                    // =========================

                    currentCart.push(
                        selectedProduct
                    );


                    localStorage.setItem(
                        "cart",
                        JSON.stringify(currentCart)
                    );


                    // =========================
                    // UPDATE CART COUNT
                    // =========================

                    const productCartCount =
                        document.querySelector(
                            ".cart-count"
                        );


                    if (productCartCount) {

                        productCartCount.textContent =
                            currentCart.length;

                    }


                    // =========================
                    // BUTTON FEEDBACK
                    // =========================

                    productAddCart.textContent =
                        "ADDED TO CART";


                    setTimeout(function() {

                        productAddCart.textContent =
                            "ADD TO CART";

                    }, 1500);

                }
            );

        }

    }

}
// =========================
// NAVBAR CATEGORIES DROPDOWN
// =========================

const categoriesButton = document.querySelector(
    '.nav-links a[href="#"]'
);

if (categoriesButton) {

    const categoriesWrapper =
        document.createElement("div");

    categoriesWrapper.classList.add(
        "categories-wrapper"
    );

    categoriesButton.parentNode.insertBefore(
        categoriesWrapper,
        categoriesButton
    );

    categoriesWrapper.appendChild(
        categoriesButton
    );

    const dropdown =
        document.createElement("div");

    dropdown.classList.add(
        "categories-dropdown"
    );

    dropdown.innerHTML = `
        <a href="shop.html">All Products</a>
        <a href="shop.html?category=men">Men</a>
        <a href="shop.html?category=t-shirts">T-Shirts</a>
        <a href="shop.html?category=hoodies">Hoodies</a>
        <a href="shop.html?category=shoes">Shoes</a>
        <a href="shop.html?category=accessories">Accessories</a>
    `;

    categoriesWrapper.appendChild(dropdown);

    categoriesButton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            dropdown.classList.toggle("show");

        }
    );

    document.addEventListener(
        "click",
        function(event) {

            if (
                !categoriesWrapper.contains(
                    event.target
                )
            ) {
                dropdown.classList.remove("show");
            }

        }
    );

}
// =========================
// NAVBAR CATEGORY FILTER
// =========================

const navbarCategoryLinks =
    document.querySelectorAll(".categories-dropdown a");

navbarCategoryLinks.forEach(function(link) {

    link.addEventListener("click", function(event) {

        event.preventDefault();

        const category =
            link.textContent
                .trim()
                .toLowerCase();

        if (category === "all products") {

            window.location.href =
                "shop.html";

        } else {

            window.location.href =
                "shop.html?category=" +
                encodeURIComponent(category);

        }

    });

});
// =========================
// NEW ARRIVAL NAVBAR
// =========================

const navbarLinks = document.querySelectorAll(".nav-links a");

navbarLinks.forEach(function(link) {

    if (link.textContent.trim() === "New Arrival") {

        link.addEventListener("click", function(event) {
            event.preventDefault();

            window.location.href = "shop.html?category=new-arrivals";
        });

    }

});


