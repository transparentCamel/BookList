let bookList = JSON.parse(localStorage.getItem("book-list")) || [];
const nav = document.querySelector("nav");
const body = document.querySelector("body");
const noBooksContainer = document.createElement("div");
const menu = document.querySelector("#menu");

function backgroundBlur() {
	const bodyEl = document.querySelectorAll(
		"body > :not(.popUp,.editPopUp):not(.popUp, .editPopUp *)"
	);
	for (let i = 0; i < bodyEl.length; i++) {
		bodyEl[i].style.filter = "blur(20px)";
	}
}

function popUpVisible() {
	const popUp = document.querySelector(".popUp");
	popUp.style.display = "flex";
}
function editPopUpVisible() {
	const editPopUp = document.querySelector(".editPopUp");
	editPopUp.style.display = "flex";
}

function checkLocalStorage() {
	nav.style.zIndex = "9999";
	const bookContainers = document.querySelectorAll(".bookContainer");
	for (let i = 0; i < bookContainers.length; i++) {
		bookContainers[i].remove();
	}
	if (bookList.length === 0) {
		const errorMessage = document.createElement("h2");
		errorMessage.classList.add("noBooks");
		errorMessage.innerText = "There are no books added";
		noBooksContainer.prepend(errorMessage);
		if (!document.querySelector(".addBtn")) {
			addBook();
		}
	} else {
		if (document.querySelector(".noBooks")) {
			document.querySelector(".noBooks").remove();
		}
		for (let i = 0; i < bookList.length; i++) {
			const bookData = bookList[i][Object.keys(bookList[i])[0]];
			bookDiv(bookData);
		}

		if (!document.querySelector(".addBtn")) {
			addBook();
		}
	}
}

function addBook() {
	const addBookBtn = document.createElement("button");
	addBookBtn.innerText = "Add a book";
	addBookBtn.classList.add("addBtn");
	const addBtnContainer = document.createElement("div");
	addBtnContainer.classList.add("addContainer");
	document.body.append(addBtnContainer);
	addBtnContainer.append(addBookBtn);
	noBooksContainer.append(addBtnContainer);
	document.body.append(noBooksContainer);

	addBookBtn.addEventListener("click", () => {
		popUpVisible();
		backgroundBlur();
	});
}

function popUpInvisible() {
	const popUp = document.querySelector(".popUp");
	popUp.style.display = "none";
	const bodyEl = document.querySelectorAll("body > :not(.popUp):not(.popUp *)");
	for (let i = 0; i < bodyEl.length; i++) {
		bodyEl[i].style.filter = "blur(0px)";
	}
}

function editPopUpInvisible() {
	const editPopUp = document.querySelector(".editPopUp");
	editPopUp.style.display = "none";
	const bodyEl = document.querySelectorAll(
		"body > :not(.editPopUp):not(.editPopUp *)"
	);
	for (let i = 0; i < bodyEl.length; i++) {
		bodyEl[i].style.filter = "blur(0px)";
	}
}

