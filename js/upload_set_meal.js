const backendUrl = 'http://localhost:4000';

async function checkSession() {
    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${backendUrl}/accounts/session`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            }, 
        });
        const data = await response.json();
        if (data.isLoggedIn === false) {
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error(`Internal server error.`, error);
        window.location.href = 'login.html';
    }
}

function cancelTag(id) {
    const targetId = `t-id-${id}`;

    let currrentHtml = document.querySelectorAll(".new-tag");

    currrentHtml.forEach(html => {
        if (html.id === targetId) {
            html.remove();
        }
    });
}

function cancelRecipe(id) {
    const targetId = `r-id-${id}`;

    let currrentHtml = document.querySelectorAll(".recipe");

    currrentHtml.forEach(html => {
        if (html.id === targetId) {
            html.remove();
        }
    });
}

async function selectRecipe(id) {
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
        const title = data.recipeData[0].title;
        const url = `${backendUrl}${data.recipeData[0].image_url}`;
   
        const newHtml = `                   
                            <svg onclick="cancelRecipe(${id})" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x-circle cancel-recipe-btn" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>
                            <img class="recipe-img" alt="recipe image" src="${url}"> 
                            <p>${title}</p>
                        `;

        const newNode = document.createElement('li');
        newNode.classList.add('recipe');
        newNode.id = `r-id-${id}`;
        newNode.innerHTML = newHtml;

        document.getElementById("recipe-list").appendChild(newNode);
        document.getElementById("search-bar").value = '';
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}

document.getElementById("apply-set-meal").addEventListener("click", async () => {
    const form = document.getElementById("upload-set-meal-form");
    const formData = new FormData(form);

    const tagNames = Array.from(document.querySelectorAll('[name="tag"]'))
        .map(input => input.value);
    let tagList = [];
    for (let i = 0; i < tagNames.length; i++) {
        tagList.push({name: tagNames[i]});
    }

    const recipes = Array.from(document.querySelectorAll('.recipe'))
        .map(recipe => Number(String(recipe.id).split("-")[2]));
    let recipeIdList = [];
    for (let i = 0; i < recipes.length; i++) {
        recipeIdList.push({id: recipes[i]});
    }
    recipeIdList = recipeIdList.filter(id => id.id);

    const recipeData = {
        title: formData.get("title"), 
        tag: tagList, 
        recipeId: recipeIdList
    }

    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${backendUrl}/upload/set_meal`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            }, 
            body: JSON.stringify(recipeData), 
        });
        const data = await response.json();

        location.href = 'set_meals.html';
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
});

document.getElementById("tag-input").addEventListener("keypress", (e) => {
    if (e.key !== 'Enter') {
        return;
    }
    e.preventDefault();

    if (document.getElementById("tag-input").value === '') {
        return;
    }

    const currrentHtml = document.querySelectorAll(".new-tag");

    let lastId = 0;
    let newId = 0;
    if (currrentHtml.length > 0) {
        lastId = Number(String(currrentHtml[currrentHtml.length - 1].id).split("-")[2]);
        newId = lastId + 1;
    } 
   
    const newHtml = `
                    <input class="input" type="text" name="tag" value="${e.target.value}">
                    <svg onclick="cancelTag(${newId})" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x-circle cancel-tag-btn" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                    `;

    const newNode = document.createElement('div');
    newNode.classList.add('new-tag');
    newNode.id = `t-id-${newId}`;
    newNode.innerHTML = newHtml;

    document.getElementById("new-tag-list").appendChild(newNode);

    document.getElementById("tag-input").value = '';
});

document.getElementById("search-bar").addEventListener("input", async (e) => {
    const keyword = e.target.value;

    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${backendUrl}/recipes/search`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            }, 
            body: JSON.stringify({ keyword: keyword }), 
        });
        const data = await response.json();

        document.getElementById("recipe-sug-list").innerHTML = data.data
            .map((recipe) => {
                const id = recipe.id;
                const title = recipe.title;

                return `<li class="sug-recipe" onclick="selectRecipe(${id})">
                            <p>${title}</p>
                        </li>
                        `;
            })
            .join("");
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
});

document.getElementById("nav-cancel").addEventListener("click", () => {
    document.getElementById("sidebar").style.display = 'none';
});

document.getElementById("open-nav").addEventListener("click", () => {
    document.getElementById("sidebar").style.display = 'block';
});

document.getElementById("sidebar").style.display = 'none';

const currentYear = new Date().getFullYear();
document.querySelector("#year").innerHTML = currentYear;

checkSession();