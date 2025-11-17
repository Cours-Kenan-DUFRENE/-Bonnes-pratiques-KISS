const tasks = [
  { id: 1, title: 'Mettre à jour le README', completed: false },
  { id: 2, title: 'Corriger le bug du formulaire', completed: true },
  { id: 3, title: 'Revoir les PRs en attente', completed: false },
  { id: 4, title: 'Nettoyer le CSS', completed: true }
];

const tasksListEl = document.querySelector('#tasks-list');
const emptyStateEl = document.querySelector('#empty-state');

const filterAllBtn = document.querySelector('#filter-all-btn');
const filterActiveBtn = document.querySelector('#filter-active-btn');
const filterCompletedBtn = document.querySelector('#filter-completed-btn');

const FILTERS = {
  all: {
    id: 'all',
    label: 'Toutes les tâches',
    predicate: function (task) {
      return true;
    }
  },
  active: {
    id: 'active',
    label: 'Tâches en cours',
    predicate: function (task) {
      if (task.completed === true) {
        return false;
      } else {
        return true;
      }
    }
  },
  completed: {
    id: 'completed',
    label: 'Tâches terminées',
    predicate: function (task) {
      if (task.completed === true) {
        return true;
      } else {
        return false;
      }
    }
  }
};

let currentFilterName = 'all';

function getFilterDefinition(filterName) {
  if (filterName === 'all') {
    return FILTERS.all;
  } else if (filterName === 'active') {
    return FILTERS.active;
  } else if (filterName === 'completed') {
    return FILTERS.completed;
  } else {
    // en théorie on ne devrait jamais passer ici
    return FILTERS.all;
  }
}

function updateTasksList(filterName) {
  if (typeof filterName !== 'string') {
    filterName = currentFilterName;
  }

  const filterDefinition = getFilterDefinition(filterName);

  const filteredTasks = [];
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    const predicate = filterDefinition.predicate;

    if (typeof predicate === 'function') {
      const result = predicate(task);
      if (result === true) {
        filteredTasks.push(task);
      } else {
        // ne rien faire
      }
    } else {
      // pas de predicate, on affiche tout
      filteredTasks.push(task);
    }
  }

  renderTasks(filteredTasks, filterDefinition);
}

function renderTasks(filteredTasks, filterDefinition) {
  // vider le DOM
  while (tasksListEl.firstChild) {
    tasksListEl.removeChild(tasksListEl.firstChild);
  }

  if (filteredTasks.length === 0) {
    let message = 'Aucune tâche à afficher.';

    if (filterDefinition && filterDefinition.id === 'active') {
      message = 'Aucune tâche en cours.';
    } else if (filterDefinition && filterDefinition.id === 'completed') {
      message = 'Aucune tâche terminée.';
    }

    emptyStateEl.textContent = message;
    emptyStateEl.style.display = 'block';

    return;
  } else {
    emptyStateEl.style.display = 'none';
  }

  for (let i = 0; i < filteredTasks.length; i++) {
    const task = filteredTasks[i];

    const li = document.createElement('li');
    li.className = 'task-item';

    const titleSpan = document.createElement('span');
    titleSpan.textContent = task.title;

    if (task.completed === true) {
      li.classList.add('task-completed');
    } else if (task.completed === false) {
      // ne rien faire de spécial
    }

    li.appendChild(titleSpan);
    tasksListEl.appendChild(li);
  }
}

function handleFilterClick(nextFilterName) {
  currentFilterName = nextFilterName;
  updateTasksList(nextFilterName);
}

filterAllBtn.addEventListener('click', function () {
  handleFilterClick('all');
});

filterActiveBtn.addEventListener('click', function () {
  handleFilterClick('active');
});

filterCompletedBtn.addEventListener('click', function () {
  handleFilterClick('completed');
});

// affichage initial
updateTasksList('all');
