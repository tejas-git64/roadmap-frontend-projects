const acceptBtn = document.querySelector(".accept-btn");
const denyBtn = document.querySelector(".deny-btn");
const cookieDialog = document.querySelector(".cookie-box");

acceptBtn.addEventListener("click", () => {
	localStorage.setItem(
		"user_cookie",
		JSON.stringify({
			id: (Math.random(0, 100) * 100).toFixed(3),
			accepted: true,
		})
	);
	if (cookieDialog.classList.contains("intro-animation")) {
		cookieDialog.classList.remove("intro-animation");
		setTimeout(() => {
			cookieDialog.classList.add("outro-animation");
		}, 500);
	}
	setTimeout(() => {
		cookieDialog.style.display = "none";
	}, 1000);
});

denyBtn.addEventListener("click", () => {
	localStorage.setItem(
		"user_cookie",
		JSON.stringify({
			id: Math.floor(Math.random(0, 100) * 100),
			accepted: false,
		})
	);
	if (cookieDialog.classList.contains("intro-animation")) {
		cookieDialog.classList.remove("intro-animation");
		setTimeout(() => {
			cookieDialog.classList.add("outro-animation");
		}, 500);
	}
	setTimeout(() => {
		cookieDialog.style.display = "none";
	}, 1000);
});

window.addEventListener("load", function () {
	if (localStorage.length !== 0) {
		const cookie = JSON.parse(localStorage.getItem("user_cookie"));
		if (cookie) {
			cookieDialog.style.display = "none";
			return;
		}
	}
	cookieDialog.style.display = "flex";
	cookieDialog.classList.add("intro-animation");
});
