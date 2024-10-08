//Sample JSON array
// {
// 	id: 0;
// 	task: "";
// 	status: 0; //Has two states - Pending - 0, Completed - 1
// }

let taskArr = [];
const taskContainer = document.querySelector(".tasks");
const addBtn = document.querySelector(".add-btn");
const textInput = document.getElementById("task-bar");

function renderTasks() {
	taskContainer.innerHTML = "";
	const sortedArr = taskArr.sort((a, b) => a.status - b.status);
	sortedArr.forEach((t, i) => {
		//Create the task
		const li = document.createElement("li");
		li.setAttribute("class", "task");
		const checkbox = document.createElement("input");
		checkbox.setAttribute("type", "checkbox");
		checkbox.setAttribute("id", `toggle-${t.id}`);
		checkbox.checked = t.status === 1 ? true : false;
		const taskLabel = document.createElement("label");
		taskLabel.htmlFor = `toggle-${t.id}`;
		taskLabel.innerHTML = t.task;
		const span = document.createElement("span");
		span.setAttribute("class", "task-state");
		if (t.status === 1) {
			span.classList.add("completed");
		}
		checkbox.addEventListener("change", () => {
			if (checkbox.checked) {
				span.classList.add("completed");
				t.status = 1;
			} else {
				span.classList.remove("completed");
				t.status = 0;
			}
			renderTasks();
		});
		span.append(checkbox);
		span.append(taskLabel);
		const delBtn = document.createElement("button");
		delBtn.setAttribute("type", "button");
		const delImg = document.createElement("img");
		delImg.setAttribute("src", "./assets/delete-svgrepo-com.svg");
		delBtn.append(delImg);
		delBtn.addEventListener("click", () => {
			const filteredArr = taskArr.filter((task) => task.id !== t.id);
			taskArr = filteredArr;
			renderTasks();
		});
		li.append(span);
		li.append(delBtn);
		//Add task to the container
		taskContainer.append(li);
	});
}
renderTasks();

let i = 0;
textInput.addEventListener("input", () => {
	addBtn.disabled = textInput.value.trim() === "";
});

//Function to add tasks
function addTasks() {
	const newTask = {
		id: i + 1,
		task: textInput.value,
		status: 0,
	};
	taskArr.push(newTask);
	i++;
	renderTasks();
	textInput.value = "";
}

addBtn.addEventListener("click", addTasks);

//Support for adding with enter key
textInput.addEventListener("keydown", (e) => {
	if (textInput.value.trim() !== "" && e.key === "Enter") {
		addTasks();
	}
});
