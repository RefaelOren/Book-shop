'use strict';

var gSwitchDisplay = 'table';

function onInit() {
    renderFilterByQueryStringParams();
    renderBooks();
    doTrans();
}

function onSetFilterBy(filterBy) {
    filterBy = setBookFilter(filterBy);
    renderBooks();
    setQueryParams();
}

function onSetFilterByTxt(txt) {
    setBookFilter(txt);
    gFilterBy.txt = txt;
    renderBooks();
    setQueryParams();
}

function setQueryParams() {
    const queryStringParams = `?maxPrice=${getFilterBy().maxPrice}&minRate=${
        getFilterBy().minRate
    }&txt=${
        getFilterBy().txt
    }&lang=${getCurrLang()}&modal=${getReadModalStat()}`;
    const newUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname +
        queryStringParams;
    window.history.pushState({ path: newUrl }, '', newUrl);
}

function onDeleteBook(bookId) {
    deleteBook(bookId);
    renderBooks();
}

function onAddBook(ev) {
    ev.preventDefault();
    const elTitle = document.querySelector('[name=title]');
    const title = elTitle.value;
    const elPrice = document.querySelector('[name=price]');
    const price = elPrice.value;
    if (!title || !price) return;
    if (price > 100) {
        alert('Max price in our shop is 100$');
        return;
    }
    addBook(title, price);
    renderBooks();
    elTitle.value = '';
    onCloseAddModal();
}

function onUpdateBook(ev) {
    ev.preventDefault();
    const bookPrice = document.querySelector('[name=updated-price]').value;
    if (!bookPrice) return;
    var bookId = getUpdatedBookId();
    updateBook(bookId, bookPrice);
    document.querySelector('.update-modal').classList.remove('open');
    renderBooks();
}

function onReadBook(bookId) {
    setReadBookId(bookId);
    setReadModalStat(true);
    renderReadBook(bookId);
    setQueryParams();
}

function renderReadBook(bookId) {
    var book = getBookById(bookId);
    var elReadModal = document.querySelector('.read-modal');
    elReadModal.querySelector('h2').innerText = book.name;
    elReadModal.querySelector('h3').innerHTML = getPrice(book.price);
    elReadModal.querySelector('.description').innerText = book.description;
    elReadModal.querySelector('.rate span').innerText = book.rate;
    elReadModal.querySelector(
        '.img-container'
    ).innerHTML = `<img onerror="this.src='img/book.png'" src="img/${book.imgUrl}" alt="book cover"> `;
    elReadModal.classList.add('open');
}

function onOpenUpdateBookModal(bookId) {
    document.querySelector('.update-modal').classList.toggle('open');
    setUpdatedBookId(bookId);
}

function onChangeRate(diff) {
    console.log('hey');
    console.log(diff);
    var elRate = document.querySelector('.rate span');
    if (
        (+elRate.innerText === 10 && diff > 0) ||
        (+elRate.innerText === 0 && diff < 0)
    ) {
        alert('Rate range is: 0-10!');
        return;
    }
    elRate.innerText = +elRate.innerText + diff;
    updateRate(gReadBookId, diff);
    renderBooks();
}

function onOpenAddModal() {
    document.querySelector('.add-modal').classList.add('open');
}

function onCloseAddModal() {
    document.querySelector('.add-modal').classList.remove('open');
}

function onCloseReadModal() {
    document.querySelector('.read-modal').classList.remove('open');
    setReadModalStat(false);
    setQueryParams();
}

function onCloseUpdateModal() {
    document.querySelector('.update-modal').classList.remove('open');
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search);
    var currLang = getCurrLang();
    currLang = queryStringParams.get('lang') || 'en';
    var readModalStat = getReadModalStat();
    readModalStat = queryStringParams.get('modal') || 'false';
    var filterBy = getFilterBy();
    filterBy = {
        maxPrice: queryStringParams.get('maxPrice') || 100,
        minRate: +queryStringParams.get('minRate') || 0,
        txt: queryStringParams.get('txt') || '',
    };
    if (!filterBy.maxPrice && !filterBy.minSpeed && !filterBy.txt) return;

    document.querySelector('.filter-price-range').value = filterBy.maxPrice;
    document.querySelector('.filter-rate-range').value = filterBy.minRate;
    setBookFilter(filterBy);
    document.querySelector('.search').value = filterBy.txt;
    document.querySelector('select').value = currLang;
    console.log(readModalStat);
    console.log(getReadModalStat());
    if (getReadModalStat()) {
        renderReadBook(getReadBookId());
    } else onCloseAddModal();
    setLang(currLang);
    setDirection(currLang);
    doTrans();
    document.querySelector('.read-modal h3').innerHTML = getPrice(
        getBookById(getReadBookId()).price
    );
}

