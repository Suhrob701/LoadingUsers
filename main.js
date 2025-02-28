async function fetchUsers() {
    try {
        const res = await fetch("https://randomuser.me/api/?results=100");
        if (!res.ok) throw new Error("Ma'lumotni yuklab bo'lmadi!");
        const data = await res.json();
        return data.results;
    } catch (error) {
        console.error("Xatolik:", error.message);
        return [];
    }
}

const btn = document.getElementById("kechki");

btn.addEventListener("click", () => {
    if (document.body.classList.toggle("dark-mode")) {
        btn.textContent = '☀️'; 
    } else {
        btn.textContent = '🌙';
    }
});

function render(users) {
    const usersContainer = document.getElementById("users");
    usersContainer.innerHTML = "";
    users.forEach(user => {  
        const card = document.createElement("div");
        card.classList.add("user-card");
        card.innerHTML = `
            <img src="${user.picture.medium}" alt="${user.name.first}">
            <h3>${user.name.first} ${user.name.last}</h3>
            <p><strong>Yosh:</strong> ${user.dob.age}</p>  
            <p><strong>Telefon:</strong> ${user.phone}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Manzil:</strong> ${user.location.city}, ${user.location.country}</p>
        `;
        usersContainer.appendChild(card);
    });
}

function sortUsers(users, type, order = "asc") {
    return users.sort((a, b) => {
        let comparison;
        if (type === "name") {
            comparison = a.name.first.localeCompare(b.name.first);
        } else {
            comparison = a.name.last.localeCompare(b.name.last);
        }
        return order === "asc" ? comparison : -comparison;
    });
}

function search(users, query){
    query = query.toLowerCase();
    return users.filter(user =>
        user.name.first.toLowerCase().includes(query) ||
        user.name.last.toLowerCase().includes(query) ||
        user.phone.includes(query) ||
        user.email.toLowerCase().includes(query)
    );
}

let users = [];

document.addEventListener("DOMContentLoaded", async () => {
    const usersContainer = document.getElementById("users");
    const loader = document.getElementById("loader");
    const sortSelect = document.getElementById("sortOption");
    const searchInput = document.getElementById("search");

    showLoader();
    users = await fetchUsers();
    render(users);
    hideLoader();

    sortSelect.addEventListener("change", (e) => {
        showLoader();
        setTimeout(() => {
            users = sortUsers(users, e.target.value);
            render(users);
            hideLoader();
        }, 50);
    });

    searchInput.addEventListener("input", (e) => {
        showLoader();
        setTimeout(() => {
            const filteredUsers = search(users, e.target.value);
            render(filteredUsers);
            hideLoader();
        }, 500);
    });

    function showLoader(){
        loader.style.display = "block";
        usersContainer.style.opacity = "0.1";
    }

    function hideLoader(){
        loader.style.display = "none";
        usersContainer.style.opacity = "";
    }
});
