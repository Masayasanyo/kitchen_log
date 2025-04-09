const backendUrl = "http://localhost:4000";
let recipesList = [];
let stockList = [];

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
    window.location.href = `recipe.html?${params.toString()}`;
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
                <img class="recipe-img" alt="recipe image" src="${backendUrl}${url}"> 
                <p>${title}</p>
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

const currentYear = new Date().getFullYear();
document.querySelector("#year").innerHTML = currentYear;
