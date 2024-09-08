const moviesList = [
  { movieName: "Flash", price: 7 },
  { movieName: "Spiderman", price: 5 },
  { movieName: "Batman", price: 4 },
];

const selectMovie = document.getElementById('selectMovie');
const movieNameElement = document.getElementById('movieName');
const moviePriceElement = document.getElementById('moviePrice');
const totalPriceElement = document.getElementById('totalPrice');
const selectedSeatsHolder = document.getElementById('selectedSeatsHolder');
const cancelBtn = document.getElementById('cancelBtn');
const proceedBtn = document.getElementById('proceedBtn');
const seatCont = document.getElementById('seatCont');
const seatLegend = document.getElementById('seatLegend');
const promoCodeInput = document.getElementById('promoCodeInput');
const applyPromoBtn = document.getElementById('applyPromoBtn');
const timerElement = document.getElementById('timerElement');
const seatFilterSelect = document.getElementById('seatFilterSelect');

let selectedSeats = [];
let moviePrice = parseInt(moviePriceElement.textContent.replace('$', ''));
let promoDiscount = 0;

// Populate movie dropdown
moviesList.forEach(movie => {
  const option = document.createElement('option');
  option.value = movie.price;
  option.textContent = movie.movieName;
  selectMovie.appendChild(option);
});

// Set default movie
selectMovie.value = 7;

// Update movie info based on dropdown selection
selectMovie.addEventListener('change', (event) => {
  const selectedMovie = moviesList.find(movie => movie.price == event.target.value);
  if (selectedMovie) {
      movieNameElement.textContent = selectedMovie.movieName;
      moviePriceElement.textContent = `$ ${selectedMovie.price}`;
      moviePrice = selectedMovie.price;
      updateTotalPrice();
  }
});

// Create a seat map
function generateSeatMap(rows, cols) {
  seatCont.innerHTML = '';
  for (let row = 0; row < rows; row++) {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'seatRow';
      for (let col = 0; col < cols; col++) {
          const seat = document.createElement('div');
          seat.className = 'seat available';
          seat.dataset.index = row * cols + col;
          rowDiv.appendChild(seat);
      }
      seatCont.appendChild(rowDiv);
  }
}

// Initialize seat map (e.g., 5 rows, 10 columns)
generateSeatMap(5, 10);

// Add event listeners to seats
seatCont.addEventListener('click', (event) => {
  const seat = event.target;
  if (seat.classList.contains('seat') && !seat.classList.contains('occupied')) {
      const seatIndex = parseInt(seat.dataset.index);
      if (seat.classList.contains('selected')) {
          seat.classList.remove('selected');
          selectedSeats = selectedSeats.filter(index => index !== seatIndex);
      } else {
          seat.classList.add('selected');
          selectedSeats.push(seatIndex);
      }
      updateSelectedSeats();
      updateTotalPrice();
  }
});

// Update total price
function updateTotalPrice() {
  const totalPrice = (selectedSeats.length * moviePrice) - promoDiscount;
  totalPriceElement.textContent = `$ ${totalPrice < 0 ? 0 : totalPrice}`;
}

// Update selected seats
function updateSelectedSeats() {
  if (selectedSeats.length === 0) {
      selectedSeatsHolder.innerHTML = '<span class="noSelected">No Seat Selected</span>';
  } else {
      selectedSeatsHolder.innerHTML = '';
      selectedSeats.forEach(index => {
          const seat = document.createElement('div');
          seat.className = 'selectedSeat';
          seat.textContent = `Seat ${index + 1}`;
          selectedSeatsHolder.appendChild(seat);
      });
  }
}

// Handle cancel button
cancelBtn.addEventListener('click', () => {
  document.querySelectorAll('#seatCont .seat.selected').forEach(seat => {
      seat.classList.remove('selected');
  });
  selectedSeats = [];
  updateSelectedSeats();
  updateTotalPrice();
});

// Handle proceed button
proceedBtn.addEventListener('click', () => {
  if (selectedSeats.length === 0) {
      alert("Oops no seat Selected");
      return;
  }
  // Update seats to occupied
  document.querySelectorAll('#seatCont .seat.selected').forEach(seat => {
      seat.classList.remove('selected');
      seat.classList.add('occupied');
  });
  selectedSeats = [];
  updateSelectedSeats();
  updateTotalPrice();
  showSuccessModal();
});

// Show success modal
function showSuccessModal() {
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);

  const modal = document.createElement('div');
  modal.className = 'successModal';
  modal.innerHTML = `
      <div class="modalTop">
          <img src="https://example.com/success-icon.png" alt="Success Icon" />
      </div>
      <div class="modalCenter">
          <h1>Booking Successful</h1>
          <p>Your seats have been successfully booked.</p>
      </div>
      <div class="modalBottom">
          <button onclick="closeSuccessModal()">OK</button>
      </div>
  `;
  document.body.appendChild(modal);
}

// Close success modal
function closeSuccessModal() {
  document.querySelector('.overlay').remove();
  document.querySelector('.successModal').remove();
}

// Seat map legend
function updateSeatLegend() {
  seatLegend.innerHTML = `
      <div><span class="seat available"></span> Available</div>
      <div><span class="seat selected"></span> Selected</div>
      <div><span class="seat occupied"></span> Occupied</div>
  `;
}
updateSeatLegend();

// Promo Code Application
applyPromoBtn.addEventListener('click', () => {
  const promoCode = promoCodeInput.value;
  if (promoCode === 'DISCOUNT10') {
      promoDiscount = 10; // Fixed discount amount for simplicity
  } else {
      alert('Invalid promo code');
      promoDiscount = 0;
  }
  updateTotalPrice();
});

// Seat Filtering and Search
seatFilterSelect.addEventListener('change', (event) => {
  const filterValue = event.target.value;
  document.querySelectorAll('#seatCont .seat').forEach(seat => {
      switch (filterValue) {
          case 'available':
              seat.style.display = seat.classList.contains('available') ? 'block' : 'none';
              break;
          case 'selected':
              seat.style.display = seat.classList.contains('selected') ? 'block' : 'none';
              break;
          case 'occupied':
              seat.style.display = seat.classList.contains('occupied') ? 'block' : 'none';
              break;
          default:
              seat.style.display = 'block';
              break;
      }
  });
});

// Reservation Timer
let timer;
function startReservationTimer(duration) {
  let timeLeft = duration;
  timerElement.textContent = formatTime(timeLeft);
  timer = setInterval(() => {
      timeLeft -= 1;
      timerElement.textContent = formatTime(timeLeft);
      if (timeLeft <= 0) {
          clearInterval(timer);
          alert("Reservation time expired!");
          // Handle expired reservation logic
          cancelBtn.click();
      }
  }, 1000);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  return `${minutes}m ${seconds}s`;
}

// Start a 5-minute reservation timer
startReservationTimer(300);






  