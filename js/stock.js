const backendUrl = "https://kitchen-log-backend.onrender.com";
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
      window.location.href = "login.html";
    }
  } catch (error) {
    console.error(`Internal server error.`, error);
    window.location.href = "login.html";
  }
}

function editStock(id) {
  const params = new URLSearchParams({ id, id });
  window.location.href = `edit_stock.html?${params.toString()}`;
}

async function fetchStock() {
  try {
    const token = localStorage.getItem("jwt");
    const response = await fetch(`${backendUrl}/stock`, {
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

function setStock(list) {
  document.getElementById("stock-list").innerHTML = list
    .map((stock) => {
      const id = stock.id;
      const name = stock.name;
      const quantity = stock.quantity;
      const expiration_date = stock.expiration_date;

      const utcDate = new Date(expiration_date);
      const formattedDate = utcDate.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      });


      return `<li class="stock">
                <button type="button" class="edit-btn" onclick="editStock(${id})">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    class="bi bi-three-dots three-dots"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"
                    />
                  </svg>
                </button>
                <p class="stock-name">${name}</p>
                <p>量：${quantity}</p>
                <p>賞味期限：${formattedDate}</p>
              </li>
              `;
    })
    .join("");
}

document.getElementById("search").addEventListener("keypress", function(e) {
    
  if (e.key !== 'Enter') {
     return;
  }
  
  e.preventDefault();

  const keyword = document.getElementById("search").value.toLowerCase(); 
  if (!keyword) {
    fetchStock();
    return;
  }

  const filteredStock = stockList.filter(stock => 
    stock.name.toLowerCase().includes(keyword)
  );

  setStock(filteredStock)
});

document.getElementById("nav-cancel").addEventListener("click", () => {
  document.getElementById("sidebar").style.display = "none";
});

document.getElementById("open-nav").addEventListener("click", () => {
  document.getElementById("sidebar").style.display = "block";
});

document.getElementById("sidebar").style.display = "none";

checkSession();

fetchStock();

const currentYear = new Date().getFullYear();
document.querySelector("#year").innerHTML = currentYear;
