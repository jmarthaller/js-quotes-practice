const quoteList = document.querySelector('#quote-list')
const newQuoteForm = document.querySelector('#new-quote-form')


fetch('http://localhost:3000/quotes?_embed=likes')
  .then(response => response.json())
  .then(data => renderQuotes(data));


function renderQuotes(data) {
    data.forEach(quote => {
        quoteList.innerHTML += `
        <li class='quote-card' data-id=${quote.id}>
            <blockquote class="blockquote">
            <p class="mb-0" data-id=${quote.id}>${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
            <button class='btn-danger'>Delete</button>
            </blockquote>
        </li>
        `
    });
}


newQuoteForm.addEventListener('submit', function(e) {
    e.preventDefault()

    newQuote = e.target.quote.value
    newAuthor = e.target.author.value

    quoteObj = {
        quote: newQuote,
        author: newAuthor,
        likes: 0
    }

    postNewQuote(quoteObj)

    e.target.reset()
})


function postNewQuote(data) {
    fetch('http://localhost:3000/quotes', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(slapQuoteOnDom)
}


function slapQuoteOnDom(quote) {
    quoteList.innerHTML += `
        <li class='quote-card' data-id=${quote.id}>
            <blockquote class="blockquote">
            <p class="mb-0" data-id=${quote.id}>${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
            <button class='btn-danger'>Delete</button>
            </blockquote>
        </li>
        `
}


quoteList.addEventListener('click', function(e) {
    if (e.target.matches('.btn-danger')) {
        const quoteToRemove = e.target.closest('.quote-card')
        makeDeleteRequest(quoteToRemove)
        quoteToRemove.remove()
    } else if (e.target.matches('.btn-success')) {
        let numLikes = parseInt(e.target.innerText.split(' ')[1])
        let nextNum = numLikes + 1
        e.target.innerText = `Likes: ${nextNum}`

        let parsedQuoteId = parseInt(e.target.closest('li').dataset.id)
        
        let quoteObj = {
            quoteId: parsedQuoteId,
            createdAt: Date.now()
        }
        makePostLikeRequest(quoteObj)
    }
})


function makeDeleteRequest(quote) {
    fetch(`http://localhost:3000/quotes/${quote.dataset.id}`, {
        method: 'DELETE', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quote),
    })
    .then(response => response.json())
}


function makePostLikeRequest(data) {
    fetch('http://localhost:3000/likes', {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
}


