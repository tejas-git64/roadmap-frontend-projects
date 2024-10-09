let randomRepo;

let results = [];
let selectedLanguage = "";
let languages = [];
const repo = document.querySelector(".repo");
const selection = document.getElementById("lang-select");
const fallback = document.querySelector(".fallback");
const fallbackInfo = document.querySelector(".fallback-info");
const fallbackImg = document.querySelector(".fallback-img");
const repoHeading = document.querySelector(".repo-heading");
const repoDesc = document.querySelector(".repo-desc");
const langInfo = document.querySelector(".lang-info");
const starCount = document.querySelector(".star-count");
const forkCount = document.querySelector(".fork-count");
const issueCount = document.querySelector(".issue-count");
const refreshBtn = document.querySelector(".refresh");

const getLanguages = async () => {
	const res = await fetch(
		`https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json`
	);
	languages = await res.json();
	languages.forEach((lang) => {
		const option = document.createElement("option");
		option.value = lang.value;
		option.innerHTML = lang.title;
		selection.append(option);
	});
};
getLanguages();

function handleState(state) {
	switch (state) {
		case (state = "select"):
			fallback.style.display = "flex";
			fallback.style.backgroundColor = "#ececec";
			fallbackInfo.textContent = "Please, select a language";
			fallbackImg.setAttribute(
				"src",
				"./assets/rectangle-code-svgrepo-com.svg"
			);
			refreshBtn.firstElementChild.innerHTML = "Refresh";
			break;
		case (state = "loading"):
			fallback.style.display = "flex";
			repo.style.display = "none";
			fallback.style.backgroundColor = "#ececec";
			fallbackInfo.style.color = "black";
			fallbackInfo.textContent = "Loading, please wait...";
			fallbackImg.setAttribute("src", "./assets/loading-svgrepo-com.svg");
			refreshBtn.firstElementChild.innerHTML = "Refresh";
			refreshBtn.style.display = "none";
			break;
		case (state = "ready"):
			repo.style.display = "block";
			fallback.style.display = "none";
			refreshBtn.style.display = "block";
			refreshBtn.style.backgroundColor = "black";
			break;
		case (state = "error"):
			fallback.style.backgroundColor = "#ffe4e4";
			fallbackInfo.style.color = "red";
			fallbackInfo.textContent = "Error fetching repositories";
			fallbackImg.setAttribute(
				"src",
				"./assets/exclamation-triangle-svgrepo-com.svg"
			);
			fallbackImg.style.width = "30px";
			fallbackImg.style.height = "30px";
			refreshBtn.style.backgroundColor = "red";
			refreshBtn.firstElementChild.innerHTML = "Click to retry";
			refreshBtn.style.display = "block";
			break;
	}
}

function formatNumber(num) {
	if (num >= 1e6) {
		return (num / 1e6).toFixed(1) + "M"; // Format for millions
	} else if (num >= 1e3) {
		return (num / 1e3).toFixed(1) + "K"; // Format for thousands
	} else {
		return num.toString();
	}
}

function rerenderRepo() {
	if (randomRepo) {
		repo.href = randomRepo.html_url;
		repoHeading.innerHTML = randomRepo.name;
		repoDesc.textContent = randomRepo.description;
		langInfo.innerHTML = randomRepo.language;
		starCount.innerHTML = formatNumber(randomRepo.stargazers_count);
		forkCount.innerHTML = formatNumber(randomRepo.forks);
		issueCount.innerHTML = formatNumber(randomRepo.open_issues_count);
		handleState("ready");
		return;
	}
	handleState("select");
}
rerenderRepo();

//Repositories fetching function
const getRandRepos = async () => {
	handleState("loading");
	const res = await fetch(
		`https://api.github.com/search/repositories?q=language:${selectedLanguage}&sort=stars&order=desc`
	);
	const json = res.json();
	json
		.then((res) => {
			results = res.items;
			randomRepo = res.items[0];
			rerenderRepo();
		})
		.catch((err) => {
			handleState("error");
		});
};

selection.addEventListener("change", (e) => {
	selectedLanguage = e.target.value === "" ? "All Languages" : e.target.value;
	handleState("loading");
	if (selectedLanguage === "") {
		handleState("select");
	}
	getRandRepos();
});

//Getting random repos from already fetched repo list
//instead of fetching again for just a new repo
refreshBtn.addEventListener("click", () => {
	const n = Math.floor(Math.random() * results.length - 1);
	randomRepo = results[n];
	rerenderRepo();
});
