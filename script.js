document.addEventListener("DOMContentLoaded", () => {
  initThemeToggle();
  initPropertyFilters();
  initPlanSelection();
});

function initThemeToggle() {
  const toggleBtn = document.createElement("button");
  toggleBtn.className = "theme-toggle";
  toggleBtn.textContent = "🌙";
  document.body.appendChild(toggleBtn);

  const savedTheme = localStorage.getItem("urbannest-theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️";
  }

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
    localStorage.setItem("urbannest-theme", isDark ? "dark" : "light");
  });
}

function initPropertyFilters() {
  const bar = document.querySelector(".home-search");
  const grid = document.querySelector(".properties-grid");
  if (!bar || !grid) return;

  const locationInput = bar.querySelector(".home-search-input");
  const selects = bar.querySelectorAll(".home-search-select");
  const priceSelect = selects[0];
  const typeSelect = selects[1];
  const button = bar.querySelector(".btn");
  const cards = grid.querySelectorAll(".card");

  function parsePrice(text) {
    const n = parseInt(text.replace(/[^\d]/g, ""), 10);
    return isNaN(n) ? 0 : n;
  }

  function applyFilters() {
    const loc = locationInput.value.trim().toLowerCase();
    const priceVal = priceSelect.value;
    const typeVal = typeSelect.value.trim().toLowerCase();

    cards.forEach(card => {
      const title = card.querySelector(".card-title")?.textContent.toLowerCase() || "";
      const sub = card.querySelector(".card-sub")?.textContent.toLowerCase() || "";
      const badge = card.querySelector(".badge")?.textContent.toLowerCase() || "";
      const priceText = card.querySelector(".price")?.textContent || "";
      const priceNum = parsePrice(priceText);

      let ok = true;

      if (loc) {
        const combined = title + " " + sub;
        if (!combined.includes(loc)) ok = false;
      }

      if (priceVal) {
        const p = parseInt(priceVal, 10);
        if (p === 10000 && !(priceNum < 10000)) ok = false;
        else if (p === 20000 && !(priceNum >= 10000 && priceNum <= 20000)) ok = false;
        else if (p === 40000 && !(priceNum > 20000 && priceNum <= 40000)) ok = false;
        else if (p === 40001 && !(priceNum > 40000)) ok = false;
      }

      if (typeVal) {
        if (!badge.includes(typeVal)) ok = false;
      }

      card.style.display = ok ? "" : "none";
    });
  }

  button.addEventListener("click", applyFilters);
  locationInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFilters();
    }
  });
}

function initPlanSelection() {
  const pricingTable = document.querySelector(".pricing-table");
  if (!pricingTable) return;

  const messageBar = document.createElement("div");
  messageBar.className = "plan-message";
  messageBar.textContent = "Select a plan to continue.";
  pricingTable.parentElement.insertBefore(messageBar, pricingTable);

  const planCards = pricingTable.querySelectorAll(".card");
  const buttons = pricingTable.querySelectorAll(".btn-full");

  buttons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
      planCards.forEach(card => card.classList.remove("active-plan"));
      const selectedCard = planCards[index];
      selectedCard.classList.add("active-plan");

      const planName = selectedCard.querySelector(".plan-name")?.textContent || "This";
      messageBar.textContent = `${planName} plan selected.`;
    });
  });
}
