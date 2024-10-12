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
const subrFallback = document.querySelector(".subr-fallback");
let subredditArr = new Set([]);

async function fetchSubReddit(sub) {
	try {
		const res = await fetch(`https://www.reddit.com/r/${sub}.json`);
		if (!res.ok) {
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
			const json = await res.json();
			const data = json.data;
			if (data) {
				const children = data.children.map((post) => {
					const data = post.data;
					return {
						id: data.id,
						title: data.title,
						author: data.author_fullname,
						ups: data.ups,
						post_url: data.url,
					};
				});
				const isFound = subredditData.findIndex((obj) => obj.subreddit === sub);
				if (isFound > -1) {
					subredditData[isFound].posts = children;
					refreshPosts(subredditData[isFound]);
				} else {
					statusBox.style.visibility = "visible";
					statusBox.style.opacity = 1;
					statusBox.textContent = "Subreddit found!";
					statusBox.style.color = "#00df56";
					inputBox.style.outline = "1px solid #00df56";
					inputBox.style.color = "#00df56";
					const rData = {
						subreddit: newSub || sub,
						url: `https://www.reddit.com/r/${newSub}`,
						posts: children,
					};
					subredditData.push(rData);
					createSubreddit(rData);
				}
				subredditArr.add(newSub || sub);
				setTimeout(() => {
					dialog.style.visibility = "hidden";
					dialog.style.opacity = 0;
					statusBox.textContent = "";
					inputBox.style.outline = "none";
					inputBox.style.color = "black";
					inputBox.value = "";
					localStorage.setItem("subs", [...subredditArr]);
				}, 500);
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
	if (document.body.classList.contains("dark-theme")) {
		inputBox.style.color = "white";
	} else {
		inputBox.style.color = "black";
	}
	const exists = [...subredditArr].some((sub) => sub === e.target.value);
	if (!exists) {
		newSub = e.target.value;
		if (e.target.value.trim() === "") {
			newSubBtn.disabled = true;
		} else {
			newSubBtn.disabled = false;
		}
	} else {
		statusBox.textContent = `Subreddit already added!`;
		inputBox.style.outline = "1px solid red";
		inputBox.style.color = "red";
		statusBox.style.visibility = "visible";
		statusBox.style.color = "red";
		statusBox.style.opacity = 1;
		newSubBtn.disabled = true;
	}
});

addBtn.addEventListener("click", () => {
	dialog.style.visibility = "visible";
	dialog.style.opacity = 1;
	newSubBtn.disabled = true;
	setTimeout(() => {
		inputBox.focus();
	}, 200);
});

dialog.firstElementChild.addEventListener("submit", (e) => {
	e.preventDefault();
});
closeBtn.addEventListener("click", () => {
	dialog.style.visibility = "hidden";
	dialog.style.opacity = 0;
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

window.addEventListener("DOMContentLoaded", () => {
	const saveFound = localStorage.getItem("subs");
	if (saveFound) {
		const localSubs = saveFound.split(",");
		if (localSubs.length === 0) {
			subrFallback.style.visibility = "visible";
			subrFallback.style.opacity = 1;
		} else {
			localSubs.forEach((sub) => {
				fetchSubReddit(sub);
			});
			subrFallback.style.visibility = "hidden";
			subrFallback.style.opacity = 0;
		}
	}
});

function refreshPosts(obj) {
	const subreddit = document.getElementById(`${obj.subreddit}`);
	if (subreddit) {
		const postContainer = subreddit.querySelector(".posts");
		postContainer.innerHTML = "";
		obj.posts.forEach((post) => {
			const li = createPost(post);
			postContainer.append(li);
		});
	}
}

function createPost(post) {
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
	return li;
}

function createFallback() {
	const lpost = document.createElement("div");
	lpost.setAttribute("class", "loading-post");
	const lc = document.createElement("div");
	lc.setAttribute("class", "loading-count");
	const img = document.createElement("img");
	img.src = "./assets/up-arrow-svgrepo-com.svg";
	img.alt = "upvote-icon";
	img.width = "20";
	img.height = "20";
	const lcr = document.createElement("div");
	lcr.setAttribute("class", "loading-counter");
	lc.append(img);
	lc.append(lcr);
	const h = document.createElement("header");
	h.setAttribute("class", "loading-header");
	const u = document.createElement("div");
	u.setAttribute("class", "loading-user");
	const p = document.createElement("div");
	p.setAttribute("class", "loading-post");
	h.append(u);
	h.append(p);
	lpost.append(lc);
	lpost.append(h);
	return lpost;
}

function createSubreddit(obj) {
	if (obj) {
		//Subreddit
		const subReddit = document.createElement("div");
		subReddit.setAttribute("class", "subreddit");
		subReddit.setAttribute("id", obj.subreddit);
		subReddit.style.animationDuration = "0.85s";
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
			loading.style.display = "flex";
			setTimeout(() => {
				loading.style.display = "none";
			}, 1000);
			fetchSubReddit(obj.subreddit);
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
				removeSubreddit(obj.subreddit);
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
		const postContainer = document.createElement("div");
		postContainer.setAttribute("class", "post-container");
		const ul = document.createElement("ul");
		ul.setAttribute("class", "posts");
		const loading = document.createElement("div");
		loading.setAttribute("class", "loading");
		const lposts = Array.from({ length: 15 }, () => createFallback());
		loading.append(...lposts);
		ul.append(loading);
		obj.posts.forEach((post) => {
			const li = createPost(post);
			ul.append(li);
		});
		postContainer.append(ul);
		postContainer.append(loading);
		subReddit.append(postContainer);
		subrContainer.append(subReddit);
	}
	setTimeout(() => {
		subrContainer.scrollLeft =
			subrContainer.scrollWidth - subrContainer.clientWidth;
	}, 850);
	if (subredditData.length > 0) {
		subrFallback.style.visibility = "hidden";
		subrFallback.style.opacity = 0;
	}
}

function removeSubreddit(subr) {
	const index = subredditData.findIndex((sub) => sub.subreddit === subr);
	if (index === -1) {
		subredditData.splice(index, 1);
		const subReddit = document.getElementById(`sub`);
		if (subReddit) {
			subrContainer.removeChild(subReddit);
		}
	}
	setTimeout(() => {
		if (subredditData.length === 0) {
			subrFallback.style.visibility = "visible";
			subrFallback.style.opacity = 1;
		}
		//Removes the deleted item from localStorage
		localStorage.setItem("subs", [...subredditArr]);
	}, 250);
}
