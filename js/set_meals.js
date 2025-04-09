const backendUrl = "http://localhost:4000";
let setMealsList = [];

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

async function fetchSetMeals() {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${backendUrl}/set_meals`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setMealsList = data.data;

    setPage(setMealsList);
  } catch (error) {
    console.error(`Internal server error.`, error);
  }
}

function setPage(list) {
  document.getElementById("set-meals-list").innerHTML = list
    .map((set) => {
      const id = set.id;
      const title = set.title;
      const tagList = createTagHtml(set.tag);
      const recipeList = createRecipeHtml(set.recipe);      

      return `
                <li class="set-meal" onclick="seeSetMeal(${id})">
                    <h3>${title}</h3>
                    <ul class="tag-list">
                        ${tagList}
                    </ul>
                    <ul class="recipe-img-list">
                        ${recipeList}
                    </ul>
                </li>          
            `;
    })
    .join("");
}

function createTagHtml(list) {
    const tagHtml = list
      .map((l) => {
        return `<li class="tag">${l.name}</li>`;
      })
      .join("");

    return tagHtml;
}

function createRecipeHtml(list) {
    const recipeHtml = list
      .map((l) => {
        return `<li><img class="recipe-img" alt="recipe image" src="${backendUrl}${l.image_url}"></li>`;
      })
      .join("");

    return recipeHtml;
}

function seeSetMeal(id) {
    const params = new URLSearchParams({ id, id });
    window.location.href = `set_meal.html?${params.toString()}`;
}

document.getElementById("search").addEventListener("keypress", function(e) {
    
  if (e.key !== 'Enter') {
     return;
  }
  
  e.preventDefault();

  const keyword = document.getElementById("search").value.toLowerCase(); 
  if (!keyword) {
    fetchSetMeals();
    return;
  }

  const filteredSetMeals = setMealsList.filter(set => 
    set.title.toLowerCase().includes(keyword)
  );

  setPage(filteredSetMeals)
});

document.getElementById("nav-cancel").addEventListener("click", () => {
  document.getElementById("sidebar").style.display = "none";
});

document.getElementById("open-nav").addEventListener("click", () => {
  document.getElementById("sidebar").style.display = "block";
});

document.getElementById("sidebar").style.display = "none";

checkSession();

fetchSetMeals();

const currentYear = new Date().getFullYear();
document.querySelector("#year").innerHTML = currentYear;