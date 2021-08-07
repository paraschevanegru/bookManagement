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

    printJSON() {

       return { "isbn": this.isbn, "name": this.bookName, "author": this.authorName, "publisher": this.publisherName, "year": this.publishYear, "pages": this.pages, "description": this.description, "website": this.website }
    }
}

function generateBookList() {
    var bookList = [];
    for (var i = 0; i < 10; i++) {
        book = generateBook();
        bookList.push(book);
    }
    return bookList;
}

function generateRandomNB(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateISBN() {
    var nr1 = generateRandomNB(1, 9);
    var nr2 = generateRandomNB(10000, 99999);
    var nr3 = generateRandomNB(100, 999);
    var nr4 = generateRandomNB(1, 9);
    var isbn = nr1 + "-" + nr2 + "-" + nr3 + "-" + nr4;
    return isbn;
}

function generateBook() {
    var bookName = ["An Acceptable Time", "Down to a Sunless Sea", "East of Eden", "A Handful of Dust", "The Last Enemy", "The Little Foxes", "Number the Stars", "Paths of Glory", "Recalled to Life", "Vanity Fair", "The Way Through the Woods"];

    var authorName = ["T. S. Eliot", "Val McDermid", "Connie Willis", "John Steinbeck", "Mary Elizabeth Braddon", "Susan Swan", "Colin Dexter", "Mary Stewart", "Samuel Butler", "H. E. Bates"];

    var publisherName = ["Princeton", "Penguin", "HarperVollins", "Simon & Schuster", "Charles Scribner's Sons"];

    var obj = new Book(generateISBN(),bookName[generateRandomNB(0, bookName.length)], authorName[generateRandomNB(0, authorName.length)], publisherName[generateRandomNB(0, publisherName.length)], generateRandomNB(900, 2021), generateRandomNB(5, 2000), "Lorem ipsum", "http://demo.com");

    return obj.printJSON();

}

module.exports = {generateBookList};