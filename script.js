const userCards = document.querySelector("#userCards");
const genderFilter = document.querySelector("#genderFilter");
const searchInput = document.querySelector("#searchInput");
const loadMoreBtn = document.querySelector("#loadMoreBtn");
const saveCardSection = document.querySelector(".save-card");

let allUsers = [];
let currentResults = 0;
let savedUsers = JSON.parse(localStorage.getItem("savedUsers")) || [];

function getUsers() {
  fetch("https://randomuser.me/api/?results=10")
    .then(res => res.json())
    .then(data => {
      let newUsers = data.results;
      allUsers = allUsers.concat(newUsers);
      showUsers(allUsers.slice(0, currentResults + 10));
      currentResults += 10;
    })
    .catch(err => console.log("Xatolik:", err));
}

function showUsers(users) {
  userCards.innerHTML = "";
  users.forEach(user => {
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${user.picture.large}">
      <h3>${user.name.first}</h3>
      <p>${user.email}</p>
      <p>${user.gender}, ${user.location.country}</p>
      <button class="save-btn">Saqlash</button>
    `;
    let saveBtn = card.querySelector(".save-btn");
    saveBtn.addEventListener("click", () => saveUser(user));
    userCards.appendChild(card);
  });
}

// Foydalanuvchini saqlash
function saveUser(user) {
  let isSaved = false;

  for (let i = 0; i < savedUsers.length; i++) {
    if (savedUsers[i].email === user.email) {
      isSaved = true;
      break;
    }
  }

  if (!isSaved) {
    savedUsers.push(user);
    localStorage.setItem("savedUsers", JSON.stringify(savedUsers));
    showSavedUser(user);
  }
}

function showSavedUser(user) {
  let card = document.createElement("div");
  card.className = "card saved-user";
  card.innerHTML = `
    <img src="${user.picture.large}" alt="User Image">
    <h3>${user.name.first}</h3>
    <p>${user.email}</p>
    <p>${user.gender}, ${user.location.country}</p>
  `;
  saveCardSection.appendChild(card);
}

genderFilter.addEventListener("change", () => {
  let type = genderFilter.value;
  let filteredUsers = [];

  if (type === "all") {
    filteredUsers = allUsers;
  } else {
    filteredUsers = allUsers.filter(user => user.gender === type);
  }

  showUsers(filteredUsers.slice(0, currentResults));
});

searchInput.addEventListener("input", () => {
  let value = searchInput.value.toLowerCase();
  let filteredUsers = [];

  for (let i = 0; i < allUsers.length; i++) {
    let name = allUsers[i].name;
    if (
      name.first.toLowerCase().includes(value) ||
      name.last.toLowerCase().includes(value)
    ) {
      filteredUsers.push(allUsers[i]);
    }
  }

  showUsers(filteredUsers.slice(0, currentResults));
});

loadMoreBtn.addEventListener("click", () => {
  getUsers();
});

for (let i = 0; i < savedUsers.length; i++) {
  showSavedUser(savedUsers[i]);
}

getUsers();
