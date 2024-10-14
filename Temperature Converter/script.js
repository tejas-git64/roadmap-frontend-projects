const tempForm = document.querySelector(".converter-form");
const temp = document.getElementById("temp");
const fromUnit = document.getElementById("from_unit");
const toUnit = document.getElementById("to_unit");
const convertBtn = document.querySelector(".convert-btn");
const resultTag = document.querySelector(".result");

function convertTemp(temp, from, to) {
	if (from === "Celsius" && to === "Fahrenheit") {
		return 1.8 * temp + 32;
	} else if (from === "Celsius" && to === "Kelvin") {
		return temp + 273.15;
	} else if (from === "Fahrenheit" && to === "Celsius") {
		return (5 / 9) * (temp - 32);
	} else if (from === "Fahrenheit" && to === "Kelvin") {
		return (5 / 9) * (temp - 32) + 273.15;
	} else if (from === "Kelvin" && to === "Celsius") {
		return temp - 273.15;
	} else if (from === "Kelvin" && to === "Fahrenheit") {
		return 1.8 * (temp - 273.15) + 32;
	} else {
		return temp;
	}
}

function toggleBtn(e) {
	if (e.target.value && fromUnit.value && toUnit.value) {
		convertBtn.disabled = false;
	} else {
		convertBtn.disabled = true;
	}
}

tempForm.addEventListener("submit", (e) => e.preventDefault());

temp.addEventListener("input", (e) => {
	toggleBtn(e);
});

[fromUnit, toUnit].forEach((unit) => {
	unit.addEventListener("change", (e) => {
		toggleBtn(e);
	});
});

convertBtn.addEventListener("click", () => {
	if (temp.value && fromUnit.value && toUnit.value) {
		const result = convertTemp(
			Number(temp.value),
			fromUnit.value,
			toUnit.value
		);
		const comment = `${temp.value} ${fromUnit.value} is ${result} ${toUnit.value}`;
		resultTag.style.visibility = "visible";
		resultTag.style.opacity = 1;
		resultTag.textContent = comment;
	} else {
		convertBtn.disabled = true;
	}
});
