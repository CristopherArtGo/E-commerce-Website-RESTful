
const url = window.location.href
const index = url.lastIndexOf("/");
const product_id = url.slice(index + 1);

(async () => {
    const rawResponse = await fetch("/api/categories");
    const result = await rawResponse.json();
    let select = document.querySelector("select");

    result.forEach((category) => {
        let { id, category_name } = category;
        category_name = category_name.charAt(0).toUpperCase() + category_name.slice(1);
        let element = document.createElement("option");
        element.setAttribute("value", id);
        element.textContent = category_name;
        select.appendChild(element);
    });
})();

(async () => {
    const rawResponse = await fetch(`/api/products/${product_id}`);
    const result = await rawResponse.json();
    let { id, name, description, price, category_name } = result[0];

    document.querySelector("h4").textContent = document.querySelector("h4").textContent + id;

    name = name.charAt(0).toUpperCase() + name.slice(1);
    document.querySelector("input#name").value = name;

    category_name = category_name.charAt(0).toUpperCase() + category_name.slice(1);
    let options = document.querySelectorAll("option");
    for (let i = 0; i < options.length; i++) {
        if (options[i].textContent == category_name) {
            options[i].setAttribute("selected", true);
            break;
        }
    }

    document.querySelector("input#id").value = id;
    document.querySelector("input#price").value = price;
    document.querySelector("textarea").value = description;
})();

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("div.message").innerHTML = "";
    let formData = new FormData(event.target);
    const formEntries = Object.fromEntries(formData.entries());

    (async () => {
        const rawResponse = await fetch(`/api/products/${product_id}`, {
            method: "PUT",
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
