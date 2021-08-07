var db;
const dbName = 'library';
const dbStore = 'books';
const dbVersion = 1;


function openDB() {
    var openDB = indexedDB.open(dbName, dbVersion);
    openDB.onupgradeneeded = function (event) {
        var store = event.currentTarget.result.createObjectStore(dbStore, { keyPath: 'id', autoIncrement: true }); // create it
        store.createIndex('isbn', 'isbn', { unique: true });
        store.createIndex('name', 'name', { unique: false });
        store.createIndex('author', 'author', { unique: false });
        store.createIndex('year', 'year', { unique: false });
    };

    openDB.onerror = function (event) {
        console.error("Error", event.target.errorCode);
    };

    openDB.onsuccess = function () {
        db = this.result;
    };
}

function getStore(store_name, mode) {
    var tx = db.transaction(store_name, mode);
    return tx.objectStore(store_name);
}

function clearStore() {
    var store = getStore(dbStore, 'readwrite');
    var req = store.clear();
    req.onsuccess = function (event) {
        console.log("clear store successful")
        successMessage("Store cleared");
    };
    req.onerror = function (event) {
        console.error("clearStore:", event.target.errorCode);
        failureMessage(this.error);
    };
    displayBooks();
}

function successMessage(msg) {
    var message = document.getElementById("message");
    message.innerHTML = "";
    msg = typeof msg != 'undefined' ? "Success: " + msg : "Success";
    var div = document.createElement("div");
    var text = document.createTextNode(msg);
    div.appendChild(text);
    div.setAttribute("id", "success");
    div.addEventListener("click", function () { div.remove() }, false);
    message.appendChild(div);
}

function failureMessage(msg) {
    var message = document.getElementById("message");
    message.innerHTML = "";
    msg = typeof msg != 'undefined' ? "Failure: " + msg : "Failure";
    var div = document.createElement("div");
    var text = document.createTextNode(msg);
    div.appendChild(text);
    div.setAttribute("id", "failure");
    div.addEventListener("click", function () { div.remove() }, false);
    message.appendChild(div);
}

openDB();
