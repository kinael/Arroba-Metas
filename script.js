let goals = JSON.parse(localStorage.getItem('goals')) || [];
let filterStatus = 'all'; // Status atual do filtro
let selectedCategory = ''; 

function addGoal() {
  const goalInput = document.getElementById('goalInput');
  const categoryInput = document.getElementById('categoryInput');
  const goalName = goalInput.value.trim();
  const categoryName = categoryInput.value.trim();

  if (goalName === '' || categoryName === '') {
    alert('Por favor, escreva a meta e a categoria.');
    return;
  }

  const goal = {
    id: Date.now(),
    name: goalName,
    category: categoryName,
    steps: [],
    completedSteps: 0
  };

  goals.unshift(goal);
  goalInput.value = '';
  categoryInput.value = '';
  saveGoals();
  updateCategoryFilter();
  renderGoals();
}

function updateCategoryFilter() {
  const categoryFilter = document.getElementById('categoryFilter');
  const categories = [...new Set(goals.map(goal => goal.category))];

  categoryFilter.innerHTML = '<option value="">Todas as categorias</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

function filterGoals(status) {
  filterStatus = status;
  renderGoals();
}

function filterByCategory() {
  const categoryFilter = document.getElementById('categoryFilter');
  selectedCategory = categoryFilter.value;
  renderGoals();
}

function renderGoals() {
  const goalsList = document.getElementById('goalsList');
  goalsList.innerHTML = '';

  const filteredGoals = goals.filter(goal => {
    const matchesCategory = selectedCategory === '' || goal.category === selectedCategory;

    if (filterStatus === 'completed') {
      return matchesCategory && goal.steps.length > 0 && goal.completedSteps === goal.steps.length;
    } else if (filterStatus === 'pending') {
      return matchesCategory && (goal.steps.length === 0 || goal.completedSteps < goal.steps.length);
    }

    return matchesCategory; // Retorna todas as metas para o filtro "all"
  });

  filteredGoals.forEach(goal => {
    const progress = ((goal.completedSteps / goal.steps.length || 0) * 100).toFixed(2);

    const goalTitle = progress === '100.00' ? `${goal.name} 🎉` : goal.name;

    const goalElement = document.createElement('div');
    goalElement.className = 'mb-4';
    goalElement.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <h5>${goalTitle}</h5>
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
      <div class="mt-2">
        <ul class="list-group mb-2">
          ${goal.steps.map(step => `
            <li class="list-group-item d-flex justify-content-between align-items-center ${step.completed ? 'completed' : ''}">
              <span>${step.name}</span>
              <div>
                <input type="checkbox" ${step.completed ? 'checked' : ''} onclick="toggleStep(${goal.id}, ${step.id})">
                <button class="small-btn" onclick="editStep(${goal.id}, ${step.id})">
                  <i class="fa fa-pencil-alt"></i>
                </button>
              </div>
            </li>
          `).join('')}
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

  if (stepName === '') {
    alert('Por favor, escreva uma etapa.');
    return;
  }

  const goal = goals.find(g => g.id === goalId);
  const step = {
    id: Date.now(),
    name: stepName,
    completed: false
  };

  goal.steps.push(step);
  saveGoals();
  stepInput.value = '';
  renderGoals();
}

function toggleStep(goalId, stepId) {
  const goal = goals.find(g => g.id === goalId);
  const step = goal.steps.find(s => s.id === stepId);
  step.completed = !step.completed;

  goal.completedSteps = goal.steps.filter(s => s.completed).length;
  saveGoals();
  renderGoals();
}

function deleteGoal(goalId) {
  goals = goals.filter(g => g.id !== goalId);
  saveGoals();
  updateCategoryFilter();
  renderGoals();
}

function editGoal(goalId) {
  const goal = goals.find(g => g.id === goalId);
  const newName = prompt('Editar nome da meta:', goal.name);

  if (newName !== null && newName.trim() !== '') {
    goal.name = newName.trim();
    saveGoals();
    renderGoals();
  }
}

function editStep(goalId, stepId) {
  const goal = goals.find(g => g.id === goalId);
  const step = goal.steps.find(s => s.id === stepId);
  const newName = prompt('Editar nome da etapa:', step.name);

  if (newName !== null && newName.trim() !== '') {
    step.name = newName.trim();
    saveGoals();
    renderGoals();
  }
}

function saveGoals() {
  localStorage.setItem('goals', JSON.stringify(goals));
}

// Inicializa os filtros e renderiza as metas na página
updateCategoryFilter();
renderGoals();
