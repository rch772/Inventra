const API_URL = "/products";
const LOW_STOCK_LIMIT = 10;

const productForm = document.getElementById("productForm");
const formMessage = document.getElementById("formMessage");
const productTableBody = document.getElementById("productTableBody");
const lowStockList = document.getElementById("lowStockList");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

const totalProductsEl = document.getElementById("totalProducts");
const totalQuantityEl = document.getElementById("totalQuantity");
const lowStockCountEl = document.getElementById("lowStockCount");
const totalValueEl = document.getElementById("totalValue");

const updateModal = document.getElementById("updateModal");
const closeModal = document.getElementById("closeModal");
const modalProductName = document.getElementById("modalProductName");
const modalCurrentQty = document.getElementById("modalCurrentQty");
const newQuantityInput = document.getElementById("newQuantity");
const saveQuantityBtn = document.getElementById("saveQuantityBtn");

let allProducts = [];
let selectedProductId = null;
let inventoryChart = null;

async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    allProducts = Array.isArray(data)
      ? data.filter(
          (item) =>
            item &&
            typeof item.name !== "undefined" &&
            typeof item.price !== "undefined" &&
            typeof item.quantity !== "undefined"
        )
      : [];

    renderDashboard(allProducts);
    renderLowStock(allProducts);
    renderFilteredProducts();
    renderChart(allProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}
function renderDashboard(products) {
  totalProductsEl.textContent = products.length;

  const totalQuantity = products.reduce((sum, product) => sum + Number(product.quantity), 0);
  totalQuantityEl.textContent = totalQuantity;

  const lowStockCount = products.filter(
    (product) => Number(product.quantity) <= LOW_STOCK_LIMIT
  ).length;
  lowStockCountEl.textContent = lowStockCount;

  const totalValue = products.reduce(
    (sum, product) => sum + Number(product.price) * Number(product.quantity),
    0
  );
  totalValueEl.textContent = `₹${totalValue.toLocaleString("en-IN")}`;
}

function renderLowStock(products) {
  const lowStockProducts = products.filter(
    (product) => Number(product.quantity) <= LOW_STOCK_LIMIT
  );

  if (!lowStockProducts.length) {
    lowStockList.innerHTML = `<p class="empty-state">No low-stock products right now.</p>`;
    return;
  }

  lowStockList.innerHTML = lowStockProducts
    .map(
      (product) => `
      <div class="alert-card">
        <h4>${product.name}</h4>
        <p>Only ${product.quantity} unit(s) left. Restock soon.</p>
      </div>
    `
    )
    .join("");
}

function getFilteredProducts() {
  const searchValue = searchInput.value.trim().toLowerCase();
  const filterValue = filterSelect.value;

  let filtered = [...allProducts];

  if (searchValue) {
    filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(searchValue)
    );
  }

  if (filterValue === "inStock") {
    filtered = filtered.filter((product) => Number(product.quantity) > LOW_STOCK_LIMIT);
  } else if (filterValue === "lowStock") {
    filtered = filtered.filter((product) => Number(product.quantity) <= LOW_STOCK_LIMIT);
  }

  

  return filtered;
}

function renderFilteredProducts() {
  const products = getFilteredProducts();

  if (!products.length) {
    productTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-state">No matching products found.</td>
      </tr>
    `;
    return;
  }

  productTableBody.innerHTML = products
    .map(
      (product) => `
      <tr>
        <td>${product.name}</td>
        <td>₹${Number(product.price).toLocaleString("en-IN")}</td>
        <td>${product.quantity}</td>
        <td>
          <span class="status-badge ${
            Number(product.quantity) <= LOW_STOCK_LIMIT ? "status-low" : "status-good"
          }">
            ${Number(product.quantity) <= LOW_STOCK_LIMIT ? "Low Stock" : "In Stock"}
          </span>
        </td>
        <td>
          <button class="action-btn" onclick="openUpdateModal('${product._id}', '${product.name}', ${product.quantity})">
            Update Quantity
          </button>
        </td>
      </tr>
    `
    )
    .join("");
}

function renderChart(products) {
  const ctx = document.getElementById("inventoryChart").getContext("2d");

  const labels = products.map((product) => product.name);
  const quantities = products.map((product) => product.quantity);

  if (inventoryChart) {
    inventoryChart.destroy();
  }

  inventoryChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Product Quantity",
          data: quantities,
          borderWidth: 1,
          borderRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

productForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const price = document.getElementById("price").value;
  const quantity = document.getElementById("quantity").value;

  if (!name) {
    formMessage.style.color = "crimson";
    formMessage.textContent = "Product name should not be empty";
    return;
  }

  if (Number(price) <= 0) {
    formMessage.style.color = "crimson";
    formMessage.textContent = "Price must be positive";
    return;
  }

  if (Number(quantity) < 0) {
    formMessage.style.color = "crimson";
    formMessage.textContent = "Quantity cannot be negative";
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        price: Number(price),
        quantity: Number(quantity)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      formMessage.style.color = "crimson";
      formMessage.textContent = data.message || "Failed to add product";
      return;
    }

    formMessage.style.color = "green";
    formMessage.textContent = "Product added successfully";
    productForm.reset();
    fetchProducts();
  } catch (error) {
    formMessage.style.color = "crimson";
    formMessage.textContent = "Something went wrong";
  }
});

window.openUpdateModal = function (id, name, quantity) {
  selectedProductId = id;
  modalProductName.textContent = name;
  modalCurrentQty.textContent = quantity;
  newQuantityInput.value = quantity;
  updateModal.classList.remove("hidden");
};

closeModal.addEventListener("click", () => {
  updateModal.classList.add("hidden");
});

window.addEventListener("click", (e) => {
  if (e.target === updateModal) {
    updateModal.classList.add("hidden");
  }
});

saveQuantityBtn.addEventListener("click", async () => {
  const newQuantity = Number(newQuantityInput.value);

  if (newQuantity < 0) {
    alert("Quantity cannot be negative");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${selectedProductId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        quantity: newQuantity
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Failed to update quantity");
      return;
    }

    updateModal.classList.add("hidden");
    fetchProducts();
  } catch (error) {
    alert("Something went wrong");
  }
});

searchInput.addEventListener("input", renderFilteredProducts);
filterSelect.addEventListener("change", renderFilteredProducts);

fetchProducts();