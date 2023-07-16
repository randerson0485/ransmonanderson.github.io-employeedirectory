/***************************/
/*        Variables        */
/***************************/

let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture, email, location, phone, dob &noinfo &nat=US`;
const search = document.getElementById("searchField");
const containerApi = document.getElementById("employee-sheet");
const modalOverlay = document.getElementById("employee-modal");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.getElementById("modal-close");
const modal = document.querySelector(".modal");
const member = document.querySelectorAll("memberContainer");
const leftArrow = document.getElementById("leftArrow");
const rightArrow = document.getElementById("rightArrow");

/***************************/
/*        Fetch            */
/***************************/

fetch(urlAPI)
  .then((res) => res.json())
  .then((res) => res.results)
  .then(displayEmployees)
  .catch((err) => console.log(err));

// /***************************/
// /*        Function         */
// /***************************/

function displayEmployees(employeeData) {
  employees = employeeData;
  let employeeHTML = "";
  employees.forEach((employee, index) => {
    let name = employee.name;
    let email = employee.email;
    let city = employee.location.city;
    let picture = employee.picture;

    employeeHTML += `
    <div id="memberContainer" data-index="${index}" class="member-container">
          <div class="member-image">
            <img
              src="${picture.medium}"
              class="profile-picture"
              alt="random profile picture"
            />
          </div>
          <div class="member-info">
            <h3 class="member-header">${name.first} ${name.last}</h3>
            <p class="member-email">${email}</p>
            <p class="member-city">${city}</p>
          </div>
        </div>
    `;
  });
  containerApi.innerHTML = employeeHTML;
}

/***************************/
/*     Display Modal       */
/***************************/

function displayModal(index) {
  let {
    name,
    dob,
    phone,
    email,
    location: { city, street, state, postcode },
    picture,
  } = employees[index];

  let date = new Date(dob.date);

  const modalHTML = `
  <div class="modal-header">
  <img class="modal-image" src="${picture.large}" />
  <h3 class="modal-name">${name.first} ${name.last}</h3>
  <p class="modal-email">${email}</p>
  <p class="modal-city">${city}</p>
  <hr>
  <div class="modal-main">
    <p class="modal-phone">${phone}</p>
    <p class="modal-address">${street.name}, ${state} ${postcode}</p>
    <p>Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
  </div>
</div>
  `;
  modalOverlay.classList.remove("hidden");
  modalContainer.innerHTML = modalHTML;

  /***************************/
  /*  Left and Right Arrows  */
  /***************************/

  //Grabs the Current Index of Employee Array
  currentEmployee = employees.indexOf(employees[index]);

  //Conditional Ternary Operator
  currentEmployee === 11
    ? (rightArrow.style.display = "none")
    : (rightArrow.style.display = "block");
  currentEmployee === 0
    ? (leftArrow.style.display = "none")
    : (leftArrow.style.display = "block");
}

/***************************/
/*     Event Listener      */
/***************************/

//Modal and Overlay Display None when "X" is Clicked

modalClose.addEventListener("click", (e) => {
  modalOverlay.classList.add("hidden");
});

// Allows User to Click Off Without Using "X" Btn

modalOverlay.onclick = (e) => {
  if (e.target !== modal) {
    modalOverlay.classList.add("hidden");
  }
};

// Prevents from Children causing 'On Click'
modal.addEventListener("click", (e) => {
  e.stopPropagation();
});

//Grabs Data Index and Send it to DisplayModal Function
containerApi.addEventListener("click", (e) => {
  if (e.target !== containerApi) {
    const member = e.target.closest(".member-container");
    const index = member.getAttribute("data-index");
    displayModal(index);
  }
});

//Search Field

search.addEventListener("keyup", () => {
  const memberName = document.getElementsByClassName("member-header");
  const searchInput = search.value.toUpperCase();
  const memberArray = Array.from(memberName); //Converts HTML Collection to Array
  //Loop Through Each Array Item
  //Check to See if there is a Match
  memberArray.forEach((member) => {
    if (member.innerHTML.toUpperCase().indexOf(searchInput) > -1) {
      member.closest(".member-container").style.display = "";
    } else {
      member.closest(".member-container").style.display = "none";
    }
  });
});

//Function for Left Arrow
//Checks if Current Employee is greater or Equal to Zero
// Then Checks if Current Employee is Zero to remove arrow
function left() {
  if (currentEmployee >= 0) {
    displayModal((currentEmployee -= 1));
    rightArrow.style.display = "block";
    if (currentEmployee === 0) {
      leftArrow.style.display = "none";
    }
  }
}

//Function for Right Arrow
//Checks if Current Employee is greater or Equal to Eleven
// Then Checks if Current Employee is Eleven to remove arrow
function right() {
  if (currentEmployee <= 11) {
    displayModal((currentEmployee += 1));
    leftArrow.style.display = "block";
    if (currentEmployee === 11) {
      rightArrow.style.display = "none";
    }
  }
}

leftArrow.addEventListener("click", left);

rightArrow.addEventListener("click", right);
