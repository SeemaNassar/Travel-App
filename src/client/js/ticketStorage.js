// ticketStorage.js

// Save ticket to localStorage
export function saveTicket(ticket) {
    let tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    tickets.push(ticket);
    localStorage.setItem('tickets', JSON.stringify(tickets));
    loadTickets();
}

// Load saved tickets from localStorage
export function loadTickets() {
    const tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    const ticketsList = document.getElementById('tickets-list');
    ticketsList.innerHTML = ''; // Clear previous tickets
    tickets.forEach((ticket, index) => {
        // Check if the date is in the past
        const travelDate = new Date(ticket.date);
        const today = new Date();
        const isExpired = travelDate < today; // Check if travel date has passed

        // Display ticket details including population, weather, image, etc.
        const ticketElement = document.createElement('div');
        ticketElement.classList.add('ticket');
        ticketElement.innerHTML = `
            <h3>Travel Ticket</h3>
            <p><strong>Country:</strong> ${ticket.country}</p>
            <p><strong>Travel Date:</strong> ${ticket.date} ${isExpired ? '<span style="color:red;">(Expired)</span>' : ''}</p>
            <p><strong>Days Remaining:</strong> ${ticket.timeRemaining}</p>
            <p><strong>Population:</strong> ${ticket.population}</p>
            <p><strong>Weather:</strong> ${ticket.weather}</p>
            ${ticket.imageUrl ? `<img src="${ticket.imageUrl}" alt="Photo" />` : ''} <!-- Display image if available -->
            <button class="delete-icon" data-index="${index}">X</button>
        `;
        
        // Append the ticket element to the list
        ticketsList.appendChild(ticketElement);
    });

    // Add event listeners to delete buttons
    const deleteButtons = document.querySelectorAll('.delete-icon');
    deleteButtons.forEach(button => {
        button.addEventListener('click', handleDeleteTicket);
    });
}

// Handle delete ticket
function handleDeleteTicket(event) {
    const ticketIndex = event.target.getAttribute('data-index');
    let tickets = JSON.parse(localStorage.getItem('tickets')) || [];
    tickets.splice(ticketIndex, 1); // Remove the ticket from the array
    localStorage.setItem('tickets', JSON.stringify(tickets));
    loadTickets(); // Reload tickets to display updated list
}
