const btns = document.querySelectorAll(".faq-btn");
const faqs = document.querySelectorAll(".faq");

btns.forEach((btn, i) =>
	btn.addEventListener("click", () => {
		faqs[i].classList.toggle("expanded");
	})
);
