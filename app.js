const countryContainer = document.getElementById('countryContainer');
const showMoreButton = document.getElementById('showMoreButton');
const searchBar = document.getElementById('searchBar');
const favoriteIcon = document.getElementById('toggleFavorite');
const modeToggleSun = document.getElementById('toggleMode');
const modeToggleMoon = document.getElementById('toggleModeMoon');
const favoritesSection = document.getElementById('favoritesSection');
const favoritesContainer = document.getElementById('favoritesContainer');

let countries = [];
let currentIndex = 0;

async function fetchCountries() {
   const response = await fetch('https://restcountries.com/v3.1/all');
   countries = await response.json();
   displayCountries();
}

function displayCountries() {
   const endIndex = currentIndex + 12; 
   const displayedCountries = countries.slice(currentIndex, endIndex);

   displayedCountries.forEach(country => {
       const countryBox = document.createElement('div');
       countryBox.classList.add('country-box');

       countryBox.innerHTML = `
           <img src="${country.flags.png}" alt="${country.name.common}">
           <h3>${country.name.common}</h3>
           <button class="favorite-btn" onclick="toggleFavorite('${country.name.common}', '${country.flags.png}')">
               <i class="fa-solid fa-heart ${isFavorite(country.name.common) ? 'favorited' : ''}"></i>
           </button>
           <button onclick="viewDetails('${country.name.common}')">View Details</button>
       `;
       
       countryContainer.appendChild(countryBox);
   });

   currentIndex += 12; 
   showMoreButton.style.display = currentIndex >= countries.length ? 'none' : 'block';
}

function toggleFavorite(countryName, flagUrl) {
   let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
   if (isFavorite(countryName)) {
       favorites = favorites.filter(fav => fav.name !== countryName);
   } else {
       favorites.push({ name: countryName, flag: flagUrl });
   }
   localStorage.setItem('favorites', JSON.stringify(favorites));
   updateFavoritesCount();
}

function isFavorite(countryName) {
   const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
   return favorites.some(fav => fav.name === countryName);
}

function updateFavoritesCount() {
   const favoritesCount = JSON.parse(localStorage.getItem('favorites'))?.length || 0;
   favoriteIcon.innerHTML = `<i class="fa-solid fa-heart">${favoritesCount > 0 ? favoritesCount : ''}</i>`;
}

function viewDetails(countryName) {
   const country = countries.find(c => c.name.common === countryName);
   if (country) {
       alert(`Details for ${country.name.common}:\nPopulation: ${country.population}\nRegion: ${country.region}\nSubregion: ${country.subregion}\nCapital: ${country.capital}\nFlag URL:${country.flags.png}`);
   }
}

function toggleMode() {
   document.body.classList.toggle('dark-mode');
   document.querySelector('.header').classList.toggle('dark-mode');

   modeToggleSun.style.display = document.body.classList.contains('dark-mode') ? 'none' : 'inline-block';
   modeToggleMoon.style.display = document.body.classList.contains('dark-mode') ? 'inline-block' : 'none';
}

modeToggleSun.addEventListener('click', toggleMode);
modeToggleMoon.addEventListener('click', toggleMode);

document.getElementById('searchButton').addEventListener('click', () => {
   const searchText = searchBar.value.toLowerCase();
   currentIndex = 0; 
   countryContainer.innerHTML = ''; 
   
   const filteredCountries = countries.filter(country => 
       country.name.common.toLowerCase().includes(searchText)
   );

   filteredCountries.forEach(country => {
       const countryBox = document.createElement('div');
       countryBox.classList.add('country-box');

       countryBox.innerHTML = `
           <img src="${country.flags.png}" alt="${country.name.common}">
           <h3>${country.name.common}</h3>
           <button class="favorite-btn" onclick="toggleFavorite('${country.name.common}', '${country.flags.png}')">
               <i class="fa-solid fa-heart ${isFavorite(country.name.common) ? 'favorited' : ''}"></i>
           </button>
           <button onclick="viewDetails('${country.name.common}')">View Details</button>
       `;
       
       countryContainer.appendChild(countryBox);
   });

   showMoreButton.style.display = filteredCountries.length <= 12 ? 'none' : 'block';
});

showMoreButton.addEventListener('click', displayCountries);

favoriteIcon.addEventListener('click', () => {
   const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
   
   if (favorites.length > 0) {
       favoritesSection.style.display = 'block';
       favoritesContainer.innerHTML = ''; 

       favorites.forEach(fav => {
           const favDiv = document.createElement('div');
           favDiv.classList.add('country-box');

           favDiv.innerHTML = `
               <img src="${fav.flag}" alt="${fav.name}">
               <h3>${fav.name}</h3>
               <button onclick='viewDetails("${fav.name}")'>View Details</button> <!-- View details button -->
               <button onclick='removeFavorite("${fav.name}")'>Remove</button> <!-- Remove button -->
           `;
           
           favoritesContainer.appendChild(favDiv);
       });
   } else {
       alert("No favorite countries added.");
   }
});

function removeFavorite(countryName) {
   let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
   favorites = favorites.filter(fav => fav.name !== countryName);
   localStorage.setItem('favorites', JSON.stringify(favorites));
   
   
   updateFavoritesCount();
   
   favoriteIcon.click(); 
}


fetchCountries();
