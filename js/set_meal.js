const backendUrl = "http://localhost:4000";
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

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

function seeRecipe(id) {
  const params = new URLSearchParams({ id, id });
  window.location.href = `recipe.html?${params.toString()}`;
}

async function fetchSetMeal() {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${backendUrl}/set_meals`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ setMealId: id }),
    });
    const data = await response.json();
    const setMealData = data.setMealData;
    const tagData = data.tag;
    const recipeData = data.recipe;

    document.getElementById("set-meal-title").innerHTML = setMealData.title;

    document.getElementById("tag-list").innerHTML = tagData
      .map((tag) => {
        return `<li class="tag">${tag.name}</li>`;
      })
      .join("");

    document.getElementById("recipe-list").innerHTML = recipeData
      .map((r) => {
        return `
                <li class="recipe" onclick="seeRecipe(${r.id})" >
                    <img class="recipe-img" alt="recipe image" src="${backendUrl}${r.image_url}">
                    <p>${r.title}</p>
                </li>
                `;
      })
      .join("");

    document.getElementById("edit-btn").addEventListener("click", function () {
      const params = new URLSearchParams({ id, id });
      window.location.href = `./edit_set_meal.html?${params.toString()}`;
    });
  } catch (error) {
    console.error(`Internal server error.`, error);
  }
}



fetchSetMeal();

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
