const backendUrl = "https://kitchen-log-backend.onrender.com";
// const backendUrl = "http://localhost:4000";


document.getElementById("login-btn").addEventListener("click", async () => {
        const form = document.getElementById("login-form");
        const formData = new FormData(form);

        const userData = {
            email: formData.get("email"), 
            password: formData.get("password"), 
        }

        try {
            const response = await fetch(`${backendUrl}/accounts/login`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify(userData), 
            });
            const data = await response.json();
            localStorage.setItem('jwt', data.token);
            window.location.href = '../index.html';
        } catch (error) {
            console.error(`Internal server error.`, error);
        }
    }
)