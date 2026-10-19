/**
 * TaskMaster Pro - Productivity CRUD Application
 * Datheon Full Stack Web Development Internship (Task 2)
 * Student: Paras Nakum (ID: DT-2026-YQFWW)
 */

document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'taskmaster_paras_tasks';

    // State
    let tasks = loadFromLocalStorage();
    let currentStatusFilter = 'all';
    let currentCategoryFilter = 'all';
    let currentSearchTerm = '';

    // DOM Elements
    const taskForm = document.getElementById('taskForm');
    const taskTitleInput = document.getElementById('taskTitle');
    const taskCategoryInput = document.getElementById('taskCategory');
    const taskPriorityInput = document.getElementById('taskPriority');
    const taskDueDateInput = document.getElementById('taskDueDate');

    const searchInput = document.getElementById('searchInput');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const categoryFilter = document.getElementById('categoryFilter');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');

    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');

    // Metrics Elements
    const totalCountEl = document.getElementById('totalTasksCount');
    const activeCountEl = document.getElementById('activeTasksCount');
    const completedCountEl = document.getElementById('completedTasksCount');
    const completionRateEl = document.getElementById('completionRate');

    // Edit Modal Elements
    const editModal = document.getElementById('editModal');
    const editForm = document.getElementById('editForm');
    const editTaskId = document.getElementById('editTaskId');
    const editTaskTitle = document.getElementById('editTaskTitle');
    const editTaskCategory = document.getElementById('editTaskCategory');
    const editTaskPriority = document.getElementById('editTaskPriority');
    const editTaskDueDate = document.getElementById('editTaskDueDate');
    const closeEditModalBtn = document.getElementById('closeEditModal');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    // Default Seed Data if LocalStorage is empty
    if (!localStorage.getItem(STORAGE_KEY)) {
        tasks = [
            {
                id: 'task-1',
                title: 'Build Responsive Developer Portfolio (Datheon Task 1)',
                category: 'Coding',
                priority: 'High',
                dueDate: '2026-10-25',
                completed: true,
                createdAt: Date.now() - 86400000
            },
            {
                id: 'task-2',
                title: 'Review MCA Distributed Systems Lecture Notes',
                category: 'Study',
                priority: 'Medium',
                dueDate: '2026-10-22',
                completed: false,
                createdAt: Date.now() - 43200000
            },
            {
                id: 'task-3',
                title: 'Implement Weather Telemetry with 5-Day Forecast (Datheon Task 3)',
                category: 'Coding',
                priority: 'High',
                dueDate: '2026-10-26',
                completed: false,
                createdAt: Date.now() - 20000000
            },
            {
                id: 'task-4',
                title: 'Update GitHub repository README & deployment links',
                category: 'Work',
                priority: 'Low',
                dueDate: '2026-10-28',
                completed: false,
                createdAt: Date.now() - 10000000
            }
        ];
        saveToLocalStorage();
    }

    // Initialize Render
    renderTasks();
    updateMetrics();

    // 1. CREATE Task
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const title = taskTitleInput.value.trim();
        if (!title) return;

        const newTask = {
            id: 'task-' + Date.now(),
            title: title,
            category: taskCategoryInput.value,
            priority: taskPriorityInput.value,
            dueDate: taskDueDateInput.value || '',
            completed: false,
            createdAt: Date.now()
        };

        tasks.unshift(newTask);
        saveToLocalStorage();
        renderTasks();
        updateMetrics();

        taskForm.reset();
        taskTitleInput.focus();
    });

    // 2. READ / RENDER Tasks
    function renderTasks() {
        taskList.innerHTML = '';

        const filteredTasks = tasks.filter(task => {
            // Status Filter
            if (currentStatusFilter === 'active' && task.completed) return false;
            if (currentStatusFilter === 'completed' && !task.completed) return false;

            // Category Filter
            if (currentCategoryFilter !== 'all' && task.category !== currentCategoryFilter) return false;

            // Search Term
            if (currentSearchTerm && !task.title.toLowerCase().includes(currentSearchTerm.toLowerCase())) {
                return false;
            }

            return true;
        });

        if (filteredTasks.length === 0) {
            emptyState.style.display = 'block';
        } else {
            emptyState.style.display = 'none';

            filteredTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.setAttribute('data-id', task.id);

                const formattedDate = task.dueDate ? `<span class="badge badge-due"><i class="far fa-calendar"></i> ${task.dueDate}</span>` : '';

                li.innerHTML = `
                    <div class="task-left">
                        <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} aria-label="Toggle completion">
                        <div class="task-details">
                            <span class="task-text">${escapeHTML(task.title)}</span>
                            <div class="task-meta">
                                <span class="badge badge-cat">${task.category}</span>
                                <span class="badge badge-priority-${task.priority}">${task.priority}</span>
                                ${formattedDate}
                            </div>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="action-btn btn-edit" title="Edit Task" aria-label="Edit task">
                            <i class="fas fa-pencil"></i>
                        </button>
                        <button class="action-btn btn-delete" title="Delete Task" aria-label="Delete task">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;

                // Event Listeners for Item Actions
                const checkbox = li.querySelector('.task-checkbox');
                checkbox.addEventListener('change', () => toggleTaskComplete(task.id));

                const editBtn = li.querySelector('.btn-edit');
                editBtn.addEventListener('click', () => openEditModal(task));

                const deleteBtn = li.querySelector('.btn-delete');
                deleteBtn.addEventListener('click', () => deleteTask(task.id));

                taskList.appendChild(li);
            });
        }
    }

    // 3. UPDATE / TOGGLE STATUS
    function toggleTaskComplete(id) {
        const target = tasks.find(t => t.id === id);
        if (target) {
            target.completed = !target.completed;
            saveToLocalStorage();
            renderTasks();
            updateMetrics();
        }
    }

    // 4. DELETE Task
    function deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks = tasks.filter(t => t.id !== id);
            saveToLocalStorage();
            renderTasks();
            updateMetrics();
        }
    }

    // 5. EDIT Task Modal Operations
    function openEditModal(task) {
        editTaskId.value = task.id;
        editTaskTitle.value = task.title;
        editTaskCategory.value = task.category;
        editTaskPriority.value = task.priority;
        editTaskDueDate.value = task.dueDate || '';
        editModal.classList.add('active');
    }

    function closeEditModal() {
        editModal.classList.remove('active');
    }

    closeEditModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);

    editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = editTaskId.value;
        const target = tasks.find(t => t.id === id);
        if (target) {
            target.title = editTaskTitle.value.trim();
            target.category = editTaskCategory.value;
            target.priority = editTaskPriority.value;
            target.dueDate = editTaskDueDate.value;
            saveToLocalStorage();
            renderTasks();
            updateMetrics();
            closeEditModal();
        }
    });

    // 6. CLEAR COMPLETED
    clearCompletedBtn.addEventListener('click', () => {
        const completedCount = tasks.filter(t => t.completed).length;
        if (completedCount === 0) {
            alert('No completed tasks to clear.');
            return;
        }
        if (confirm(`Clear all ${completedCount} completed task(s)?`)) {
            tasks = tasks.filter(t => !t.completed);
            saveToLocalStorage();
            renderTasks();
            updateMetrics();
        }
    });

    // 7. FILTERS & SEARCH
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentStatusFilter = btn.getAttribute('data-filter');
            renderTasks();
        });
    });

    categoryFilter.addEventListener('change', (e) => {
        currentCategoryFilter = e.target.value;
        renderTasks();
    });

    searchInput.addEventListener('input', (e) => {
        currentSearchTerm = e.target.value.trim();
        renderTasks();
    });

    // 8. METRICS
    function updateMetrics() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.completed).length;
        const active = total - completed;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        totalCountEl.textContent = total;
        activeCountEl.textContent = active;
        completedCountEl.textContent = completed;
        completionRateEl.textContent = `${rate}%`;
    }

    // 9. LOCAL STORAGE HELPERS
    function saveToLocalStorage() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    function loadFromLocalStorage() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Failed to parse tasks from localStorage', e);
            return [];
        }
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }
});
