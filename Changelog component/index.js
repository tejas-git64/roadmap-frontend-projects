//Sample array that can be of type number/string/JSON
const arr = [1, 2, 3, 4, 5, 9, 10, 12, 15, 27];
const date = new Date();
const multiplier = 35;
const lc = document.querySelector(".line-container");
const changelogLine = document.querySelector(".changelog-line");
const expandBtn = document.getElementById("eBtn");
changelogLine.style.height = `${arr.length * multiplier - 10}px`;

arr.forEach((ele, i) => {
	const changelog = document.createElement("div");
	changelog.classList.add("changelog");
	changelog.style.bottom = `${i * multiplier}px`;
	const dateElement = document.createElement("p");
	dateElement.classList.add("date");
	dateElement.textContent = `September ${ele}, ${date.getFullYear()}`;
	const pointContainer = document.createElement("div");
	pointContainer.classList.add("point-container");
	const point = document.createElement("div");
	point.classList.add("point");
	const comment = document.createElement("p");
	comment.classList.add("comment");
	comment.textContent = `updated head at commit ${i + 1}`;
	changelog.appendChild(dateElement);
	changelog.appendChild(pointContainer);
	pointContainer.appendChild(point);
	changelog.appendChild(comment);
	changelogLine.appendChild(changelog);
	setTimeout(() => {
		changelog.classList.add("visible");
	}, (i + 1) * 100);
});

expandBtn.addEventListener("click", () => {
	lc.classList.toggle("expand");
	if (lc.classList.contains("expand")) {
		eBtn.innerHTML = "Show recent changelogs";
	} else {
		eBtn.innerHTML = "Show all changelogs";
	}
});
