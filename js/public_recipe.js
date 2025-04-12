const backendUrl = "https://kitchen-log-backend.onrender.com";
// const backendUrl = "http://localhost:4000";

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

async function fetchRecipe() {
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
    const recipeData = data.recipeData[0];
    const tagData = data.tagData;
    const ingData = data.ingData;
    const stepData = data.stepData;

    document.getElementById("recipe-title").innerHTML = recipeData.title;
    document.getElementById("recipe-memo").innerHTML = recipeData.memo;
    document.getElementById("recipe-img").src = `${recipeData.image_url}`;

    document.getElementById("tag-list").innerHTML = tagData
      .map((tag) => {
        return `<li class="tag">${tag.name}</li>`;
      })
      .join("");

    document.getElementById("ing-list").innerHTML = ingData
      .map((ing) => {
        return `<li class="ing"><span class="ing-name">${ing.name}</span>…<span class="ing-amount">${ing.amount}</span></li>
                        <hr/>
                        `;
      })
      .join("");

    document.getElementById("step-list").innerHTML = stepData
      .map((step) => {
        return `<li class="step">${step.name}</li><hr/>`;
      })
      .join("");
  } catch (error) {
    console.error(`Internal server error.`, error);
  }
}

fetchRecipe();

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