function closeForm() {
	const x = document.querySelectorAll(".close");
	x.forEach((element) => {
		element.addEventListener("click", () => {
			popUpInvisible();
			editPopUpInvisible();
		});
	});
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

function fetchEditFormData() {
	const bookName = document.querySelector("#editbookName").value;
	const author = document.querySelector("#editauthor").value;
	const category = document.querySelector("#editcategory").value;
	const year = document.querySelector("#edityear").value;
	const price = document.querySelector("#editprice").value;
	const imgUrl = document.querySelector("#editimgUrl").value;

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

	const existingBookIndex = bookList.findIndex(
		(book) => Object.keys(book)[0] === bookName
	);

	if (existingBookIndex === -1) {
		bookList.push({ [bookName]: formData });
	} else {
		bookList[existingBookIndex][bookName] = formData;
	}

	localStorage.setItem("book-list", JSON.stringify(bookList));
}

function formValidation() {
	const form = document.querySelector(".addBookForm");
	form.addEventListener("submit", (e) => {
		e.preventDefault();
		const formData = fetchFormData();
		for (const value of Object.values(formData)) {
			if (value === "") {
				alert("Please fill in all fields");
				return;
			}
		}
		pushData(formData);
		popUpInvisible();
		checkLocalStorage();
		form.reset();
	});
}
function editForm(bookName) {
	const bookData = bookList.find((book) => Object.keys(book)[0] === bookName)[
		bookName
	];

	document.querySelector("#editbookName").value = bookData.bookName;
	document.querySelector("#editauthor").value = bookData.author;
	document.querySelector("#editcategory").value = bookData.category;
	document.querySelector("#edityear").value = bookData.year;
	document.querySelector("#editprice").value = bookData.price;
	document.querySelector("#editimgUrl").value = bookData.imgUrl;

	editPopUpVisible();
	backgroundBlur();
}
function editFormValidation(bookName) {
	const form = document.querySelector(".editBookForm");
	form.addEventListener("submit", (e) => {
		e.preventDefault();

		const formData = fetchEditFormData();
		for (const value of Object.values(formData)) {
			if (value === "") {
				alert("Please fill in all fields");
				return;
			}
		}

		const existingBookIndex = bookList.findIndex(
			(book) => Object.keys(book)[0] === bookName
		);
		const newBookName = document.querySelector("#editbookName").value; // Get the new book name from the form input
		if (existingBookIndex !== -1) {
			bookList[existingBookIndex][newBookName] =
				bookList[existingBookIndex][bookName];
			delete bookList[existingBookIndex][bookName];
			bookList[existingBookIndex][newBookName] = formData;
			localStorage.setItem("book-list", JSON.stringify(bookList));
			editPopUpInvisible();
			checkLocalStorage();
		}
	});
}

function deleteFunc(deleteBtn, bookName, author) {
	deleteBtn.addEventListener("click", () => {
		const updatedBookList = bookList.filter(
			(book) => Object.keys(book)[0] !== bookName && author
		);
		localStorage.setItem("book-list", JSON.stringify(updatedBookList));
		checkLocalStorage();
		location.reload();
	});
}
function createDeleteBtn(bookContainer, bookName, author) {
	const deleteBtn = document.createElement("button");
	deleteBtn.classList.add("deleteBtn");
	bookContainer.append(deleteBtn);
	deleteBtn.textContent = "Delete";
	deleteFunc(deleteBtn, bookName, author);
}

function editFunc(editBtn, bookName) {
	editBtn.addEventListener("click", () => {
		editForm(bookName);
		editFormValidation(bookName);
		backgroundBlur();
		editPopUpVisible();
	});
}

function createEditBtn(bookContainer, bookName) {
	const editBtn = document.createElement("button");
	editBtn.classList.add("editBtn");
	bookContainer.append(editBtn);
	editBtn.textContent = "Edit";
	editFunc(editBtn, bookName);
}

function createImgContainer(bookContainer, bookData) {
	const bookImg = document.createElement("img");
	bookContainer.prepend(bookImg);
	bookImg.src = bookData.imgUrl;
}
function createPrice(bookContainer, bookData) {
	const priceEl = document.createElement("p");
	priceEl.classList.add("priceEl");
	bookContainer.append(priceEl);
	priceEl.textContent = `Price: ${bookData.price} $`;
}
function createYear(bookContainer, bookData) {
	const yearEl = document.createElement("p");
	yearEl.classList.add("yearEl");
	bookContainer.append(yearEl);
	yearEl.textContent = `Year: ${bookData.year}`;
}

function createCategory(bookContainer, bookData) {
	const categoryEl = document.createElement("p");
	categoryEl.classList.add("categoryEl");
	bookContainer.append(categoryEl);
	categoryEl.textContent = `Category: ${bookData.category}`;
}

function createAuthor(bookContainer, bookData) {
	const authorEl = document.createElement("p");
	authorEl.classList.add("authorEl");
	bookContainer.append(authorEl);
	authorEl.textContent = `Author: ${bookData.author}`;
}

function crreateName(bookContainer, bookData) {
	const bookNameEl = document.createElement("h3");
	bookContainer.append(bookNameEl);
	bookNameEl.textContent = bookData.bookName;
}

function bookDiv(bookData) {
	const listContainer = document.querySelector("#listContainer");
	const bookContainer = document.createElement("div");
	const imgDiv = document.createElement("div");
	imgDiv.classList.add("imgDiv");
	const btnDiv = document.createElement("div");
	btnDiv.classList.add("btnDiv");
	const textDiv = document.createElement("div");
	textDiv.classList.add("textDiv");
	bookContainer.classList.add("bookContainer");
	listContainer.append(bookContainer);

	bookContainer.append(imgDiv);

	crreateName(bookContainer, bookData);
	createAuthor(textDiv, bookData);
	createCategory(textDiv, bookData);
	createYear(textDiv, bookData);
	createPrice(textDiv, bookData);
	createImgContainer(imgDiv, bookData);
	createEditBtn(btnDiv, bookData.bookName);
	createDeleteBtn(btnDiv, bookData.bookName, bookData.author);

	bookContainer.append(textDiv);
	bookContainer.append(btnDiv);
}
const hiLoElements = document.querySelectorAll(".hiLo");
function sortHiLo() {
	if (!bookList || bookList.length === 0) {
		return;
	}
	bookList = bookList.sort(
		(a, b) => b[Object.keys(b)[0]].price - a[Object.keys(a)[0]].price
	);
	localStorage.setItem("book-list", JSON.stringify(bookList));
	checkLocalStorage();
	menu.style.transform = "translateY(-160px)";
}

hiLoElements.forEach((hiLoElement) => {
	hiLoElement.addEventListener("click", sortHiLo);
});

const loHiElements = document.querySelectorAll(".loHi");

function sortLoHi() {
	if (!bookList || bookList.length === 0) {
		return;
	}
	bookList = bookList.sort(
		(a, b) => a[Object.keys(a)[0]].price - b[Object.keys(b)[0]].price
	);
	localStorage.setItem("book-list", JSON.stringify(bookList));
	checkLocalStorage();
	menu.style.transform = "translateY(-160px)";
}

loHiElements.forEach((loHiElement) => {
	loHiElement.addEventListener("click", sortLoHi);
});

function sortCategoryDesc() {
	if (!bookList || bookList.length === 0) {
		return;
	}
	bookList.sort((a, b) =>
		b[Object.keys(b)[0]].category.localeCompare(a[Object.keys(a)[0]].category)
	);
	localStorage.setItem("book-list", JSON.stringify(bookList));
	checkLocalStorage();
	menu.style.transform = "translateY(-160px)";
}

const categoryEls = document.querySelectorAll(".category");

categoryEls.forEach((el) => {
	el.addEventListener("click", sortCategoryDesc);
});

function sortAuthorDesc() {
	if (!bookList || bookList.length === 0) {
		return;
	}
	bookList.sort((a, b) =>
		b[Object.keys(b)[0]].author.localeCompare(a[Object.keys(a)[0]].author)
	);
	localStorage.setItem("book-list", JSON.stringify(bookList));
	checkLocalStorage();
	menu.style.transform = "translateY(-160px)";
}

const authorEls = document.querySelectorAll(".author");

authorEls.forEach((el) => {
	el.addEventListener("click", sortAuthorDesc);
});

function searchResult(matches) {
	nav.style.zIndex = "9999";
	const bookContainers = document.querySelectorAll(".bookContainer");
	for (let i = 0; i < bookContainers.length; i++) {
		bookContainers[i].remove();
	}
	if (matches.length === 0) {
		const errorMessage = document.createElement("h2");
		errorMessage.classList.add("noBooks");
		errorMessage.innerText = "There are no books matching your search";
		noBooksContainer.prepend(errorMessage);
		if (!document.querySelector(".addBtn")) {
			addBook();
		}
	} else {
		if (document.querySelector(".noBooks")) {
			document.querySelector(".noBooks").remove();
		}
		for (let i = 0; i < matches.length; i++) {
			const bookData = matches[i][Object.keys(matches[i])[0]];
			bookDiv(bookData);
		}

		if (!document.querySelector(".addBtn")) {
			addBook();
		}
	}
}

function search() {
	const inputs = document.querySelectorAll(".searchInput");
	const nonEmptyValues = Array.from(inputs)
		.map((input) => input.value.trim())
		.filter((value) => value !== "");

	const matches = bookList.filter(
		(book) =>
			book[Object.keys(book)[0]].bookName
				.toLowerCase()
				.includes(nonEmptyValues.map((value) => value.toLowerCase())) ||
			book[Object.keys(book)[0]].author
				.toLowerCase()
				.includes(nonEmptyValues.map((value) => value.toLowerCase())) ||
			book[Object.keys(book)[0]].category
				.toLowerCase()
				.includes(nonEmptyValues.map((value) => value.toLowerCase())) ||
			book[Object.keys(book)[0]].year.toString().includes(nonEmptyValues) ||
			book[Object.keys(book)[0]].price.toString().includes(nonEmptyValues)
	);
	menu.style.transform = "translateY(-160px)";

	searchResult(matches);
	const searchInputs = document.querySelectorAll(".searchInput");
	searchInputs.forEach((input) => {
		input.value = "";
	});
}

const searchBtn = document.querySelectorAll(".searchBtn");
searchBtn.forEach((element) => {
	element.addEventListener("click", search);
});

const logo = document.querySelector("#logo");
logo.addEventListener("click", () => {
	location.reload();
});

const filterliMobile = document.querySelector("#filterliMobile");
const filterUp = document.querySelector("#filterUp");
const filterDown = document.querySelector("#filterDown");

filterliMobile.addEventListener("click", () => {
	const filterDropMobileList = document.querySelectorAll(".filterDropMobile");
	filterDropMobileList.forEach((filterDropMobile) => {
		if (filterDropMobile.style.display === "flex") {
			filterDropMobile.style.display = "none";
			filterDown.style.cssText = "display: none !important;";
			filterUp.style.cssText = "display: block !important;";
		} else {
			filterDropMobile.style.display = "flex";
			filterDown.style.cssText = "display: block !important;";
			filterUp.style.cssText = "display: none !important;";
		}
	});
});

const sortliMobile = document.querySelector("#sortliMobile");
const sortDown = document.querySelector("#sortDown");
const sortUp = document.querySelector("#sortUp");

sortliMobile.addEventListener("click", () => {
	const sortDropMobileList = document.querySelectorAll(".sortDropMobile");
	sortDropMobileList.forEach((sortDropMobile) => {
		if (sortDropMobile.style.display === "flex") {
			sortDropMobile.style.display = "none";
			sortDown.style.cssText = "display: block !important;";
			sortUp.style.cssText = "display: none !important;";
		} else {
			sortDropMobile.style.display = "flex";
			sortDown.style.cssText = "display: none !important;";
			sortUp.style.cssText = "display: block !important;";
		}
	});
});

const hamburger = document.querySelector("#hamburger");

hamburger.addEventListener("click", () => {
	if (menu.style.transform === "translateY(412px)") {
		menu.style.transform = "translateY(-160px)";
	} else {
		menu.style.transform = "translateY(412px)";
		const sortDropMobileList = document.querySelectorAll(".sortDropMobile");
		sortDropMobileList.forEach((sortDropMobile) => {
			sortDropMobile.style.display = "none";
			sortDown.style.cssText = "display: block !important;";
			sortUp.style.cssText = "display: none !important;";
		});
		const filterDropMobileList = document.querySelectorAll(".filterDropMobile");

		filterDropMobileList.forEach((filterDropMobile) => {
			filterDropMobile.style.display = "none";
			filterDown.style.cssText = "display: none !important;";
			filterUp.style.cssText = "display: block !important;";
		});
	}
});

formValidation();
closeForm();

window.onload = function () {
	checkLocalStorage();
};
