function backgroundBlur() {
	const bodyEl = document.querySelectorAll(
		"body > :not(.popUp), body > :not(.popUp) *"
	);
	for (let i = 0; i < bodyEl.length; i++) {
		bodyEl[i].style.filter = "blur(20px)";
	}
}

function popUpVisible() {
	const popUp = document.querySelector(".popUp");
	popUp.style.display = "flex";
	backgroundBlur();
}

function addBook() {
	const addBtn = document.querySelector(".addBtn");
	addBtn.addEventListener("click", popUpVisible);
}

addBook();
