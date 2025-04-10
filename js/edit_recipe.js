const backendUrl = "http://localhost:4000";
const params = new URLSearchParams(window.location.search);
const id = Number(params.get("id"));

let imgUrl = '';

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

function cancelIngredient(id) {
    const targetId = `i-id-${id}`;

    let currrentHtml = document.querySelectorAll(".ing");

    currrentHtml.forEach(html => {
        if (html.id === targetId) {
            html.remove();
        }
    });
}

function cancelStep(id) {
    const targetId = `s-id-${id}`;

    let currrentHtml = document.querySelectorAll(".step");

    currrentHtml.forEach(html => {
        if (html.id === targetId) {
            html.remove();
        }
    });
}

function addIng(e) {
    if (e.key !== 'Enter') {
        return;
    }
    e.preventDefault();

    if (document.getElementById("ing-name").value === '' || document.getElementById("ing-amount").value === '') {
        return;
    }

    const currrentHtml = document.querySelectorAll(".ing");

    let lastId = 0;
    let newId = 0;
    if (currrentHtml.length > 0) {
        lastId = Number(String(currrentHtml[currrentHtml.length - 1].id).split("-")[2]);
        newId = lastId + 1;
    }

    const ingName = document.getElementById("ing-name").value;
    const ingAmount = document.getElementById("ing-amount").value;
   
    const newHtml = `
                    <input class="input" type="text" name="ingName" value='${ingName}'>
                    <input class="input" type="text" name="ingAmount" value='${ingAmount}'>
                    <svg onclick="cancelIngredient(${newId})" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x-circle cancel-ing-btn" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                    `;

    const newNode = document.createElement('div');
    newNode.classList.add('ing');
    newNode.id = `i-id-${newId}`;
    newNode.innerHTML = newHtml;

    document.getElementById("new-ing-list").appendChild(newNode);

    document.getElementById("ing-name").value = '';
    document.getElementById("ing-amount").value = '';
}

function setTag(data) {
    let tCount = -1;
    const tagHtml = data
        .map(tag => {
            tCount += 1;
            return `<div class="new-tag" id="t-id-${tCount}">
                        <input class="input" type="text" name="tag" value="${tag.name}">
                        <svg onclick="cancelTag(${tCount})" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x-circle cancel-tag-btn" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </div>
                    `
        })
        .join("");
    document.getElementById("new-tag-list").innerHTML = tagHtml;
}

function setIng(data) {
    let iCount = -1;
    const ingHtml = data
        .map(ing => {
            iCount += 1;
            return `<div class="ing" id="i-id-${iCount}">
                        <input class="input" type="text" name="ingName" value='${ing.name}'>
                        <input class="input" type="text" name="ingAmount" value='${ing.amount}'>
                        <svg onclick="cancelIngredient(${iCount})" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x-circle cancel-ing-btn" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </div>
                    `
        })
        .join("");
    document.getElementById("new-ing-list").innerHTML = ingHtml;
}

function setStep(data) {
    let sCount = -1;
    const stepHtml = data
        .map(step => {
            sCount += 1;
            return `<div class="step" id="s-id-${sCount}">
                        <textarea type="text" name="step">${step.name}</textarea>
                        <svg onclick="cancelStep(${sCount})" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x-circle cancel-step-btn" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </div>
                    `
        })
        .join("");
    document.getElementById("new-step-list").innerHTML = stepHtml;
}

