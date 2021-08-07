class Book {
    constructor(isbn, bookName, authorName, publisherName,
        publishYear, pages, description, website) {
        this.isbn = isbn;
        this.bookName = bookName;
        this.authorName = authorName;
        this.publisherName = publisherName;
        this.publishYear = publishYear;
        this.pages = pages;
        this.description = description;
        this.website = website;
    }

    addBook() {
        var obj = {
            isbn: this.isbn, name: this.bookName,
            author: this.authorName, publisher: this.publisherName,
            year: this.publishYear, pages: this.pages, description: this.description,
            website: this.website
        };
        var store = getStore(dbStore, 'readwrite');
        var req;
        try {
            req = store.add(obj);
        } catch (e) {
            throw e;
        }
        req.onsuccess = function () {
            console.log("Insertion in DB successful");
            successMessage("Insertion in DB successful");
        };
        req.onerror = function () {
            console.error("addBook error", this.error);
            failureMessage(this.error);
        };
    }
}

function formAddBook() {
    var inputs = document.getElementById("addBook").elements;
    let book = new Book(inputs["isbn"].value, inputs["name"].value, inputs["author"].value,
        inputs["publisher"].value, inputs["year"].value, inputs["pages"].value,
        inputs["description"].value, inputs["website"].value);

    book.addBook();
    displayBooks();
}

function formDeleteBook(isbn) {
    var store = getStore(dbStore, 'readwrite');
    var req = store.index('isbn');
    req.get(isbn).onsuccess = function (event) {
        if (typeof event.target.result === 'undefined') {
            failureMessage("No matching record found");
            return;
        }
        deleteBook(event.target.result.id, store);
    };
    req.onerror = function (event) {
        console.error("deleteBook:", event.target.errorCode);
    };
}

function deleteBook(key, store) {

    store = getStore(dbStore, 'readwrite');

    var req = store.get(key);
    req.onsuccess = function (event) {
        if (typeof event.target.result === 'undefined') {
            failureMessage("No matching record found");
            return;
        }
        var deleteDB = store.delete(key);
        deleteDB.onsuccess = function () {
            console.log("delete successful");
            successMessage("Deletion successful");
        };
        deleteDB.onerror = function (event) {
            console.error("deleteBook:", event.target.errorCode);
            failureMessage(event.target.errorCode);
        };
    };
    req.onerror = function (event) {
        console.error("deleteBook:", event.target.errorCode);
        failureMessage(event.target.errorCode);
    };

    displayBooks();
}

function formSearchBook() {
    var search = document.getElementById("searchBook").elements;
    if (search.search.value === "") {
        failureMessage("Search field cannot be empty.")
    }
    else {
        var store = getStore(dbStore, 'readonly');
        if (search.searchType.value === 'isbn') {
            var keyRange = IDBKeyRange.only(search.search.value);
        } else if (search.searchType.value === 'year') {
            var keyRange = IDBKeyRange.only(parseInt(search.search.value));
        } else {
            var keyRange = IDBKeyRange.bound(search.search.value, search.search.value + 'uffff', false, false);
        }

        store = store.index(search.searchType.value);
        var listBooks = [];
        store.openCursor(keyRange).onsuccess = function (event) {
            var cursor = event.target.result;
            if (cursor) {
                listBooks.push(cursor.value);
                cursor.continue();

            } else {
                console.log('Entries all displayed.');
            }
            renderBookTable(listBooks);
        };
    }
}

function formUpdateBook() {
    var inputs = document.getElementById("updateBook").elements;

    var store = getStore(dbStore, 'readwrite');
    var index = store.index("isbn");
    const req = index.get(inputs["isbn"].value);

    req.onsuccess = function (event) {
        var data = event.target.result;
        Object.values(inputs).forEach(e => {
            if (e.value !== "") {
                data[e.name] = e.value;
            }
        });
        const update = store.put(data);
        update.onsuccess = () => {
            console.log("Update successful");
            successMessage("Update successful");
        }
        update.onerror = () => {
            console.log("Update successful");
            failureMessage("Update successful");
        }
    };
    req.onerror = () => {
        console.error("updateBook error", this.error);
        failureMessage(this.error);
    };
    displayBooks();

}

function displayBooks() {
    var store = getStore(dbStore, 'readonly');
    store.getAll().onsuccess = function (event) {
        var books = event.target.result;
        renderBookTableWithButtons(books);
    };
}

function renderBookTable(books) {
    var bookTable = document.getElementById("bookList").getElementsByTagName("tbody")[0];
    bookTable.innerHTML = "";
    books.forEach(book => {
        var tr = bookTable.insertRow();
        Object.entries(book).forEach(entry => {
            const [key, value] = entry;
            if (key !== "id") {
                var td = tr.insertCell();
                td.innerHTML = value;
            }
        });
    });
}

function renderBookTableWithButtons(books) {
    var bookTable = document.getElementById("bookList").getElementsByTagName("tbody")[0];
    bookTable.innerHTML = "";
    books.forEach(book => {
        var tr = bookTable.insertRow();
        Object.entries(book).forEach(entry => {
            const [key, value] = entry;
            if (key !== "id") {
                var td = tr.insertCell();
                td.innerHTML = value;
            }
        });
        var td = tr.insertCell();
        var button_del = document.createElement("button");
        var del = document.createTextNode("Delete");
        button_del.appendChild(del);
        button_del.addEventListener("click", function () { formDeleteBook(book["isbn"]) }, false);
        td.appendChild(button_del);
    });
}

function openForm(id) {
    document.getElementById(id).style.display = "block";
}
function closeForm(id) {
    document.getElementById(id).style.display = "none";
}


function loadBooks() {

    //Se creează un obiect XMLHttpRequest
    var xhttp = new XMLHttpRequest();
    //Se setează funcția de callback onreadystatechange care va procesa răspunsul
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let bookList = JSON.parse(this.responseText);
            console.log(bookList);
            for (let i = 0; i < bookList.length; i++) {
                let book = new Book(bookList[i]["isbn"], bookList[i]["name"], bookList[i]["author"], bookList[i]["publisher"], bookList[i]["year"], bookList[i]["pages"], bookList[i]["description"], bookList[i]["website"]);

                book.addBook();
            }

        }
        displayBooks();
    };
    //Se apelează metodele open și send pentru a trimite cererea
    xhttp.open("GET", '/books', true);
    xhttp.send();
}
