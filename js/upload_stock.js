const backendUrl = "https://kitchen-log-backend.onrender.com";
// const backendUrl = "http://localhost:4000";

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

document.getElementById("apply-stock").addEventListener("click", async () => {
    const form = document.getElementById("upload-stock-form");
    const formData = new FormData(form);

    const stockData = {
        name: formData.get("name"), 
        amount: formData.get("amount"), 
        expiration: formData.get("expiration")
    }

    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${backendUrl}/upload/stock`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            }, 
            body: JSON.stringify(stockData), 
        });
        const data = await response.json();
        window.location.href = 'stock.html';
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
