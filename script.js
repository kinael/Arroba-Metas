let goals = JSON.parse(localStorage.getItem('goals')) || [];
let filterStatus = 'all'; // Status atual do filtro

function addGoal() {
  const goalInput = document.getElementById('goalInput');
  const goalName = goalInput.value.trim();

  if (goalName === '') {
    alert('Por favor, escreva uma meta.');
    return;
  }

  const goal = {
    id: Date.now(),
    name: goalName,
    steps: [],
    completedSteps: 0
  };

  goals.unshift(goal); // Adiciona as metas mais recentes no topo.
  goalInput.value = '';
  saveGoals();
  renderGoals();
}

function filterGoals(status) {
  filterStatus = status;
  renderGoals();
}

function renderGoals() {
  const goalsList = document.getElementById('goalsList');
  goalsList.innerHTML = '';

  const filteredGoals = goals.filter(goal => {
    if (filterStatus === 'completed') {
      return goal.steps.length > 0 && goal.completedSteps === goal.steps.length;
    } else if (filterStatus === 'pending') {
      return goal.steps.length === 0 || goal.completedSteps < goal.steps.length;
    }
    return true; // Retorna todas as metas para o filtro "all"
  });

  filteredGoals.forEach(goal => {
    const progress = Math.round((goal.completedSteps / goal.steps.length || 0) * 100);

    // Adiciona o emoji 🎉 se a meta está 100% concluída
    const goalTitle = progress === 100 ? `${goal.name} 🎉` : goal.name;

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

// Render the goals on page load
renderGoals();
