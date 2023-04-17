const nav = document.querySelector("nav");
const body = document.querySelector("body");
const noBooksContainer = document.createElement("div");

function backgroundBlur() {
	const bodyEl = document.querySelectorAll("body > :not(.popUp):not(.popUp *)");
	for (let i = 0; i < bodyEl.length; i++) {
		bodyEl[i].style.filter = "blur(20px)";
	}
}

function popUpVisible() {
	const popUp = document.querySelector(".popUp");
	popUp.style.display = "flex";
}

function checkLocalStorage() {
	const bookList = JSON.parse(localStorage.getItem("book-list")) || [];
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

function closeForm() {
	const x = document.querySelector("#close");
	x.addEventListener("click", () => {
		popUpInvisible();
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

function pushData(formData) {
	const bookName = formData.bookName;
	const bookList = JSON.parse(localStorage.getItem("book-list")) || [];
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

function deleteFunc(deleteBtn, bookName, author) {
	deleteBtn.addEventListener("click", () => {
		const bookList = JSON.parse(localStorage.getItem("book-list")) || [];
		const updatedBookList = bookList.filter(
			(book) => Object.keys(book)[0] !== bookName && author
		);
		localStorage.setItem("book-list", JSON.stringify(updatedBookList));
		checkLocalStorage();
	});
}
function createDeleteBtn(bookContainer, bookName, author) {
	const deleteBtn = document.createElement("button");
	deleteBtn.classList.add("deleteBtn");
	bookContainer.append(deleteBtn);
	deleteBtn.textContent = "Delete";
	deleteFunc(deleteBtn, bookName, author);
}

function editFunc(editBtn) {
	editBtn.addEventListener("click", () => {});
}

function createEditBtn(bookContainer) {
	const editBtn = document.createElement("button");
	editBtn.classList.add("editBtn");
	bookContainer.append(editBtn);
	editBtn.textContent = "Edit";
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
	priceEl.textContent = `Price: ${bookData.price}`;
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
	createEditBtn(btnDiv);
	createDeleteBtn(btnDiv, bookData.bookName, bookData.author);

	bookContainer.append(textDiv);
	bookContainer.append(btnDiv);
}
const hiLo = document.querySelector(".hiLo");
function sortHiLo() {
	let bookList = JSON.parse(localStorage.getItem("book-list"));
	if (!bookList || bookList.length === 0) {
		return;
	}
	bookList = bookList.sort(
		(a, b) => b[Object.keys(b)[0]].price - a[Object.keys(a)[0]].price
	);
	localStorage.setItem("book-list", JSON.stringify(bookList));
	checkLocalStorage();
}

hiLo.addEventListener("click", sortHiLo);

const loHi = document.querySelector(".loHi");

function sortLoHi() {
	let bookList = JSON.parse(localStorage.getItem("book-list"));
	if (!bookList || bookList.length === 0) {
		return;
	}
	bookList = bookList.sort(
		(a, b) => a[Object.keys(a)[0]].price - b[Object.keys(b)[0]].price
	);
	localStorage.setItem("book-list", JSON.stringify(bookList));
	checkLocalStorage();
}

loHi.addEventListener("click", sortLoHi);

function sortCategoryDesc() {
	let bookList = JSON.parse(localStorage.getItem("book-list"));
	if (!bookList || bookList.length === 0) {
		return;
	}
	bookList.sort((a, b) =>
		b[Object.keys(b)[0]].category.localeCompare(a[Object.keys(a)[0]].category)
	);
	localStorage.setItem("book-list", JSON.stringify(bookList));
	checkLocalStorage();
}

const category = document.querySelector(".category");
category.addEventListener("click", sortCategoryDesc);

function sortAuthorDesc() {
	let bookList = JSON.parse(localStorage.getItem("book-list"));
	if (!bookList || bookList.length === 0) {
		return;
	}
	bookList.sort((a, b) =>
		b[Object.keys(b)[0]].author.localeCompare(a[Object.keys(a)[0]].author)
	);
	localStorage.setItem("book-list", JSON.stringify(bookList));
	checkLocalStorage();
}

const author = document.querySelector(".author");
author.addEventListener("click", sortAuthorDesc);

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
	const input = document.querySelector("#searchInput").value;
	const books = JSON.parse(localStorage.getItem("book-list"));
	const matches = books.filter(
		(book) =>
			book[Object.keys(book)[0]].bookName
				.toLowerCase()
				.includes(input.toLowerCase()) ||
			book[Object.keys(book)[0]].author
				.toLowerCase()
				.includes(input.toLowerCase()) ||
			book[Object.keys(book)[0]].category
				.toLowerCase()
				.includes(input.toLowerCase()) ||
			book[Object.keys(book)[0]].year.toString().includes(input) ||
			book[Object.keys(book)[0]].price.toString().includes(input)
	);

	searchResult(matches);
	document.querySelector("#searchInput").value = "";
}

const searchBtn = document.querySelector(".searchBtn");
searchBtn.addEventListener("click", search);

const logo = document.querySelector("#logo");
logo.addEventListener("click", checkLocalStorage);

formValidation();
closeForm();

window.onload = function () {
	checkLocalStorage();
};
