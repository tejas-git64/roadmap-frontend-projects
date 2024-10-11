const addBtn = document.querySelector(".add-btn");
const themeBtn = document.querySelector(".theme-btn");
const themeIcon = document.getElementById("theme-icon");
const dialog = document.querySelector(".add-dialog");
const closeBtn = document.querySelector(".close-btn");
const newSubBtn = document.querySelector(".new-sub-btn");
let newSub = "";
const inputBox = document.getElementById("subname");
const statusBox = document.querySelector(".status");
inputBox.value = newSub;
let subredditData = [];
const subrContainer = document.querySelector(".subreddit-container");
const subreddits = document.querySelectorAll(".subreddit");
let subredditArr = ["developersIndia"];

async function fetchSubReddit(sub) {
	try {
		const res = await fetch(`https://www.reddit.com/r/${sub}.json`);
		if (!res.ok) {
			// error = "This subreddit does not exist!";
			statusBox.style.visibility = "visible";
			statusBox.style.opacity = 1;
			inputBox.style.outline = "1px solid red";
			inputBox.style.color = "red";
			statusBox.style.color = "red";
			if (res.status === 404) {
				statusBox.textContent = "This subreddit does not exist!";
			}
			if (res.status === 403) {
				statusBox.textContent = "Can't be fetched, it is forbidden";
			}
			if (res.status === 500) {
				statusBox.textContent = "Server problem, try again later";
			}
			if (res.status === 451) {
				statusBox.textContent = "Content unavailable ¯_(ツ)_/¯";
			}
		} else {
			const sub = await res.json();
			const data = sub.data;
			if (data) {
				const rData = {
					subreddit: newSub,
					url: `https://www.reddit.com/r/${newSub}`,
					posts: data.children.map((post) => {
						const data = post.data;
						return {
							id: data.id,
							title: data.title,
							author: data.author_fullname,
							ups: data.ups,
							post_url: data.url,
						};
					}),
				};
				console.log(rData);
				statusBox.style.visibility = "visible";
				statusBox.style.opacity = 1;
				statusBox.textContent = "Subreddit found!";
				statusBox.style.color = "green";
				inputBox.style.outline = "1px solid green";
				inputBox.style.color = "green";
				subredditData.push(rData);
				renderSubreddit();
				setTimeout(() => {
					dialog.style.visibility = "hidden";
					dialog.style.opacity = 0;
					statusBox.textContent = "";
					inputBox.style.outline = "none";
					inputBox.style.color = "black";
					inputBox.value = "";
				}, 1000);
			} else {
				statusBox.style.visibility = "visible";
				statusBox.style.opacity = 1;
				statusBox.textContent = "No data found!";
				inputBox.style.outline = "1px solid red";
				inputBox.style.color = "red";
			}
		}
	} catch (err) {
		console.error(err);
		statusBox.textContent = `Unexpected error: ${err}`;
		inputBox.style.outline = "1px solid red";
		inputBox.style.color = "red";
		statusBox.style.visibility = "visible";
		statusBox.style.opacity = 1;
	}
}

themeBtn.addEventListener("click", () => {
	document.body.classList.toggle("dark-theme");
	if (document.body.classList.contains("dark-theme")) {
		themeIcon.style.transform = "rotate(45deg)";
		themeIcon.setAttribute("src", "./assets/sun-svgrepo-com.svg");
		addBtn.firstElementChild.style.filter = "invert(0.85)";
		addBtn.lastElementChild.style.color = "#191919";
	} else {
		themeIcon.style.transform = "rotate(0deg)";
		themeIcon.setAttribute("src", "./assets/moon-svgrepo-com.svg");
		addBtn.firstElementChild.style.filter = "invert(0)";
		addBtn.lastElementChild.style.color = "white";
	}
});

inputBox.addEventListener("input", (e) => {
	statusBox.textContent = "";
	statusBox.style.color = "none";
	inputBox.style.outline = "none";
	inputBox.style.color = "white";
	newSub = e.target.value;
	if (e.target.value.trim() === "") {
		newSubBtn.disabled = true;
	} else {
		newSubBtn.disabled = false;
	}
});

addBtn.addEventListener("click", () => {
	dialog.style.visibility = "visible";
	dialog.style.opacity = 1;
	newSubBtn.disabled = true;
});

