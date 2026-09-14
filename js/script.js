const products = [{
        id: "house-blend",
        name: "House Blend",
        price: 14,
        type: "coffee"
    },

    {
        id: "ethiopia",
        name: "Ethiopia Yirgacheffe",
        price: 17,
        type: "coffee"
    },

    {
        id: "colombia",
        name: "Colombia Honey",
        price: 16,
        type: "coffee"
    },

    {
        id: "midnight",
        name: "Midnight Espresso",
        price: 15,
        type: "coffee"
    },

    {
        id: "decaf",
        name: "Evening Decaf",
        price: 15,
        type: "coffee"
    },

    {
        id: "maple",
        name: "Maple Spice",
        price: 18,
        type: "coffee"
    },

    {
        id: "french-press",
        name: "Classic French Press",
        price: 28,
        type: "equipment"
    },

    {
        id: "pour-over",
        name: "Pour-Over Brewer",
        price: 24,
        type: "equipment"
    },

    {
        id: "espresso-machine",
        name: "Home Espresso Machine",
        price: 189,
        type: "equipment"
    },

    {
        id: "bean-basic",
        name: "Bean Basic Subscription",
        price: 12,
        type: "subscription"
    },

    {
        id: "origin-explorer",
        name: "Origin Explorer Subscription",
        price: 20,
        type: "subscription"
    },

    {
        id: "coffee-club-plus",
        name: "Coffee Club Plus Subscription",
        price: 29,
        type: "subscription"
    }
];




function getCart() {
    return JSON.parse(
        localStorage.getItem("beanCart") || "[]"
    );
}


function saveCart(cart) {
    localStorage.setItem(
        "beanCart",
        JSON.stringify(cart)
    );

    updateCartCount();
}


function updateCartCount() {
    let count = getCart().reduce(
        (total, item) => total + item.qty,
        0
    );

    document
        .querySelectorAll(".cart-count")
        .forEach(item => {
            item.textContent = count;
        });
}


function toast(message) {
    let element = document.querySelector(".toast");

    if (!element) {
        element = document.createElement("div");
        element.className = "toast";
        document.body.appendChild(element);
    }

    element.textContent = message;
    element.classList.add("show");

    setTimeout(() => {
        element.classList.remove("show");
    }, 2200);
}


function addToCart(id) {
    let product = products.find(
        item => item.id === id
    );

    if (!product) {
        return;
    }

    let cart = getCart();

    let existingItem = cart.find(
        item => item.id === id
    );

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({
            ...product,
            qty: 1
        });
    }

    saveCart(cart);

    toast(
        product.name + " added to your basket"
    );
}




function getWishlist() {
    return JSON.parse(
        localStorage.getItem("beanWishlist") || "[]"
    );
}


function saveWishlist(wishlist) {
    localStorage.setItem(
        "beanWishlist",
        JSON.stringify(wishlist)
    );

    renderWishlist();
    updateWishlistButtons();
}


function toggleWishlist(id) {

    const product = products.find(
        item => item.id === id
    );

    if (!product) {
        console.log("Product not found:", id);
        return;
    }

    let wishlist = getWishlist();

    const exists = wishlist.some(
        item => item.id === id
    );

    if (exists) {

        wishlist = wishlist.filter(
            item => item.id !== id
        );

        toast(
            product.name + " removed from wishlist"
        );

    } else {

        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            type: product.type
        });

        toast(
            product.name + " added to wishlist"
        );
    }

    saveWishlist(wishlist);
}


function removeFromWishlist(id) {

    let wishlist = getWishlist();

    wishlist = wishlist.filter(
        item => item.id !== id
    );

    saveWishlist(wishlist);

    toast("Removed from wishlist");
}


function clearWishlist() {

    saveWishlist([]);

    toast("Wishlist cleared");
}


function updateWishlistButtons() {

    const wishlist = getWishlist();

    document
        .querySelectorAll(".wishlist-btn")
        .forEach(button => {

            const id = button.dataset.id;

            const saved = wishlist.some(
                item => item.id === id
            );

            if (saved) {

                button.textContent =
                    "♥ Added to Wishlist";

                button.classList.add("added");

            } else {

                button.textContent =
                    "♡ Add to Wishlist";

                button.classList.remove("added");
            }

        });
}


function renderWishlist() {

    const container =
        document.querySelector("#wishlist-items");

    if (!container) {
        return;
    }

    const wishlist = getWishlist();

    if (wishlist.length === 0) {

        container.innerHTML = `
            <p class="wishlist-empty">
                Your wishlist is empty. Add a coffee you love!
            </p>
        `;

        return;
    }

    container.innerHTML = wishlist
        .map(item => `
            <div class="wishlist-item">

                <div>
                    <h3>${item.name}</h3>
                    <p>$${item.price}</p>
                </div>

                <button
                    type="button"
                    class="remove-wishlist"
                    onclick="removeFromWishlist('${item.id}')">
                    Remove
                </button>

            </div>
        `)
        .join("");
}


function changeQty(id, difference) {

    let cart = getCart();

    let item = cart.find(
        product => product.id === id
    );

    if (!item) {
        return;
    }

    item.qty += difference;

    if (item.qty < 1) {

        cart = cart.filter(
            product => product.id !== id
        );
    }

    saveCart(cart);
    renderCart();
}


function clearCart() {

    saveCart([]);
    renderCart();

    toast("Basket cleared");
}


