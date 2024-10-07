const dropDown = document.querySelector(".dropdown");
const selection = document.querySelector(".toggle");
const dropdownList = document.querySelector(".dropdown-list");
const listItems = document.querySelectorAll(".list-item");
let selectedTag = document.querySelector(".selected");
let selected = "";

dropDown.addEventListener("click", () => {
	selection.classList.toggle("clicked");
	dropdownList.classList.toggle("visible");
});

listItems.forEach((item) => {
	item.addEventListener("click", () => {
		if (selected === item.firstElementChild.innerHTML) {
			//Unselects the option if already selected
			selected = "";
			item.classList.toggle("selected");
		} else {
			//Selects a new option
			selected = item.firstElementChild.innerHTML;
			listItems.forEach((item) => item.classList.remove("selected"));
			item.classList.toggle("selected");
		}
		selectedTag.innerHTML = selected === "" ? "Select an option" : selected;
	});
});
