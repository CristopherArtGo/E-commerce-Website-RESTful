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

    let heading = document.querySelector("h4");
    heading.textContent = `Delete Product #${id}?`;
    container.appendChild(heading);

    document.querySelector("input#id").value = id;

    let prodName = document.createElement("p");
    prodName.textContent = `Name: ${name}`;
    container.appendChild(prodName);

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

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("div.message").innerHTML = "";
    let formData = new FormData(event.target);
    const formEntries = Object.fromEntries(formData.entries());

    (async () => {
        const rawResponse = await fetch(`/api/products/${product_id}`, {
            method: "DELETE",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formEntries),
        });
        const result = await rawResponse.json();

        if (result.success) {
            document.querySelector("div.message").innerHTML = `<div class='alert alert-success' role='alert'>${result.success}</div>`;
            return;
        }
        //show errors
        let errors = "";
        result.error.forEach((error) => {
            errors += `<p class="text-danger">${error}</p>`;
        });

        document.querySelector("div.message").innerHTML = `<div class='alert alert-danger' role='alert'>${errors}</div>`;
    })();
});

document.querySelector("button#cancel").addEventListener("click", (event) => {
    event.preventDefault();
    window.location.replace("/admin");
});
