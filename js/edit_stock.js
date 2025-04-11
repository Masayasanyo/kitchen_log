const backendUrl = "https://kitchen-log-backend.onrender.com";
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

async function checkSession() {
    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${backendUrl}/accounts/session`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            }, 
        });
        const data = await response.json();
        if (data.isLoggedIn === false) {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error(`Internal server error.`, error);
        window.location.href = 'login.html';
    }
}

async function fetchStock() {
    try {
        const token = localStorage.getItem("jwt");
        const response = await fetch(`${backendUrl}/stock`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ stockId: id }),
        });
        const data = await response.json();

        const name = data.data[0].name;

        const quantity = data.data[0].quantity;

        const dateObj = new Date(data.data[0].expiration_date);
        const yyyy = dateObj.getFullYear();
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        const expiration = `${yyyy}-${mm}-${dd}`;

        document.getElementById("name").value = name;
        document.getElementById("quantity").value = quantity;
        document.getElementById("expiration").value = expiration;
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}

document.getElementById("apply-edit-stock").addEventListener("click", async () => {
    const form = document.getElementById("edit-stock-form");
    const formData = new FormData(form);

    const stockData = {
        stockId: id, 
        name: formData.get("name"), 
        quantity: formData.get("quantity"), 
        expiration: formData.get("expiration")
    }

    try {
        const token = localStorage.getItem('jwt');
        await fetch(`${backendUrl}/edit/stock`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            }, 
            body: JSON.stringify(stockData), 
        });
        window.location.href = 'stock.html';
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
});

document.getElementById("cansel-edit-stock").addEventListener("click", function() {
    window.location.href = `stock.html`;
});

document.getElementById("delete-stock").addEventListener("click", async () => {
    try {
        const token = localStorage.getItem('jwt');
        await fetch(`${backendUrl}/delete/stock`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            }, 
            body: JSON.stringify({ stockId: id }), 
        });
        window.location.href = `stock.html`;
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
});

document.getElementById("nav-cancel").addEventListener("click", () => {
    document.getElementById("sidebar").style.display = 'none';
});

document.getElementById("open-nav").addEventListener("click", () => {
    document.getElementById("sidebar").style.display = 'block';
});

document.getElementById("sidebar").style.display = 'none';

const currentYear = new Date().getFullYear();
document.querySelector("#year").innerHTML = currentYear;

checkSession();

fetchStock();