const backendUrl = "http://localhost:4000";
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));
let shoppingList = [];

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

async function doneTask(id) {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${backendUrl}/shopping_list/done`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify({ taskId: id }), 
    });
    const data = await response.json();
    window.location.href = 'shopping_list.html';
  } catch (error) {
    console.error(`Internal server error.`, error);
  }
}

async function fetchShoppingList() {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${backendUrl}/shopping_list`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    });
    const data = await response.json();
    const shoppingList = data.data;

    document.getElementById("shopping-list").innerHTML = shoppingList
      .map((s) => {
        return `<li class="item" onclick="doneTask(${s.id})" >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-app task-btn" viewBox="0 0 16 16">
                      <path d="M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4z"/>
                  </svg>
                  ${s.name}
                </li>
                `;
      })
      .join("");
  } catch (error) {
    console.error(`Internal server error.`, error);
  }
}

document.getElementById("add-task-input").addEventListener("keypress", async (e) => {
  if (e.key !== 'Enter') {
    return;
  }
  e.preventDefault();
  const task = document.getElementById("add-task-input").value; 
  if (!task) {
    return;
  }

  console.log(task)

  try {
    const token = localStorage.getItem('jwt');
    await fetch(`${backendUrl}/upload/task`, {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      }, 
      body: JSON.stringify({ task: task }), 
    });
    window.location.href = 'shopping_list.html';
  } catch (error) {
    console.error(`Internal server error.`, error);
  }
});

document.getElementById("nav-cancel").addEventListener("click", () => {
  document.getElementById("sidebar").style.display = "none";
});

document.getElementById("open-nav").addEventListener("click", () => {
  document.getElementById("sidebar").style.display = "block";
});

document.getElementById("sidebar").style.display = "none";

const currentYear = new Date().getFullYear();
document.querySelector("#year").innerHTML = currentYear;

checkSession();
fetchShoppingList();