// Обработчики фильтров// Получаем элементы из DOM
const form = document.getElementById("todo-form"); // Форма добавления
const input = document.getElementById("todo-input"); // Поле ввода задачи
const list = document.getElementById("todo-list"); // Список задач

// Получаем кнопки фильтров
const allBtn = document.getElementById("all-btn");
const completedBtn = document.getElementById("completed-btn");
const pendingBtn = document.getElementById("pending-btn");

// Загружаем задачи из localStorage или создаём пустой массив
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// Текущий фильтр (all, completed, pending)
let currentFilter = "all";

// Сохраняем задачи в localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// Возвращает задачи согласно фильтру
function getFilteredTodos() {
  if (currentFilter === "completed") return todos.filter((todo) => todo.done);
  if (currentFilter === "pending") return todos.filter((todo) => !todo.done);
  return todos;
}

// Отображение задач
function renderTodos() {
  list.innerHTML = ""; // Очищаем список
  // Сортируем по дате: новые сверху
  const filteredTodos = getFilteredTodos().sort(
    (a, b) => b.createdAt - a.createdAt
  );

  filteredTodos.forEach((todo, index) => {
    const li = document.createElement("li"); // Элемент списка

    // Чекбокс выполнения
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => {
      todo.done = checkbox.checked;
      saveTodos();
      renderTodos();
    });

    // Текст задачи
    const span = document.createElement("span");
    span.textContent = todo.text;
    if (todo.done) span.classList.add("done");

    // Редактирование текста по клику
    span.addEventListener("click", () => {
      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.value = todo.text;
      li.replaceChild(editInput, span);
      editInput.focus();

      editInput.addEventListener("blur", () => {
        const newValue = editInput.value.trim();
        if (newValue) todo.text = newValue;
        saveTodos();
        renderTodos();
      });

      editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") editInput.blur();
      });
    });

    // Кнопка удаления
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      // Плавное исчезновение
      li.style.opacity = 0;
      li.style.transform = "translateY(-10px)";
      setTimeout(() => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
      }, 300);
    });

    // Добавляем элементы в li
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(deleteBtn);

    // Добавляем плавное появление
    li.classList.add("show");

    // Добавляем li в список
    list.appendChild(li);
  });
}

// Добавление новой задачи
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskText = input.value.trim();
  if (!taskText) return;

  const newTask = {
    text: taskText,
    done: false,
    createdAt: Date.now(),
  };

  todos.push(newTask);
  saveTodos();
  renderTodos();
  input.value = "";
});

// Обработчики фильтров
allBtn.addEventListener("click", () => {
  currentFilter = "all";
  renderTodos();
});

completedBtn.addEventListener("click", () => {
  currentFilter = "completed";
  renderTodos();
});

pendingBtn.addEventListener("click", () => {
  currentFilter = "pending";
  renderTodos();
});

// Показываем задачи при загрузке страницы
renderTodos();
