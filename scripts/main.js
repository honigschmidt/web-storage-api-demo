function main() {

    init();

    function init() {
        if (localStorage.getItem("cart") == null) {
            localStorage.setItem("cart", "[]");
        }
        showProducts();
        showCart();
    }

    async function showProducts() {
        const productRoot = document.querySelector("#store_container");
        const productList = await downloadProductList();
        var uid = 0;
        if (typeof productList == "undefined") {
            const errorMessage = document.createTextNode("Product list not found.");
            const messageNode = document.createElement("div");
            messageNode.appendChild(errorMessage);
            productRoot.appendChild(messageNode);
        } else {
            productList.forEach((product) => {
                let productNode = document.createElement("div");
                productNode.className = "productnode";
                productNode.id = `card_${uid}`;
                for (let [key, value] of Object.entries(product)) {
                    let attributeNode = document.createElement("div");
                    attributeNode.appendChild(document.createTextNode(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`));
                    productNode.appendChild(attributeNode);
                }
                let buttonNode = document.createElement("div");
                let addButton = document.createElement("button");
                addButton.className = "addbutton";
                addButton.textContent = "Add to cart";
                addButton.id = `addbtn_${uid}`
                addButton.addEventListener("click", (evt) => {
                    let buttonID = evt.target.id;
                    let productID = Number(buttonID.replace("addbtn_", ""));
                    addProduct(productID);
                })
                buttonNode.appendChild(addButton);
                productNode.appendChild(buttonNode);
                productRoot.appendChild(productNode);
                uid++;
            });
        }
    }

    async function showCart() {
        const cartRoot = document.querySelector("#cart_container");
        while (cartRoot.firstChild) {
            cartRoot.removeChild(cartRoot.firstChild);
        }
        const productList = await downloadProductList();
        const cart = [];
        if (JSON.parse(localStorage.getItem("cart")) == "") {
            const emptyMessage = document.createTextNode("Cart is empty.");
            cartRoot.appendChild(emptyMessage);
        } else {
            let uid = 0;
            cart.push(JSON.parse(localStorage.getItem("cart")));
            cart[0].forEach((cartItem) => {
                let cartItemNode = document.createElement("div");
                cartItemNode.className = "productnode";
                productList.forEach((product) => {
                    if (product.id == cartItem) {
                        let attributes = [cartItem, product.name];
                        attributes.forEach((attribute) => {
                            let attributeNode = document.createElement("div");
                            if (attribute == cartItem) {
                                var attributeText = "Id:";
                            } else {
                                attributeText = "Name:"
                            }
                            attributeNode.appendChild(document.createTextNode(`${attributeText} ${attribute}`));
                            cartItemNode.appendChild(attributeNode);
                        })
                    }
                });
                let buttonNode = document.createElement("div");
                let removeButton = document.createElement("button");
                removeButton.className = "removebutton";
                removeButton.textContent = "Delete from cart"
                removeButton.id = `delbtn_${uid}`;
                removeButton.addEventListener("click", (evt) => {
                    let buttonID = evt.target.id;
                    let cartItemID = Number(buttonID.replace("delbtn_", ""));
                    deleteProduct(cartItemID);
                })
                buttonNode.appendChild(removeButton);
                cartItemNode.appendChild(buttonNode);
                cartRoot.appendChild(cartItemNode);
                uid++;
        });
        }
    }

    function addProduct(productID) {
        const currentCart = [];
        currentCart.push(JSON.parse(localStorage.getItem("cart")));
        if (currentCart[0][0] == -1) {
            currentCart[0].pop();
        }
        currentCart[0].push(productID);
        const newCart = (JSON.stringify(currentCart)).slice(1, -1);
        localStorage.setItem("cart", newCart);
        showCart();
    }

    function deleteProduct(cartItemID) {
        const currentCart = [];
        currentCart.push(JSON.parse(localStorage.getItem("cart")));
        currentCart[0].splice(cartItemID, 1);
        const newCart = (JSON.stringify(currentCart)).slice(1, -1);
        localStorage.setItem("cart", newCart);
        showCart();
    }

    async function downloadProductList() {
        const url = "products.json";
        const response  = await fetch(url);
        if (response.ok) {
            const json = await response.json();
            return json.products;
        }
    }
}

window.addEventListener("DOMContentLoaded", main);