async function fetchRecipe() {
    try {
        const token = localStorage.getItem("jwt");
        const response = await fetch(`${backendUrl}/recipes/recipe/admin`, {
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

        document.getElementById("recipe-title").value = recipeData.title;
        document.getElementById("recipe-memo").innerHTML = recipeData.memo;
        if (recipeData.image_url !== '') {
            document.getElementById("recipe-img").src = `${backendUrl}${recipeData.image_url}`;
            imgUrl = recipeData.image_url;
        }
        setTag(tagData);
        setIng(ingData);
        setStep(stepData);
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}

async function deleteImg() {
    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${backendUrl}/edit/file`, {
            method: "DELETE", 
            headers: {
                'Authorization': `Bearer ${token}`, 
                "Content-Type": "application/json"
            }, 
            body: JSON.stringify({ previousUrl: imgUrl }),
        });
        const data = await response.json();
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
}

async function uploadImg() {
    const form = document.getElementById("edit-recipe-form");
    const formData = new FormData(form);
    const recipeImgRaw = formData.get("image");

    if (recipeImgRaw.name === '') {
        return imgUrl;
    }

    let formImgData = new FormData();
    formImgData.append('file', recipeImgRaw);

    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${backendUrl}/edit/file`, {
            method: "POST", 
            headers: {
                'Authorization': `Bearer ${token}`
            }, 
            body: formImgData, 
        });
        const data = await response.json();
        await deleteImg();

        return data.url;
    } catch (error) {
        console.error(`Internal server error.`, error);
        return imgUrl;
    }
}

document.getElementById("apply-edit-recipe").addEventListener("click", async () => {
    const form = document.getElementById("edit-recipe-form");
    const formData = new FormData(form);

    let url = await uploadImg();

    const tagNames = Array.from(document.querySelectorAll('[name="tag"]'))
        .map(input => input.value);
    let tagList = [];
    for (let i = 0; i < tagNames.length; i++) {
        tagList.push({name: tagNames[i]});
    }

    const ingNames = Array.from(document.querySelectorAll('[name="ingName"]'))
        .map(input => input.value);
    const ingAmounts = Array.from(document.querySelectorAll('[name="ingAmount"]'))
        .map(input => input.value);
    let ingList = [];
    for (let i = 0; i < ingNames.length; i++) {
        ingList.push({name: ingNames[i], amount: ingAmounts[i]});
    }

    const stepNames = Array.from(document.querySelectorAll('[name="step"]'))
        .map(input => input.value);
    let stepList = [];
    for (let i = 0; i < stepNames.length; i++) {
        stepList.push({name: stepNames[i]});
    }

    const recipeData = {
        recipeId: id, 
        imgUrl: url, 
        title: formData.get("title"), 
        memo: formData.get("memo"), 
        tag: tagList, 
        ing: ingList, 
        step: stepList
    }

    try {
        const token = localStorage.getItem('jwt');
        const response = await fetch(`${backendUrl}/edit/recipe`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            }, 
            body: JSON.stringify(recipeData), 
        });
        const data = await response.json();

        const params = new URLSearchParams({ id, id });
        window.location.href = `recipe.html?${params.toString()}`;
    } catch (error) {
        console.error(`Internal server error.`, error);
    }
});

document.getElementById("image").addEventListener("change", function(event) {
    const file = event.target.files[0];
    document.getElementById("recipe-img").src = URL.createObjectURL(file);
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

document.getElementById("ing-name").addEventListener("keypress", (e) => {
    addIng(e);
});

document.getElementById("ing-amount").addEventListener("keypress", (e) => {
    addIng(e);
});

document.getElementById("step-input").addEventListener("keypress", (e) => {
    if (e.key !== 'Enter') {
        return;
    }
    e.preventDefault();

    if (document.getElementById("step-input").value === '') {
        return;
    }

    const currrentHtml = document.querySelectorAll(".step");

    let lastId = 0;
    let newId = 0;
    if (currrentHtml.length > 0) {
        lastId = Number(String(currrentHtml[currrentHtml.length - 1].id).split("-")[2]);
        newId = lastId + 1;
    } 
   
    const newHtml = `
                    <textarea type="text" name="step">${e.target.value}</textarea>
                    <svg onclick="cancelStep(${newId})" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-x-circle cancel-step-btn" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                    </svg>
                    `;

    const newNode = document.createElement('div');
    newNode.classList.add('step');
    newNode.id = `s-id-${newId}`;
    newNode.innerHTML = newHtml;

    document.getElementById("new-step-list").appendChild(newNode);

    document.getElementById("step-input").value = '';
});

document.getElementById("cansel-edit-recipe").addEventListener("click", function() {
    const params = new URLSearchParams({ id, id });
    window.location.href = `recipe.html?${params.toString()}`;
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

fetchRecipe();