(async () => {
    const rawResponse = await fetch(`/api/users/${id}`);
    const result = await rawResponse.json();
    console.log(result);
    let { first_name, last_name, email, is_admin, created_at } = result;
    first_name = first_name.charAt(0).toUpperCase() + first_name.slice(1);
    last_name = last_name.charAt(0).toUpperCase() + last_name.slice(1);

    let container = document.querySelector("div.profile");

    let fname = document.createElement("p");
    fname.textContent = `First Name: ${first_name}`;
    container.appendChild(fname);

    let lname = document.createElement("p");
    lname.textContent = `Last Name: ${last_name}`;
    container.appendChild(lname);

    let email_add = document.createElement("p");
    email_add.textContent = `Email: ${email}`;
    container.appendChild(email_add);

    let role = document.createElement("p");
    if (is_admin) {
        role.textContent = `Role: Admin`;
    } else {
        role.textContent = `Role: User`;
    }
    container.appendChild(role);

    const formatted_date = new Intl.DateTimeFormat("en-PH", {
        dateStyle: "full",
        timeStyle: "long",
        timeZone: "Asia/Manila",
    }).format(new Date(created_at));
    let creation_date = document.createElement("p");
    creation_date.textContent = `Account Created At: ${formatted_date}`;
    container.appendChild(creation_date);
})();
