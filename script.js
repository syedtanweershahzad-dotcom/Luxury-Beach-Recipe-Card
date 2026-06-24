const cookModeToggle = document.getElementById("cookModeToggle");
const ingredientChecks = document.querySelectorAll(".ingredient-check");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

const servingsCount = document.getElementById("servingsCount");
const increaseServings = document.getElementById("increaseServings");
const decreaseServings = document.getElementById("decreaseServings");
const ingredientAmounts = document.querySelectorAll(".ingredient-amount");

const themeToggle = document.getElementById("themeToggle");
const saveRecipeBtn = document.getElementById("saveRecipeBtn");
const copyRecipeBtn = document.getElementById("copyRecipeBtn");

let servings = 1;

/* ---------------------------
   Fraction formatter
---------------------------- */
function formatAmount(num) {
  const rounded = Math.round(num * 100) / 100;

  if (rounded === 0.5) return "½";
  if (rounded === 1.5) return "1½";
  if (rounded === 2.5) return "2½";
  if (rounded === 3.5) return "3½";
  if (rounded === 4.5) return "4½";

  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/\.00$/, "");
}

/* ---------------------------
   Update ingredient amounts
---------------------------- */
function updateIngredientAmounts() {
  ingredientAmounts.forEach((item) => {
    const base = parseFloat(item.dataset.base);
    const updated = base * servings;
    item.textContent = formatAmount(updated);
  });
}

/* ---------------------------
   Progress
---------------------------- */
function updateProgress() {
  const checked = document.querySelectorAll(".ingredient-check:checked").length;
  const total = ingredientChecks.length;

  progressText.textContent = `${checked} / ${total}`;
  progressFill.style.width = `${(checked / total) * 100}%`;
}

ingredientChecks.forEach((checkbox) => {
  checkbox.addEventListener("change", updateProgress);
});

updateProgress();

/* ---------------------------
   Servings
---------------------------- */
increaseServings.addEventListener("click", () => {
  servings++;
  servingsCount.textContent = servings;
  updateIngredientAmounts();
});

decreaseServings.addEventListener("click", () => {
  if (servings > 1) {
    servings--;
    servingsCount.textContent = servings;
    updateIngredientAmounts();
  }
});

/* ---------------------------
   Cook Mode
---------------------------- */
cookModeToggle.addEventListener("change", function () {
  document.body.classList.toggle("cook-mode", this.checked);
});

/* ---------------------------
   Theme Toggle
---------------------------- */
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  const icon = themeToggle.querySelector("i");
  if (document.body.classList.contains("light-mode")) {
    icon.className = "fa-solid fa-sun";
  } else {
    icon.className = "fa-solid fa-moon";
  }
});

/* ---------------------------
   Save Recipe Button
---------------------------- */
let saved = false;

saveRecipeBtn.addEventListener("click", () => {
  saved = !saved;
  saveRecipeBtn.classList.toggle("saved", saved);

  if (saved) {
    saveRecipeBtn.innerHTML = `<i class="fa-solid fa-bookmark"></i><span>Saved</span>`;
  } else {
    saveRecipeBtn.innerHTML = `<i class="fa-regular fa-bookmark"></i><span>Save Recipe</span>`;
  }
});

/* ---------------------------
   Copy Recipe
---------------------------- */
copyRecipeBtn.addEventListener("click", async () => {
  const recipeText = `
Sex on the Beach

Prep Time: 5 min
Cook Time: 0 min
Total Time: 5 min
Servings: ${servings}

Ingredients:
- ${formatAmount(1.5 * servings)} ounces vodka
- ${formatAmount(1 * servings)} ounce peach schnapps
- ${formatAmount(1.5 * servings)} ounces orange juice
- ${formatAmount(1.5 * servings)} ounces cranberry juice
- Ice
- Orange slices + maraschino cherries for garnish

Instructions:
1. Fill a cocktail shaker or mixing glass halfway with ice.
2. Pour in the vodka, peach schnapps, orange juice, and cranberry juice.
3. Stir or shake gently until chilled.
4. Fill a glass with ice and pour the cocktail over it.
5. Garnish with orange slices and cherries.
  `.trim();

  try {
    await navigator.clipboard.writeText(recipeText);
    copyRecipeBtn.innerHTML = `<i class="fa-solid fa-check"></i> Copied`;
    setTimeout(() => {
      copyRecipeBtn.innerHTML = `<i class="fa-regular fa-copy"></i> Copy Recipe`;
    }, 1800);
  } catch (err) {
    alert("Copy failed. Your browser may not allow clipboard access.");
  }
});

/* Initial */
updateIngredientAmounts();