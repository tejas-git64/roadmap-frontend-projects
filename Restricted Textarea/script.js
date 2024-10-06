const comments = document.getElementById("comments");
const count = document.querySelector(".count");

comments.addEventListener("input", function (e) {
	const chars = e.target.value.length;
	count.innerHTML = `${chars}/250`;
	if (chars === 250) {
		comments.style.border = "1px solid red";
		comments.style.borderBottom = "none";
		comments.style.color = "red";
		count.style.border = "1px solid red";
		count.style.borderTop = "none";
		count.style.color = "red";
	} else {
		comments.style.border = "1px solid #aaa";
		comments.style.borderBottom = "none";
		comments.style.color = "black";
		count.style.border = "1px solid #aaa";
		count.style.borderTop = "none";
		count.style.color = "black";
	}
});
