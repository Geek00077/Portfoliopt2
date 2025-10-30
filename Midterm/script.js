async function getJournals(){

    try{

    const response = await fetch("https://upadhayay.github.io/db.json");
    const data = await response.json();

    const booksDiv = document.getElementById("books");

    for(let book of data.books){
        
        const newBooksDiv = document.createElement("div");
        newBooksDiv.classList.add("book");

        const bookImg = document.createElement("img");
        bookImg.src = "CISMidtermJournal.png";
        bookImg.alt = "A picture of a book with a pen";

        const bookTitle = document.createElement("h2");
        bookTitle.textContent = book.title;

        const bookInfo = document.createElement("p");
        bookInfo.textContent = ` ${book.year} - ${book.published}`;
        
        newBooksDiv.appendChild(bookImg);
        newBooksDiv.appendChild(bookTitle);
        newBooksDiv.appendChild(bookInfo);


        booksDiv.appendChild(newBooksDiv);
    }


    } catch(error){
        console.error("Error Fetching Data: ", error);
    }
}
getJournals();