function renderCart() {

    let list =
        document.querySelector("#cart-list");

    let total =
        document.querySelector("#cart-total");

    if (!list) {
        return;
    }

    let cart = getCart();

    if (!cart.length) {

        list.innerHTML = `
            <div class="notice">
                <strong>Your basket is empty.</strong>
                <br>
                Browse Coffee or Equipment to add products.
            </div>
        `;

        if (total) {
            total.textContent = "$0.00";
        }

        return;
    }

    let sum = 0;

    list.innerHTML = cart
        .map(item => {

            sum += item.price * item.qty;

            return `
                <div class="cart-item">

                    <div>
                        <h3>${item.name}</h3>

                        <p>
                            ${
                                item.type === "equipment"
                                    ? "Equipment"
                                    : item.type === "subscription"
                                    ? "Subscription"
                                    : "Coffee"
                            }
                        </p>
                    </div>

                    <div class="qty">

                        <button
                            type="button"
                            onclick="changeQty('${item.id}', -1)">
                            −
                        </button>

                        <strong>
                            ${item.qty}
                        </strong>

                        <button
                            type="button"
                            onclick="changeQty('${item.id}', 1)">
                            +
                        </button>

                    </div>

                    <strong>
                        $${(item.price * item.qty).toFixed(2)}
                    </strong>

                </div>
            `;
        })
        .join("");

    if (total) {
        total.textContent =
            "$" + sum.toFixed(2);
    }
}

function setup() {


    const navToggle =
        document.querySelector(".nav-toggle");

    const nav =
        document.querySelector(".nav");

    if (navToggle && nav) {

        navToggle.addEventListener(
            "click",
            function () {

                nav.classList.toggle("open");

                const isOpen =
                    nav.classList.contains("open");

                navToggle.setAttribute(
                    "aria-label",
                    isOpen ?
                    "Close navigation" :
                    "Open navigation"
                );

            }
        );

    }


    updateCartCount();

    renderCart();


    const search =
        document.querySelector("#coffee-search");

    if (search) {

        search.addEventListener(
            "input",
            function () {

                const term =
                    search.value
                    .toLowerCase()
                    .trim();

                const items =
                    document.querySelectorAll(
                        ".searchable-item"
                    );

                items.forEach(
                    function (item) {

                        const searchText =
                            item
                            .getAttribute(
                                "data-search"
                            )
                            .toLowerCase();

                        if (
                            searchText.includes(term)
                        ) {

                            item.style.display = "";

                        } else {

                            item.style.display = "none";

                        }

                    }
                );

            }
        );

    }


    const eventForm =
        document.querySelector("#event-form");

    if (eventForm) {

        eventForm.addEventListener(
            "submit",
            event => {

                

                if (!eventForm.checkValidity()) {

                    eventForm.reportValidity();

                    return;
                }

                const message =
                    document.querySelector(
                        "#event-message"
                    );

                message.hidden = false;

                message.textContent =
                    "Registration received!";

                eventForm.reset();

            }
        );

    }


   const checkout =
    document.querySelector("#checkout-form");

if (checkout) {

    checkout.addEventListener(
        "submit",
        event => {

            event.preventDefault();

            if (!getCart().length) {

                toast("Thank You!");
                return;
            }

            if (!checkout.checkValidity()) {

                checkout.reportValidity();
                return;
            }

            const message =
                document.querySelector("#checkout-message");


            localStorage.removeItem("beanCart");


            checkout.reset();


            updateCartCount();


            renderCart();


            message.hidden = false;

            message.textContent =
                "Order completed.";

        }
    );

}


    document
        .querySelectorAll(
            "[data-close-welcome]"
        )
        .forEach(element => {

            element.addEventListener(
                "click",
                () => {

                    document
                        .querySelector("#welcome") 
                        ?.classList.remove(
                            "visible"
                        );

                    localStorage.setItem(
                        "beanWelcomeSeen",
                        "1"
                    );

                }
            );

        });


    if (
        !localStorage.getItem(
            "beanWelcomeSeen"
        ) &&
        document.querySelector("#welcome")
    ) {

        setTimeout(
            () => {

                document
                    .querySelector("#welcome")
                    .classList.add(
                        "visible"
                    );

            },
            900
        );

    }


    renderWishlist();

    updateWishlistButtons();


    const popularTrack =
        document.querySelector(
            ".popular-track"
        );

    const popularSlides =
        document.querySelectorAll(
            ".popular-slide"
        );

    const popularPrev =
        document.querySelector(
            ".slider-prev"
        );

    const popularNext =
        document.querySelector(
            ".slider-next"
        );

    let popularSlideIndex = 0;


    if (
        popularTrack &&
        popularSlides.length > 0 &&
        popularPrev &&
        popularNext
    ) {

        function showPopularSlide(index) {

            if (index < 0) {

                popularSlideIndex =
                    popularSlides.length - 1;

            } else if (
                index >= popularSlides.length
            ) {

                popularSlideIndex = 0;

            } else {

                popularSlideIndex = index;

            }

            popularTrack.scrollTo({

                left: popularSlideIndex *
                    popularTrack.clientWidth,

                behavior: "smooth"

            });

        }


        popularNext.addEventListener(
            "click",
            function () {

                showPopularSlide(
                    popularSlideIndex + 1
                );

            }
        );


        popularPrev.addEventListener(
            "click",
            function () {

                showPopularSlide(
                    popularSlideIndex - 1
                );

            }
        );

    }

}



document.addEventListener(
    "DOMContentLoaded",
    setup
);

