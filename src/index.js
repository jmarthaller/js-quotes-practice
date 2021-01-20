// const quoteList = document.querySelector('#quote-list')
// const newQuoteForm = document.querySelector('#new-quote-form')


// fetch('http://localhost:3000/quotes?_embed=likes')
//   .then(response => response.json())
//   .then(data => renderQuotes(data));


// function renderQuotes(data) {
//     data.forEach(quote => {
//         quoteList.innerHTML += `
//         <li class='quote-card' data-id=${quote.id}>
//             <blockquote class="blockquote">
//             <p class="mb-0" data-id=${quote.id}>${quote.quote}</p>
//             <footer class="blockquote-footer">${quote.author}</footer>
//             <br>
//             <button class='btn-success'>Likes: <span>${quote.likes.length}</span></button>
//             <button class='btn-danger'>Delete</button>
//             </blockquote>
//         </li>
//         `});
// }


// newQuoteForm.addEventListener('submit', function(e) {
//     e.preventDefault()

//     newQuote = e.target.quote.value
//     newAuthor = e.target.author.value

//     quoteObj = {
//         quote: newQuote,
//         author: newAuthor,
//         likes: 0
//     }

//     postNewQuote(quoteObj)

//     e.target.reset()
// })


// function postNewQuote(data) {
//     fetch('http://localhost:3000/quotes', {
//         method: 'POST', 
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
//     .then(response => response.json())
//     .then(slapQuoteOnDom)
// }


// function slapQuoteOnDom(quote) {
//     quoteList.innerHTML += `
//         <li class='quote-card' data-id=${quote.id}>
//             <blockquote class="blockquote">
//             <p class="mb-0" data-id=${quote.id}>${quote.quote}</p>
//             <footer class="blockquote-footer">${quote.author}</footer>
//             <br>
//             <button class='btn-success'>Likes: <span>${quote.likes}</span></button>
//             <button class='btn-danger'>Delete</button>
//             </blockquote>
//         </li>
//         `
// }


// quoteList.addEventListener('click', function(e) {
//     if (e.target.matches('.btn-danger')) {
//         const quoteToRemove = e.target.closest('.quote-card')
//         makeDeleteRequest(quoteToRemove)
//         quoteToRemove.remove()
//     } else if (e.target.matches('.btn-success')) {
//         let numLikes = parseInt(e.target.innerText.split(' ')[1])
//         let nextNum = numLikes + 1
//         e.target.innerText = `Likes: ${nextNum}`

//         let parsedQuoteId = parseInt(e.target.closest('li').dataset.id)
        
//         let quoteObj = {
//             quoteId: parsedQuoteId,
//             createdAt: Date.now()
//         }
//         makePostLikeRequest(quoteObj)
//     }
// })


// function makeDeleteRequest(quote) {
//     fetch(`http://localhost:3000/quotes/${quote.dataset.id}`, {
//         method: 'DELETE', 
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(quote),
//     })
//     .then(response => response.json())
// }


// function makePostLikeRequest(data) {
//     fetch('http://localhost:3000/likes', {
//         method: 'POST', 
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
//     .then(response => response.json())
// }



//////////////////////////////// REVIEW CODE */



getAllQuotes()

//************************** Grab Elements From DOM  */

const quoteList = document.querySelector('#quote-list')
const newQuoteForm = document.querySelector('#new-quote-form')

//************************** Add Event Listeners  */

newQuoteForm.addEventListener('submit', gatherFormData)
quoteList.addEventListener('click', handleClickEvent)

//************************** Network Request to DB */

function getAllQuotes() {
    fetch('http://localhost:3000/quotes?_embed=likes')
        .then(response => response.json())
        .then(data => addQuotesToDom(data))
}


function createQuote(quoteObj) {
    fetch('http://localhost:3000/quotes', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(quoteObj)
    })
        .then(res => res.json())
        .then(addSingleQuoteToDom)
}


function deleteQuote(quoteId) {
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
        method: "DELETE",
        headers: {'Content-Type': 'application/json'},
    })
}


function createLike(quoteId) {
    fetch('http://localhost:3000/likes', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(quoteId)
    })
}

//************************** DOM manipulation & logic */

function addQuotesToDom(allQuotes) {
    allQuotes.forEach(quote => {
        quoteList.innerHTML += `
        <li class='quote-card'>
            <blockquote class="blockquote" data-id=${quote.id}>
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span class='likes-span'>${quote.likes.length}</span></button>
            <button data-id=${quote.id} class='btn-danger'>Delete</button>
            </blockquote>
        </li>
    `
    })  
}


function addSingleQuoteToDom(singleQuote) {
        quoteList.innerHTML += `
        <li class='quote-card'>
            <blockquote class="blockquote" data-id=${singleQuote.id}>
            <p class="mb-0">${singleQuote.quote}</p>
            <footer class="blockquote-footer">${singleQuote.author}</footer>
            <br>
            <button class='btn-success'>Likes: <span class='likes-span'>${0}</span></button>
            <button data-id=${singleQuote.id} class='btn-danger'>Delete</button>
            </blockquote>
        </li>
    `
}


function gatherFormData(e){
    e.preventDefault()

    const quote = e.target.quote.value
    const author = e.target.author.value

    const quoteObj = {
        quote: quote,
        author: author
    }

    createQuote(quoteObj)
    e.target.reset()
}


function handleClickEvent(e) {
    if (e.target.className === 'btn-danger') {
        getIdToDeleteQuote(e)
    } else if (e.target.className === 'btn-success') {
        getIdToLikeQuote(e)
    }
}


function getIdToDeleteQuote(e) {
    const quoteId = e.target.parentElement.dataset.id
    e.target.parentElement.parentElement.remove()
    deleteQuote(quoteId)
}


function getIdToLikeQuote(e) {
    const quoteId = parseInt(e.target.parentElement.dataset.id)
    likeObj = { quoteId: quoteId }
    increaseLikes(e)
    createLike(likeObj)
}


function increaseLikes(e) {
    let currentLikes = parseInt(e.target.querySelector('.likes-span').innerText)
    currentLikes++
    e.target.querySelector('.likes-span').innerText = currentLikes
}