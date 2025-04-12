const backendUrl = "https://kitchen-log-backend.onrender.com";
// const backendUrl = "http://localhost:4000";

const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

let setMealData = [];
let tagData = [];
let recipeData = [];

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
    setMealData = data.setMealData;
    tagData = data.tag;
    recipeData = data.recipe;

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
                    <img class="recipe-img" alt="recipe image" src="${r.image_url}">
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

async function fetchRecipeData(id) {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${backendUrl}/recipes/recipe`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipeId: id }),
    });
    const data = await response.json();
    const ingData = data.ingData;
    return ingData;
  } catch (error) {
    console.error(`Internal server error.`, error);
    return [];
  }
}

async function addToShoppingList(task) {
  for (let i = 0; i < task.length; i++) {
    try {
      const token = localStorage.getItem('jwt');
      await fetch(`${backendUrl}/upload/task`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        }, 
        body: JSON.stringify({ task: task[i] }), 
      });
    } catch (error) {
      console.error(`Internal server error.`, error);
    }
  }
}

document.getElementById("add-to-list").addEventListener("click", async () => {
  let ingList = [];
  for (let i = 0; i < recipeData.length; i++) {
    const list = await fetchRecipeData(recipeData[i].id);
    for (let j = 0; j < list.length; j++) {
      ingList.push(list[j]);
    }
  }
  

  ingList = ingList.map(ing => `${ing.name}...${ing.amount}`);
  
  console.log(ingList);

  await addToShoppingList(ingList);

  const params = new URLSearchParams({ id, id });
  window.location.href = `./set_meal.html?${params.toString()}`;
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

fetchSetMeal();

checkSession();