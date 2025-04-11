const backendUrl = "https://kitchen-log-backend.onrender.com";
let recipesList = [];
let stockList = [];
let shoppingList = [];

async function checkSession() {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${backendUrl}/accounts/session`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.isLoggedIn === false) {
      window.location.href = "pages/login.html";
    }
  } catch (error) {
    console.error(`Internal server error.`, error);
    window.location.href = "pages/login.html";
  }
}

function seeRecipe(id) {
    const params = new URLSearchParams({ id, id });
    window.location.href = `pages/recipe.html?${params.toString()}`;
}

function setStock(list) {
    document.getElementById("stock-list").innerHTML = list
      .map((s) => {  
        const expiration_date = s.expiration_date;
        const utcDate = new Date(expiration_date);
        const formattedDate = utcDate.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric'
        });
        return `<li class="stock">
                    <p>${formattedDate}</p>
                    <p class="stock-name">${s.name}</p> 
                </li>
              `;
      })
      .join("");
}

function setRecipes(list) {
  document.getElementById("recipe-list").innerHTML = list
    .map((recipe) => {
      const id = recipe.id;
      const url = recipe.image_url;
      const title = recipe.title;

      return `<li class="recipe" onclick="seeRecipe(${id})">
                <img class="recipe-img" alt="recipe image" src="${url}"> 
                <p>${title}</p>
                </li>
            `;
    })
    .join("");
}

function setShoppingList(list) {
  document.getElementById("shopping-list").innerHTML = list
    .map((l) => {
      const name = l.name;

      return `<li class="item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-app" viewBox="0 0 16 16">
                    <path d="M11 2a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zM5 1a4 4 0 0 0-4 4v6a4 4 0 0 0 4 4h6a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4z"/>
                  </svg>
                ${name}
              </li>
            `;
    })
    .join("");
}

async function fetchStock() {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`${backendUrl}/stock/expiration`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      stockList = data.data;
      setStock(stockList);
    } catch (error) {
      console.error(`Internal server error.`, error);
    }
}

async function fetchRecipes() {
    try {
      const token = localStorage.getItem("jwt");
      const response = await fetch(`${backendUrl}/recipes/latest`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      recipesList = data.data;
      setRecipes(recipesList);
    } catch (error) {
      console.error(`Internal server error.`, error);
    }
}

async function fetchShoppingList() {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${backendUrl}/shopping_list/topten`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    shoppingList = data.data;
    setShoppingList(shoppingList);
  } catch (error) {
    console.error(`Internal server error.`, error);
  }
}

document.getElementById("shopping-list").addEventListener("click", () => {
  window.location.href = "pages/shopping_list.html";
});

document.getElementById("nav-cancel").addEventListener("click", () => {
  document.getElementById("sidebar").style.display = "none";
});

document.getElementById("open-nav").addEventListener("click", () => {
  document.getElementById("sidebar").style.display = "block";
});

document.getElementById("sidebar").style.display = "none";

checkSession();
fetchRecipes();
fetchStock();
fetchShoppingList();

const currentYear = new Date().getFullYear();
document.querySelector("#year").innerHTML = currentYear;
