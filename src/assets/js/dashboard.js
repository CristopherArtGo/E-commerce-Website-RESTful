const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

(async () => {
    const rawResponse = await fetch("/products");
    const result = await rawResponse.json();
    console.log(result);
    let container = document.querySelector("div.products");
    result.forEach((product) => {
        let { id, name, price } = product;
        name = name.charAt(0).toUpperCase() + name.slice(1);
        let element = document.createElement("div");
        element.innerHTML = `<p><a href='/products/${id}'>${name}</a> - ${formatter.format(price)}</p>`;
        container.appendChild(element);
    });
})();
