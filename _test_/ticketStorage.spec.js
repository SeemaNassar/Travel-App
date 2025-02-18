import { saveTicket, loadTickets } from '../src/client/js/ticketStorage';

describe('ticketStorage.js', () => {
    // Set up mocks for localStorage
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
        // Mock document elements
        document.body.innerHTML = `
            <div id="tickets-list"></div>
        `;
    });

    // Test saveTicket function
    test('should save a ticket to localStorage', () => {
        const ticket = {
            country: 'USA',
            date: '2025-05-20',
            timeRemaining: 50,
            population: 1000000,
            weather: 'Sunny',
            imageUrl: 'https://example.com/photo.jpg',
        };

        saveTicket(ticket); 

        // Check if the ticket was saved in localStorage
        const savedTickets = JSON.parse(localStorage.getItem('tickets'));
        expect(savedTickets).toHaveLength(1); // Expect one ticket to be saved
        expect(savedTickets[0].country).toBe(ticket.country); 
        expect(savedTickets[0].date).toBe(ticket.date); 
    });

    // Test loadTickets function
    test('should load tickets from localStorage and render them correctly', () => {
        // Create a ticket and save it to localStorage
        const ticket = {
            country: 'USA',
            date: '2025-05-20',
            timeRemaining: 50,
            population: 1000000,
            weather: 'Sunny',
            imageUrl: 'https://example.com/photo.jpg',
        };
        localStorage.setItem('tickets', JSON.stringify([ticket]));
    
        // Call loadTickets to render the tickets
        loadTickets();
    
        // Check if the ticket appears in the DOM
        const ticketElement = document.querySelector('.ticket');
        expect(ticketElement).not.toBeNull(); // The ticket should be in the DOM
        expect(ticketElement.innerHTML).toContain(ticket.country); // Check the country
        expect(ticketElement.innerHTML).toContain(ticket.date); // Check the date
        expect(ticketElement.innerHTML).toContain(String(ticket.population)); // Convert population to string before checking
        expect(ticketElement.innerHTML).toContain(ticket.weather); // Check the weather
        expect(ticketElement.innerHTML).toContain(ticket.imageUrl); // Check the image URL
    });
    
    // Test deleting a ticket
    test('should delete a ticket from localStorage when delete button is clicked', () => {
        // Create and save two tickets to localStorage
        const ticket1 = {
            country: 'USA',
            date: '2025-05-20',
            timeRemaining: 50,
            population: 1000000,
            weather: 'Sunny',
            imageUrl: 'https://example.com/photo1.jpg',
        };
        const ticket2 = {
            country: 'Canada',
            date: '2025-06-15',
            timeRemaining: 100,
            population: 2000000,
            weather: 'Cloudy',
            imageUrl: 'https://example.com/photo2.jpg',
        };
        localStorage.setItem('tickets', JSON.stringify([ticket1, ticket2]));

        // Load tickets into the DOM
        loadTickets();

        // Get the delete button for the first ticket
        const deleteButton = document.querySelectorAll('.delete-icon')[0];

        // Simulate a click event on the delete button
        deleteButton.dispatchEvent(new MouseEvent('click'));

        // Check if the ticket has been removed from localStorage
        const updatedTickets = JSON.parse(localStorage.getItem('tickets'));
        expect(updatedTickets).toHaveLength(1); // Only one ticket should remain

        // Check if the remaining ticket is the second one
        expect(updatedTickets[0].country).toBe('Canada');
    });

    // Test loadTickets with expired tickets
    test('should mark expired tickets correctly', () => {
        const expiredTicket = {
            country: 'USA',
            date: '2020-05-20', // Past date
            timeRemaining: -10,
            population: 1000000,
            weather: 'Sunny',
            imageUrl: 'https://example.com/photo.jpg',
        };
        localStorage.setItem('tickets', JSON.stringify([expiredTicket]));

        // Load tickets and check if the expired class is added
        loadTickets();

        const ticketElement = document.querySelector('.ticket');
        expect(ticketElement.innerHTML).toContain('(Expired)'); // Should show expired message
    });
});
