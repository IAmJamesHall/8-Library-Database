/* Pagination:
/* This code modified from one of my own Treehouse projects
https://github.com/IAmJamesHall/Project2/blob/master/js/script.js
*/

document.addEventListener("DOMContentLoaded", () => {
  appendPageLinks(bookList);
  showPage(bookList, 1);
});

const bookList = document.querySelectorAll('.book');
const numberOfItemsPerPage = 10;
const container = document.querySelector('.container')

//show a certain page based on an argument 'pageNumber'
//also, call appendPageLinks to add pagination
const showPage = (list, pageNumber) => {
  const tBody = document.createElement('tbody');
  let startIndex = pageNumber * numberOfItemsPerPage - numberOfItemsPerPage;
  let endIndex = pageNumber * numberOfItemsPerPage;
  //if there are less than 10 items on the page, set endIndex accordingly
  if (endIndex >= list.length) {
    endIndex = list.length;
  }

  for (let i = startIndex; i < endIndex; i++) {
    const tr = list[i];
    tBody.appendChild(tr);
  }
  const existingTBody = document.querySelector('tbody');
  const table = document.querySelector('table');
  table.insertBefore(tBody, existingTBody);
  if (existingTBody) {
    table.removeChild(existingTBody);
  }

  appendPageLinks(list);
}

//deletes element based on selector, if it exists
function deleteElement(selector) {
  const element = document.querySelector(selector);
  if (element) {
      const parentNode = element.parentNode;
      parentNode.removeChild(element)
  }
}

//Appends pagination links to DOM and selects first one
function appendPageLinks(list) {
  const numberOfPages = Math.ceil(list.length/numberOfItemsPerPage);
  if (numberOfPages > 1) {
      const paginationDiv = document.createElement('div');
      paginationDiv.className = "pagination";
      const ul = document.createElement('ul');
      for (let i = 1; i <= numberOfPages; i += 1) {
          ul.appendChild(createPageNumberLi(i));
      }
      paginationDiv.appendChild(ul);
      deleteElement('.pagination')
      
      container.appendChild(paginationDiv);

      enablePageLinks();

  } else { //remove pagination links if numberOfPages <= 1
      deleteElement('.pagination');
  }

  //return pagination link to append to the page
  function createPageNumberLi(number) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.textContent = number;
      a.href = "#";
      li.appendChild(a);
      return li;
  }

  //add event listener to pagination links
  function enablePageLinks() {
      const paginationDiv = container.querySelector('.pagination');
      paginationDiv.addEventListener('click', (e) => {
          const pageNumber = e.target.textContent;
          showPage(list, pageNumber);
      });
  }
}