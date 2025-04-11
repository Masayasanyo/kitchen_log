const backendUrl = "https://kitchen-log-backend.onrender.com";

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

async function fetchAccount() {
    try {
        const token = localStorage.getItem("jwt");
        const response = await fetch(`${backendUrl}/accounts`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        const accountData = data.data;

        document.getElementById("username").value = accountData.username;
        document.getElementById("email").value = accountData.email;
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}

document.getElementById("apply-edit-account").addEventListener("click", async () => {
    const form = document.getElementById("edit-account-form");
    const formData = new FormData(form);

    const userData = {
        username: formData.get("username"), 
        email: formData.get("email"), 
        password: formData.get("password"), 
    }

    try {
        const token = localStorage.getItem("jwt");
        await fetch(`${backendUrl}/accounts/update`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData), 
        });
        localStorage.removeItem('jwt');
        window.location.href = '../index.html';
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
})

document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem('jwt');
    window.location.href = '../index.html';
});

async function logout() {
    localStorage.removeItem('jwt');
    window.location.href = 'index.html';
}

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
fetchAccount();