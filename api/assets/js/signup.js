document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("div.message").innerHTML = "";
    let formData = new FormData(event.target);
    const formEntries = Object.fromEntries(formData.entries());

    (async () => {
        const rawResponse = await fetch("/users", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formEntries),
        });
        const result = await rawResponse.json();

        if (result.success) {
            document.querySelector("div.message").innerHTML = `<div class='alert alert-success' role='alert'>${result.success}</div>`;
            document.querySelector("form").reset();
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
