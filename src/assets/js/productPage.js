const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

const url = window.location.href;
const index = url.lastIndexOf("/");
const product_id = url.slice(index + 1);

(async () => {
    const rawResponse = await fetch(`/api/products/${product_id}`);
    const result = await rawResponse.json();
    let { id, name, description, price, category_name } = result;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    category_name = category_name.charAt(0).toUpperCase() + category_name.slice(1);
    let container = document.querySelector("div.product");

    let heading = document.createElement("h4");
    heading.textContent = `Product #${id}: ${name}`;
    container.appendChild(heading);

    let prodPrice = document.createElement("p");
    prodPrice.textContent = `Price: ${formatter.format(price)}`;
    container.appendChild(prodPrice);

    let prodCategory = document.createElement("p");
    prodCategory.textContent = `Category: ${category_name}`;
    container.appendChild(prodCategory);

    let prodDesc = document.createElement("p");
    prodDesc.textContent = `Description: ${description}`;
    container.appendChild(prodDesc);
})();
