let goals = JSON.parse(localStorage.getItem("goals")) || [];
let filterStatus = "all"; 
let selectedCategory = "";

function addGoal() {
  const goalInput = document.getElementById("goalInput");
  const categoryInput = document.getElementById("categoryInput");
  const rewardInput = document.getElementById("rewardInput");
  const goalName = goalInput.value.trim();
  const categoryName = categoryInput.value.trim();
  const reward = rewardInput.value.trim();

  if (goalName === "" || categoryName === "" || reward === "") {
    alert("Por favor, preencha todos os campos.");
    return;
  }

  const goal = {
    id: Date.now(),
    name: goalName,
    category: categoryName,
    reward: reward,
    steps: [],
    completedSteps: 0,
  };

  goals.unshift(goal);
  goalInput.value = "";
  categoryInput.value = "";
  rewardInput.value = "";
  saveGoals();
  updateCategoryFilter();
  renderGoals();
}

function updateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(goals.map((goal) => goal.category))];

  categoryFilter.innerHTML = '<option value="">Todas as categorias</option>';
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterGoals(status) {
  filterStatus = status;

  const filterButton = document.getElementById("filterMenuButton");
  switch (status) {
    case "all":
      filterButton.textContent = "Todas as metas";
      break;
    case "completed":
      filterButton.textContent = "Metas concluídas";
      break;
    case "pending":
      filterButton.textContent = "Metas pendentes";
      break;
    default:
      filterButton.textContent = "Filtrar metas";
  }

  renderGoals();
}

function filterByCategory() {
  const categoryFilter = document.getElementById("categoryFilter");
  selectedCategory = categoryFilter.value;
  renderGoals();
}

function renderGoals() {
  const goalsList = document.getElementById("goalsList");
  goalsList.innerHTML = "";

  const filteredGoals = goals.filter((goal) => {
    const matchesCategory =
      selectedCategory === "" || goal.category === selectedCategory;

    if (filterStatus === "completed") {
      return (
        matchesCategory &&
        goal.steps.length > 0 &&
        goal.completedSteps === goal.steps.length
      );
    } else if (filterStatus === "pending") {
      return (
        matchesCategory &&
        (goal.steps.length === 0 || goal.completedSteps < goal.steps.length)
      );
    }

    return matchesCategory;
  });

  filteredGoals.forEach((goal) => {
    const progress = ((goal.completedSteps / goal.steps.length || 0) * 100).toFixed(2);

    const rewardText = progress === "100.00" 
      ? `<span style="color: green; font-style: normal; text-decoration: underline;">${goal.reward} 🎉</span>` 
      : `<span style="color: gray; font-style: italic;">${goal.reward} (bloqueado)</span>`;

    const goalElement = document.createElement("div");
    goalElement.className = "mb-4";
    goalElement.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <h5>
          ${goal.name} 
          ${progress === "100.00" ? '<span style="font-style: italic; color: gray;">(concluída ✅)</span>' : ''}
        </h5>
        <div>
          <button class="small-btn" onclick="editGoal(${goal.id})">
            <i class="fa fa-pencil-alt"></i>
          </button>
        </div>
      </div>
      <div class="progress-bar mt-2">
        <div class="progress-bar-inner" style="width: ${progress}%;">${progress}%</div>
      </div>
      <p class="mt-2">Categoria: <strong>${goal.category}</strong></p>
      <p class="mt-2" style="${progress === '100.00' ? 'text-decoration: underline;' : ''}">
        Recompensa: ${rewardText}
      </p>
      <div class="mt-2">
        <ul class="list-group mb-2">
          ${goal.steps
            .map(
              (step) => `
            <li class="list-group-item d-flex justify-content-between align-items-center ${step.completed ? "completed" : ""}">
              <span>${step.name}</span>
              <div>
                <input type="checkbox" ${step.completed ? "checked" : ""} onclick="toggleStep(${goal.id}, ${step.id})">
                <button class="small-btn" onclick="editStep(${goal.id}, ${step.id})">
                  <i class="fa fa-pencil-alt"></i>
                </button>
              </div>
            </li>`
            )
            .join("")}
        </ul>
        <div class="input-group mb-2">
          <input type="text" class="form-control" placeholder="Escreva uma etapa..." id="stepInput-${goal.id}">
          <button class="btn btn-outline-primary" onclick="addStep(${goal.id})">Nova etapa</button>
        </div>
        <button class="btn btn-danger btn-sm" onclick="deleteGoal(${goal.id})">Deletar meta</button>
      </div>
      <hr>
    `;

    goalsList.appendChild(goalElement);
  });
}






function addStep(goalId) {
  const stepInput = document.getElementById(`stepInput-${goalId}`);
  const stepName = stepInput.value.trim();

  if (stepName === "") {
    alert("Por favor, escreva uma etapa.");
    return;
  }

  const goal = goals.find((g) => g.id === goalId);
  const step = {
    id: Date.now(),
    name: stepName,
    completed: false,
  };

  goal.steps.push(step);
  stepInput.value = "";
  saveGoals();
  renderGoals();
}

function toggleStep(goalId, stepId) {
  const goal = goals.find((g) => g.id === goalId);
  const step = goal.steps.find((s) => s.id === stepId);

  step.completed = !step.completed;

  goal.completedSteps = goal.steps.filter((s) => s.completed).length;
  saveGoals();
  renderGoals();
}

function deleteGoal(goalId) {
  goals = goals.filter((goal) => goal.id !== goalId);
  saveGoals();
  renderGoals();
}

function saveGoals() {
  localStorage.setItem("goals", JSON.stringify(goals));
}

// Inicializar a interface
updateCategoryFilter();
renderGoals();
