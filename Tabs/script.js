const links = document.querySelectorAll(".link");
const contents = document.querySelectorAll(".content");

function toggleSelection(n) {
	const selectedLink = document.querySelector(".selected-link");
	const shownContent = document.querySelector(".show");
	if (selectedLink) {
		if (selectedLink === links[n]) {
			return;
		}
		links[n].classList.add("selected-link");
		contents[n].classList.add("show");
		selectedLink.classList.remove("selected-link");
		shownContent.classList.remove("show");
	}
	return;
}

links.forEach((link, i) =>
	link.addEventListener("click", () => toggleSelection(i))
);
