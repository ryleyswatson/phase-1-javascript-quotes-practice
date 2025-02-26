document.addEventListener('DOMContentLoaded', function () {
    const quoteList = document.getElementById('quote-list');
    const newQuoteForm = document.getElementById('new-quote-form');
    const newQuoteInput = document.getElementById('new-quote');
    const newAuthorInput = document.getElementById('author');
  
    // Load quotes from the API
    function loadQuotes(isSorted = false) {
      let url = 'http://localhost:3000/quotes?_embed=likes';
      if (isSorted) {
        url += '&_sort=author';
      }
  
      fetch(url)
        .then(response => response.json())
        .then(data => {
          quoteList.innerHTML = '';
          data.forEach(quote => {
            const quoteItem = document.createElement('li');
            quoteItem.classList.add('quote-card');
            quoteItem.innerHTML = `
              <blockquote class="blockquote">
                <p class="mb-0">${quote.quote}</p>
                <footer class="blockquote-footer">${quote.author}</footer>
                <br>
                <button class='btn-success' data-id="${quote.id}">Likes: <span>${quote.likes ? quote.likes.length : 0}</span></button>
                <button class='btn-danger' data-id="${quote.id}">Delete</button>
                <button class='btn-warning' data-id="${quote.id}">Edit</button>
              </blockquote>
            `;
            quoteList.appendChild(quoteItem);
          });
        });
    }
  
    // Create a new quote
    newQuoteForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const newQuote = {
        quote: newQuoteInput.value,
        author: newAuthorInput.value,
      };
  
      fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuote),
      })
        .then(response => response.json())
        .then(() => {
          loadQuotes(); // Reload quotes after adding a new one
          newQuoteInput.value = ''; // Clear the form
          newAuthorInput.value = '';
        });
    });
  
    // Delete a quote
    quoteList.addEventListener('click', function (event) {
      if (event.target.classList.contains('btn-danger')) {
        const quoteId = event.target.dataset.id;
  
        fetch(`http://localhost:3000/quotes/${quoteId}`, {
          method: 'DELETE',
        })
          .then(() => {
            loadQuotes(); // Reload quotes after deletion
          });
      }
    });
  
    // Like a quote
    quoteList.addEventListener('click', function (event) {
      if (event.target.classList.contains('btn-success')) {
        const quoteId = event.target.dataset.id;
  
        fetch('http://localhost:3000/likes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quoteId }),
        })
          .then(() => {
            loadQuotes(); // Reload quotes after liking
          });
      }
    });
  
    // Edit a quote
    quoteList.addEventListener('click', function (event) {
      if (event.target.classList.contains('btn-warning')) {
        const quoteId = event.target.dataset.id;
        const quoteItem = event.target.closest('.quote-card');
        const quoteText = quoteItem.querySelector('p').textContent;
        const authorText = quoteItem.querySelector('.blockquote-footer').textContent;
  
        // Set the current values to the form inputs
        newQuoteInput.value = quoteText;
        newAuthorInput.value = authorText;
  
        // Update quote on form submit
        newQuoteForm.addEventListener('submit', function (editEvent) {
          editEvent.preventDefault();
  
          const updatedQuote = {
            quote: newQuoteInput.value,
            author: newAuthorInput.value,
          };
  
          fetch(`http://localhost:3000/quotes/${quoteId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedQuote),
          })
            .then(() => {
              loadQuotes(); // Reload quotes after editing
              newQuoteInput.value = ''; // Clear the form
              newAuthorInput.value = '';
            });
        });
      }
    });
  
    // Sorting functionality
    let isSorted = false;
    const sortButton = document.createElement('button');
    sortButton.classList.add('btn', 'btn-info');
    sortButton.textContent = 'Sort by Author';
  
    document.body.insertBefore(sortButton, quoteList);
  
    sortButton.addEventListener('click', function () {
      isSorted = !isSorted;
      loadQuotes(isSorted);
    });
  
    // Initial call to load quotes
    loadQuotes();
  });