function renderBooks() {
    var books = getBooksForDisplay();
    var strHTML = getStrHTML(books);
    document.querySelector('.books-container').innerHTML = strHTML;
    doTrans();
}

function getStrHTML(books) {
    if (gSwitchDisplay === 'table') {
        var strTableHTML = books.map(
            (book) => `
                <tr class="table-light">
                    <td>${book.id}</td>
                    <td>${book.rate}</td>
                    <td>${book.name}</td>
                    <td>${getPrice(book.price)}</td>
                    <td class="action-btns">
                         <button class="read-btn" onclick="onReadBook('${
                             book.id
                         }')" data-trans="read-btn">Read</button>
                         <button class="update-btn" onclick="onOpenUpdateBookModal('${
                             book.id
                         }')" data-trans="update-btn">Update</button>
                         <button class="delete-btn" onclick="onDeleteBook('${
                             book.id
                         }')" data-trans="delete-btn">Delete</button>
                    </td>
                </tr>
    `
        );
        const tableHead = `
            <table class="table table-bordered">
                <tr class="table-primary">
                    <th data-trans="table-id" class="table-id">ID</th>
                    <th data-trans="table-rate">Rate</th>
                    <th data-trans="table-title">Title</th>
                    <th data-trans="table-price">Price</th>
                    <th data-trans="action-btns" class="action-btns ">Action</th>
                </tr>
    `;
        strTableHTML = tableHead + strTableHTML.join('') + '</table>';
        return strTableHTML;
    } else {
        var strCardsHTML = books
            .map(
                (book) =>
                    `
               
                    <article class="book-card">  
                    <h4>${book.name}</h4>
                    <div class="img-container">
                        <img onerror="this.src='img/book.png'" src="img/${
                            book.imgUrl
                        }" alt="book cover">
                    </div>
                    <p class="price" data-trans="read-price">Price:</p>
                    <p>${getPrice(book.price)}</p>
                    <p class="rating" data-trans="rate-cards">Rating:</p>
                    <p>${book.rate}</p>
                    <button class="read-btn" onclick="onReadBook('${book.id}')"
                    data-trans="read-btn">
                    Read
                    </button>
                    <button
                        class="update-btn"
                        onclick="onOpenUpdateBookModal('${
                            book.id
                        }')" data-trans="update-btn"
                    >
                    Update
                    </button>
                    <button class="delete-btn" onclick="onDeleteBook('${
                        book.id
                    }')" data-trans="delete-btn">
                        Delete
                    </button>
                    </article>            
                
            `
            )
            .join('');
        strCardsHTML =
            `<section class="book-cards container text-center">` +
            strCardsHTML +
            `</section>`;
        return strCardsHTML;
    }
}

function onNextPage() {
    nextPage();
    renderBooks();
    // doTrans();
}

function onPrevPage() {
    prevPage();
    renderBooks();
    // doTrans();
}

function updatePageDisplay(pageIdx) {
    document.querySelector('.paging-display').innerText = pageIdx + 1;
}

function disableBtn(classBtn) {
    const elBtn = document.querySelector(classBtn);
    elBtn.disabled = true;
    elBtn.style.background = 'grey';
    elBtn.style.cursor = 'not-allowed';
}

function unableBtn(classBtn) {
    const elBtn = document.querySelector(classBtn);
    elBtn.disabled = false;
    elBtn.style.background = 'rgb(150, 179, 115)';
    elBtn.style.cursor = 'pointer';
}

function onSwitchDisplay(elBtn) {
    if (elBtn.classList.contains('selected')) return;
    document
        .querySelectorAll('.switch-container i')
        .forEach((btn) => btn.classList.toggle('selected'));
    gSwitchDisplay = elBtn.id;
    renderBooks();
}

function showPagingPanel() {
    document.querySelector('.paging').classList.remove('hide');
}

function hidePagingPanel() {
    document.querySelector('.paging').classList.add('hide');
}

function onSetLang(lang) {
    setLang(lang);
    setDirection(lang);
    setQueryParams();
    renderBooks();
    document.querySelector('.read-modal h3').innerHTML = getPrice(
        getBookById(getReadBookId()).price
    );
}

function setDirection(lang) {
    if (lang === 'he') document.body.classList.add('rtl');
    else document.body.classList.remove('rtl');
}

function onCopyURL() {
    navigator.clipboard.writeText(window.location.href);
}
