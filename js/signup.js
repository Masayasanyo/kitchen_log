const backenUrl = 'http://localhost:4000';

async function login(userData) {
    try {
        const response = await fetch(`${backenUrl}/accounts/login`, {
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

document.getElementById("signup-btn").addEventListener("click", async () => {
        const form = document.getElementById("signup-form");
        const formData = new FormData(form);
        
        let password = '';
        if (formData.get("password") !== formData.get("confirmed-password")) {
            return;
        } else {
            password = formData.get("password");
        }

        const userData = {
            username: formData.get("username"), 
            email: formData.get("email"), 
            password: password, 
        }

        try {
            await fetch(`${backenUrl}/accounts/signup`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                }, 
                body: JSON.stringify(userData), 
            });
            await login(userData);
        } catch (error) {
            console.error(`Internal server error.`, error);
        }
    }
)