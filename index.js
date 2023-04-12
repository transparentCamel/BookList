function backgroundBlur() {
	const bodyEl = document.querySelectorAll("body > :not(.popUp):not(.popUp *)");
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

function fetchFormData() {
	const bookName = document.querySelector("#bookName").value;
	const author = document.querySelector("#author").value;
	const category = document.querySelector("#category").value;
	const year = document.querySelector("#year").value;
	const price = document.querySelector("#price").value;
	const imgUrl = document.querySelector("#imgUrl").value;

	return {
		bookName,
		author,
		category,
		year,
		price,
		imgUrl,
	};
}

function pushData(formData) {
	const bookName = formData.bookName;
	localStorage.setItem(`${bookName}`, JSON.stringify(formData));
}

function formValidation() {
	const form = document.querySelector(".addBookForm");
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		pushData(fetchFormData());
	});
}

addBook();
formValidation();