dialog.firstElementChild.addEventListener("submit", (e) => {
	e.preventDefault();
});
closeBtn.addEventListener("click", () => {
	dialog.style.visibility = "hidden";
	dialog.style.opacity = 0;
	// statusBox.style.visibility = "hidden";
	// statusBox.style.opacity = 0;
	// statusBox.textContent = "";
	inputBox.style.outline = "none";
	inputBox.style.color = "none";
	inputBox.value = "";
});
newSubBtn.addEventListener("click", () => {
	if (newSub.trim() !== "") {
		newSubBtn.disabled = false;
		fetchSubReddit(newSub);
	} else {
		newSubBtn.disabled = true;
	}
});

function renderSubreddit() {
	subrContainer.innerHTML = "";
	subredditData.forEach((obj, i) => {
		//Subreddit
		const subReddit = document.createElement("div");
		subReddit.setAttribute("class", "subreddit");
		subReddit.setAttribute("id", obj.subreddit);
		subReddit.style.animationDuration = `${0.85 + i * 0.1}s`;
		const header = document.createElement("header");
		const subrTitle = document.createElement("h4");
		subrTitle.setAttribute("class", "subr-title");
		subrTitle.innerHTML = `r/${obj.subreddit}`;
		header.append(subrTitle);
		const menu = document.createElement("div");
		menu.setAttribute("class", "menu");
		const menuBtn = document.createElement("button");
		menuBtn.setAttribute("type", "button");
		menuBtn.setAttribute("class", "menu-btn");
		const menuImg = document.createElement("img");
		menuImg.src = "./assets/menu-dots-svgrepo-com.svg";
		menuImg.alt = "menu-icon";
		menuImg.width = "20";
		menuImg.height = "20";
		menuBtn.append(menuImg);
		menu.append(menuBtn);
		const menuContainer = document.createElement("div");
		menuContainer.setAttribute("class", "menu-container");
		const refreshBtn = document.createElement("button");
		refreshBtn.setAttribute("type", "button");
		const img1 = document.createElement("img");
		img1.src = "./assets/refresh-cw-alt-3-svgrepo-com.svg";
		img1.alt = "option-icon";
		img1.width = "30";
		img1.height = "30";
		const span1 = document.createElement("span");
		span1.innerHTML = "Refresh";
		refreshBtn.append(img1);
		refreshBtn.append(span1);
		refreshBtn.addEventListener("click", () => {
			menuContainer.classList.toggle("reveal");
		});
		const delBtn = document.createElement("button");
		delBtn.setAttribute("type", "button");
		const img2 = document.createElement("img");
		img2.src = "./assets/delete-2-svgrepo-com.svg";
		img2.alt = "option-icon";
		img2.width = "30";
		img2.height = "30";
		const span2 = document.createElement("span");
		span2.innerHTML = "Delete";
		delBtn.append(img2);
		delBtn.append(span2);
		delBtn.addEventListener("click", () => {
			menuContainer.classList.toggle("reveal");
			subReddit.classList.toggle("removed");
			setTimeout(() => {
				subReddit.style.display = "none";
				subredditData = subredditData.filter(
					(data) => data.subreddit !== obj.subreddit
				);
				renderSubreddit();
			}, 830);
		});
		menuContainer.append(refreshBtn);
		menuContainer.append(delBtn);
		menu.append(menuContainer);
		menuBtn.addEventListener("click", () => {
			menuContainer.classList.toggle("reveal");
		});
		header.append(menu);
		subReddit.append(header);
		const ul = document.createElement("ul");
		ul.setAttribute("class", "posts");
		obj.posts.forEach((post) => {
			const li = document.createElement("li");
			const a = document.createElement("a");
			a.setAttribute("class", "post");
			a.setAttribute("href", post.post_url);
			a.setAttribute("target", "_blank");
			const upvote = document.createElement("div");
			upvote.setAttribute("class", "upvote");
			const upvoteImg = document.createElement("img");
			upvoteImg.src = "./assets/up-arrow-svgrepo-com.svg";
			upvoteImg.alt = "upvote-icon";
			upvoteImg.width = "20";
			upvoteImg.height = "20";
			const upvotes = document.createElement("p");
			upvotes.setAttribute("class", "upvotes");
			upvotes.innerHTML = post.ups;
			upvote.append(upvoteImg);
			upvote.append(upvotes);
			const header2 = document.createElement("header");
			const postName = document.createElement("h4");
			postName.setAttribute("class", "post-name");
			postName.innerHTML = post.title;
			const postUser = document.createElement("p");
			postUser.setAttribute("class", "post-user");
			postUser.innerHTML = `u/${post.author}`;
			header2.append(postUser);
			header2.append(postName);
			a.append(upvote);
			a.append(header2);
			li.append(a);
			ul.append(li);
		});
		subReddit.append(ul);
		subrContainer.append(subReddit);
	});
}
renderSubreddit();
