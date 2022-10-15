'use strict';

const gTrans = {
    title: {
        en: 'Book Shop',
        he: 'דוכן ספרים',
    },
    'filter-price': {
        en: 'Max Price:',
        he: `מחיר מקסימלי`,
    },
    'filter-rate': {
        en: 'Min Rate:',
        he: 'דירוג מינימלי',
    },
    'search-placeholder': {
        en: 'Search for a title...',
        he: 'חפש ספר...',
    },
    'create-book-btn': {
        en: 'Create new book',
        he: 'צור ספר חדש',
    },
    'prev-btn': {
        en: 'Prev Page',
        he: 'הדף הקודם',
    },
    'next-btn': {
        en: 'Next Page',
        he: 'הדף הבא',
    },
    'add-book-title': {
        en: 'Add a book',
        he: 'הוסף ספר',
    },
    'input-txt-placeholder': {
        en: 'Title...',
        he: 'שם הספר...',
    },
    'input-price-placeholder': {
        en: 'Price...',
        he: 'מחיר...',
    },
    'update-title': {
        en: `Update price`,
        he: 'עדכן מחיר',
    },
    'update-price-placeholder': {
        en: 'New price...',
        he: 'מחיר מעודכן...',
    },
    'update-btn': {
        en: 'Update',
        he: 'עדכן',
    },
    'read-price': {
        en: 'Price:',
        he: 'מחיר:',
    },
    'read-rate': {
        en: 'Rate book',
        he: 'דרג ספר',
    },
    'table-id': {
        en: 'ID',
        he: 'מזהה',
    },
    'table-rate': {
        en: 'Rate',
        he: 'דירוג',
    },
    'table-title': {
        en: 'Title',
        he: 'שם',
    },
    'table-price': {
        en: 'Price',
        he: 'מחיר',
    },
    'action-btns': {
        en: 'Action',
        he: 'פעולות',
    },
    'read-btn': {
        en: 'Read',
        he: 'קרא',
    },
    'update-btn': {
        en: 'Update',
        he: 'עדכן',
    },
    'delete-btn': {
        en: 'Delete',
        he: 'מחק',
    },
    'rate-cards': {
        en: 'Rating',
        he: 'דירוג',
    },
    'best-features': {
        en: 'Best Features',
        he: 'המומלצים באתר',
    },
};

let gCurrLang = 'en';

function _getTrans(transKey) {
    const transMap = gTrans[transKey];
    if (!transMap) return 'UNKNOWN';

    let trans = transMap[gCurrLang];
    if (!trans) trans = transMap.en;
    return trans;
}

function doTrans() {
    const els = document.querySelectorAll('[data-trans]');
    els.forEach((el) => {
        const transKey = el.dataset.trans;
        el.innerText = _getTrans(transKey);
        if (el.placeholder) el.placeholder = _getTrans(transKey);
    });
}

function setLang(lang) {
    gCurrLang = lang;
}
