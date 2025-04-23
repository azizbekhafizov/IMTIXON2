const userCards = document.querySelector("#userCards");
const genderFilter = document.querySelector("#genderFilter");
const searchInput = document.querySelector("#searchInput");
const loadMoreBtn = document.querySelector("#loadMoreBtn");
const saveCardSection = document.querySelector(".save-card");

let allUsers = [];
let currentResults = 0;
let savedUsers = JSON.parse(localStorage.getItem("savedUsers")) || [];

function fetchUsers() {
    fetch("https://randomuser.me/api/?results=10")
      .then(res => res.json())
      .then(data => {
        allUsers = [...allUsers, ...data.results];
        cards(allUsers.slice(0, currentResults + 10));
        currentResults += 10;
      })
      .catch(error => {
        console.error("error:", error);
      });
}

function cards(users) {
  userCards.innerHTML = "";
  users.forEach(user => {
    userCards.innerHTML += `
      <div class="card">
        <img src="${user.picture.large}" alt="User Image">
        <h3>${user.name.first}</h3>
        <p>${user.email}</p>
        <p>${user.gender}, ${user.location.country}</p>
        <button class="save-btn" data-user='${JSON.stringify(user)}'>Save</button>
      </div>
    `;
  });

  const saveButtons = document.querySelectorAll(".save-btn");
  saveButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const user = JSON.parse(e.target.getAttribute('data-user'));
      saveUser(user);
    });
  });
}

function saveUser(user) {
  if (!savedUsers.some(savedUser => savedUser.email === user.email)) {
    savedUsers.push(user);
    localStorage.setItem("savedUsers", JSON.stringify(savedUsers));
    addSavedUserToSection(user);
  }
}

function addSavedUserToSection(user) {
  saveCardSection.innerHTML += `
        <div class="card saved-user">
      <img src="${user.picture.large}" alt="User Image">
      <h3>${user.name.first}</h3>
      <p>${user.email}</p>
      <p>${user.gender}, ${user.location.country}</p>
    </div>
  `;
}

genderFilter.addEventListener("change", () => {
  const value = genderFilter.value;
  const filtered = value === "all" 
    ? allUsers 
    : allUsers.filter(user => user.gender === value);
  cards(filtered.slice(0, currentResults));
});

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();
  const filtered = allUsers.filter(user => 
    user.name.first.toLowerCase().includes(query) || 
    user.name.last.toLowerCase().includes(query)
  );
  cards(filtered.slice(0, currentResults));
});

loadMoreBtn.addEventListener("click", () => {
  fetchUsers();
});

savedUsers.forEach(user => {
  addSavedUserToSection(user);
});

fetchUsers();
