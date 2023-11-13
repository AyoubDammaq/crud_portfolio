'use strict';



// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }



// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });



// testimonials variables
const testimonialsItem = document.querySelectorAll("[data-testimonials-item]");
const modalContainer = document.querySelector("[data-modal-container]");
const modalCloseBtn = document.querySelector("[data-modal-close-btn]");
const overlay = document.querySelector("[data-overlay]");

// modal variable
const modalImg = document.querySelector("[data-modal-img]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalText = document.querySelector("[data-modal-text]");

// modal toggle function
const testimonialsModalFunc = function () {
  modalContainer.classList.toggle("active");
  overlay.classList.toggle("active");
}

// add click event to all modal items
for (let i = 0; i < testimonialsItem.length; i++) {

  testimonialsItem[i].addEventListener("click", function () {

    modalImg.src = this.querySelector("[data-testimonials-avatar]").src;
    modalImg.alt = this.querySelector("[data-testimonials-avatar]").alt;
    modalTitle.innerHTML = this.querySelector("[data-testimonials-title]").innerHTML;
    modalText.innerHTML = this.querySelector("[data-testimonials-text]").innerHTML;

    testimonialsModalFunc();

  });

}

// add click event to modal close button
modalCloseBtn.addEventListener("click", testimonialsModalFunc);
overlay.addEventListener("click", testimonialsModalFunc);



// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-selecct-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);

  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {

  for (let i = 0; i < filterItems.length; i++) {

    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }

  }

}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {

  filterBtn[i].addEventListener("click", function () {

    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;

  });

}



// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {

    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }

  });
}



// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {

    for (let i = 0; i < pages.length; i++) {
      if (this.innerHTML.toLowerCase() === pages[i].dataset.page) {
        pages[i].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
        pages[i].classList.remove("active");
        navigationLinks[i].classList.remove("active");
      }
    }

  });
}
document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.querySelector('.form');
  const contactList = document.getElementById('contactListBody');
  getAllContacts();
  contactForm.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const formDataObject = {};
    
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
   
    const contactData = {
      fullname : document.querySelector("#name").value,
      email : document.querySelector("#email").value,
      description : document.querySelector("#desc").value,
    };

    createContact(contactData);

    contactForm.reset(); 
  });

  function getAllContacts() {
    fetch('http://localhost:3000/api/contacts')
      .then((response) => response.json())
      .then((data) => {
        // Manipulate the data as needed (e.g., display it on the UI)
        displayContacts(data);
      })
      .catch((error) => console.error('Error fetching contacts:', error));
  }

  function displayContacts(contacts) {
    contactList.innerHTML = '';
    contacts.forEach((contact) => {
      const contactItem = document.createElement('tr');
      contactItem.classList.add('contact-item');
      contactItem.id = contact._id;
      contactItem.innerHTML = `
        <td>${contact.fullname}</td>
        <td>${contact.email}</td>
        <td>${contact.description}</td>
        <td>
          <button class="update-btn" onclick="updateContact('${contact._id}')">Update</button>
          <button class="delete-btn" onclick="deleteContact('${contact._id}')">Delete</button>
        </td>
      `;
      contactList.appendChild(contactItem);
    });
  }

function createContact(contactData) {
    fetch('http://localhost:3000/api/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactData),
    })
      .then((response) => response.json())
      .then((data) => {
        // After creating a new contact, fetch and display the updated contact list
        getAllContacts();
        console.log(data);
      })
      .catch((error) => console.error('Error creating contact:', error));
  }
});
function displayUpdateForm(contact) {
  // Assuming you have a form for updating contacts, populate it with existing data
  document.querySelector("#name").value = contact.fullname;
  document.querySelector("#email").value = contact.email;
  document.querySelector("#desc").value = contact.description;

  // Show the update form
  elementToggleFunc(document.getElementById('contacts'));

  const updateForm = document.getElementById('contact-form');
  updateForm.addEventListener('submit', function(event) {
    event.preventDefault();

      // Get updated data from the form
    const updatedData = {
      fullname: document.querySelector("#name").value,
      email: document.querySelector("#email").value,
      description: document.querySelector("#desc").value,
    }
    updateContact(contact._id, updatedData);
  });
}
// Update an existing contact
function updateContact(contactId,updatedData) {
  fetch(`http://localhost:3000/api/contacts/${contactId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedData),
  })
    .then((response) => response.json())
    .then((data) => {
      // Manipulate the data as needed (e.g., update UI after updating a contact)
      console.log(data);
      getAllContacts();
    })
    .catch((error) => console.error('Error updating contact:', error));
}

// Delete a contact
function deleteContact(contactId) {
  fetch(`http://localhost:3000/api/contacts/${contactId}`, {
    method: 'DELETE',
  })
    .then(() => {
      removeContactFromUI(contactId);
      // Manipulate the data as needed (e.g., update UI after deleting a contact)
      console.log(`Contact with ID ${contactId} deleted successfully`);
    })
    .catch((error) => console.error('Error deleting contact:', error));
}
// Remove contact from UI
function removeContactFromUI(contactId) {
  const contactItem = document.getElementById(contactId);
  if (contactItem) {
    contactItem.remove(); // Remove the contact item from the UI
  }
}
