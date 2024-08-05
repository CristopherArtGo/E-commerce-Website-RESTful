const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
});

(async () => {
    const rawResponse = await fetch("/api/products");
    const result = await rawResponse.json();
    let tableBody = document.querySelector("tbody");
    result.forEach((product) => {
        let { id, name, price, description, category_name } = product;
        name = name.charAt(0).toUpperCase() + name.slice(1);
        category_name = category_name.charAt(0).toUpperCase() + category_name.slice(1);
        let row = document.createElement("tr");
        row.innerHTML = `<td>${id}</td><td><a href="/products/${id}">${name}</a></td><td>${category_name}</td><td>${formatter.format(price)}</td><td>${description}</td><td><a href="/products/edit/${id}">Edit</a> <a href="/products/delete/${id}" class="text-danger">Delete</a></td>`;
        tableBody.appendChild(row);
    });
})();
