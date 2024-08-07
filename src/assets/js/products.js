const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

(async () => {
    const rawResponse = await fetch("/api/products");
    const result = await rawResponse.json();
    let container = document.querySelector("div.products");
    result.forEach((product) => {
        let { id, name, price } = product;
        name = name.charAt(0).toUpperCase() + name.slice(1);
        let element = document.createElement("div");
        element.innerHTML = `<p><a href='/products/${id}'>${name}</a> - ${formatter.format(price)}</p>`;
        container.appendChild(element);
    });
})();

document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
});

document.querySelector("input").addEventListener("keyup", (event) => {
    const searchParam = event.target.value;

    (async () => {
        const rawResponse = await fetch(`/api/products/search/${searchParam}`);
        const result = await rawResponse.json();

        let container = document.querySelector("div.products");
        container.innerHTML = "";
        result.forEach((product) => {
            let { id, name, price } = product;
            name = name.charAt(0).toUpperCase() + name.slice(1);
            let element = document.createElement("div");
            element.innerHTML = `<p><a href='/products/${id}'>${name}</a> - ${formatter.format(price)}</p>`;
            container.appendChild(element);
        });
    })();
});
