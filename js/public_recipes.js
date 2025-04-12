const backendUrl = "https://kitchen-log-backend.onrender.com";
// const backendUrl = "http://localhost:4000";

let recipesList = [];

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
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error(`Internal server error.`, error);
    window.location.href = "login.html";
  }
}

async function fetchRecipes() {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${backendUrl}/recipes/public`, {
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

function seeRecipe(id) {
  const params = new URLSearchParams({ id, id });
  window.location.href = `public_recipe.html?${params.toString()}`;
}

document.getElementById("search").addEventListener("keypress", function(e) {
    
  if (e.key !== 'Enter') {
    return;
  }
  
  e.preventDefault();

  const keyword = document.getElementById("search").value.toLowerCase(); 
  if (!keyword) {
    fetchRecipes();
    return;
  }

  const filteredRecipes = recipesList.filter(recipe => 
    recipe.title.toLowerCase().includes(keyword)
  );

  setRecipes(filteredRecipes)
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

const currentYear = new Date().getFullYear();
document.querySelector("#year").innerHTML = currentYear;
