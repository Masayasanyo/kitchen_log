const backendUrl = "http://localhost:4000";

async function checkSession() {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${backendUrl}/accounts/session`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.isLoggedIn === false) {
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error(`Internal server error.`, error);
    window.location.href = "login.html";
  }
}

checkSession();

document.getElementById("nav-cancel").addEventListener("click", () => {
  document.getElementById("sidebar").style.display = "none";
});

document.getElementById("open-nav").addEventListener("click", () => {
  document.getElementById("sidebar").style.display = "block";
});

document.getElementById("sidebar").style.display = "none";

const currentYear = new Date().getFullYear();
document.querySelector("#year").innerHTML = currentYear;
