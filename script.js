// Получаем элементы из DOM
const form = document.getElementById("todo-form"); // Форма добавления задачи
const input = document.getElementById("todo-input"); // Поле ввода задачи
const list = document.getElementById("todo-list"); // Список задач

// Загружаем задачи из localStorage при старте
let todos = JSON.parse(localStorage.getItem("todos")) || []; // Если пусто, создаём пустой массив

// Функция для отображения задач на странице
function renderTodos() {
  list.innerHTML = ""; // Очищаем текущий список
  // Перебираем все задачи
  todos.forEach((todo, index) => {
    // Создаём элемент списка
    const li = document.createElement("li");
    li.textContent = todo; // Устанавливаем текст задачи

    // Создаём кнопку удаления
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.className = "delete-btn";

    // Добавляем обработчик удаления
    deleteBtn.addEventListener("click", () => {
      todos.splice(index, 1); // Удаляем задачу из массива
      saveTodos(); // Сохраняем изменения
      renderTodos(); // Обновляем отображение
    });

    // Добавляем кнопку в элемент списка
    li.appendChild(deleteBtn);
    // Добавляем элемент списка в список на странице
    list.appendChild(li);
  });
}

// Функция для сохранения задач в localStorage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos)); // Сохраняем массив в формате JSON
}

// Обработчик события добавления задачи
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Отменяем стандартное поведение формы
  const task = input.value.trim(); // Получаем текст задачи
  if (task) {
    // Если текст не пустой
    todos.push(task); // Добавляем задачу в массив
    saveTodos(); // Сохраняем задачи
    renderTodos(); // Отображаем обновлённый список
    input.value = ""; // Очищаем поле ввода
  }
});

// Отображаем задачи при загрузке страницы
renderTodos();
