'use strict';

const STORAGE_KEY = 'bookDB';
const PAGE_SIZE = 5;
var gPageIdx = 0;

var gBooks;
var gFilterBy = { maxPrice: 100, minRate: 0, txt: '' };
var gUpdatedBookId;
var gReadBookId;

_createBooks();

function getBooksForDisplay() {
    // filter by range
    var books = gBooks.filter(
        (book) =>
            book.price <= gFilterBy.maxPrice && book.rate >= gFilterBy.minRate
    );
    // filter by txt
    books = books.filter((book) =>
        book.name.toLowerCase().includes(gFilterBy.txt.toLocaleLowerCase())
    );
    // paging-when some filter on-paging disabled
    if (gFilterBy.maxPrice < 100 || gFilterBy.minRate > 0 || gFilterBy.txt) {
        hidePagingPanel();
        return books;
    }
    showPagingPanel();
    const startIdx = gPageIdx * PAGE_SIZE;
    books = books.slice(startIdx, startIdx + PAGE_SIZE);
    return books;
}

function nextPage() {
    gPageIdx++;
    updatePageDisplay(gPageIdx);
    unableBtn('.prev');
    if ((gPageIdx + 1) * PAGE_SIZE >= gBooks.length) {
        disableBtn('.next');
        return;
    }
}

function prevPage() {
    gPageIdx--;
    updatePageDisplay(gPageIdx);
    unableBtn('.next');
    if (gPageIdx * PAGE_SIZE <= 0) {
        disableBtn('.prev');
        return;
    }
}

function setBookFilter(filterBy = {}) {
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice;
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate;
    if (filterBy.txt !== undefined) gFilterBy.txt = filterBy.txt;
    return gFilterBy;
}

function updateRate(bookId, diff) {
    var book = gBooks.find((book) => bookId === book.id);
    console.log(diff);
    book.rate += diff;
    _saveBooksToStorage();
}

function updateBook(bookId, newPrice) {
    console.log(bookId);
    const book = gBooks.find((book) => bookId === book.id);
    if (newPrice === book.price) return;
    book.price = newPrice;
    _saveBooksToStorage();
    return book;
}

function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex((book) => (bookId = book.id));
    gBooks.splice(bookIdx, 1);
    _saveBooksToStorage();
}

function addBook(title, price) {
    const book = _createBook();
    book.name = title;
    book.price = price;
    gBooks.unshift(book);
    _saveBooksToStorage();
    return book;
}

function getBookById(bookId) {
    const book = gBooks.find((book) => bookId === book.id);
    return book;
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY);

    if (!books || !books.length) {
        books = [];
        for (let i = 0; i < 25; i++) {
            books.push(_createBook(i + 1));
        }
    }
    gBooks = books;
    _saveBooksToStorage();
}

function _createBook(num) {
    return {
        id: makeId(),
        name: `Book-${num}`,
        price: getRandomIntInclusive(5, 100),
        imgUrl: `book-${num}.jpg`,
        rate: getRandomIntInclusive(0, 10),
        description: makeLorem(),
    };
}

function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks);
}
