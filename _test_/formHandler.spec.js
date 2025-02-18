import { handleFormSubmit, parseLocation } from '../src/client/js/formHandler.js';
import { saveTicket, loadTickets } from '../src/client/js/ticketStorage.js';
import { waitFor } from '@testing-library/react'; 

jest.mock('../src/client/js/ticketStorage.js'); // Mock saveTicket and loadTickets to avoid interacting with localStorage

describe('formHandler.js', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <form id="input-form">
                <input type="text" id="country" value="New York, USA">
                <input type="date" id="date" value="2025-05-20">
                <button type="submit" id="submit">Submit</button>
            </form>
            <section id="output-section" style="display: none;">
                <p id="time-remaining"></p>
                <p id="population"></p>
                <p id="weather"></p>
                <img id="capital-photo" src="" alt="" />
            </section>
        `;
        // Mock API response
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({
                    population: 1000000,
                    weather: 'Sunny',
                    imageUrl: 'https://example.com/photo.jpg',
                    timeRemaining: 50
                }),
            })
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should handle form submission correctly', async () => {
        const form = document.getElementById('input-form');
        form.addEventListener('submit', handleFormSubmit);
        
        // Simulate form submission
        form.dispatchEvent(new Event('submit'));

        // Wait for fetch response and DOM updates
        await Promise.resolve();  // Flush microtasks queue
        await waitFor(() => expect(document.getElementById('population').textContent).toBe('Population: 1000000'));

        // Check if the API was called correctly
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:4200/analyze-from-api', expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({
                locationName: 'New York, USA',
                date: '2025-05-20'
            }),
        }));

        // Check if the page content was updated correctly
        expect(document.getElementById('population').textContent).toBe('Population: 1000000');
        expect(document.getElementById('weather').textContent).toBe('Weather: Sunny');
        expect(document.getElementById('capital-photo').src).toBe('https://example.com/photo.jpg');
        expect(document.getElementById('time-remaining').textContent).toBe('Days until travel: 50');

        // Check if the ticket was saved
        expect(saveTicket).toHaveBeenCalledWith({
            country: 'New York, USA',
            date: '2025-05-20',
            population: 1000000,
            weather: 'Sunny',
            imageUrl: 'https://example.com/photo.jpg',
            timeRemaining: 50,
        });
    });

    test('should parse location correctly', () => {
        const result = parseLocation('New York, USA');
        expect(result).toEqual(['USA', 'New York']);
    });

    test('should return empty country if location format is incorrect', () => {
        const result = parseLocation('New York');
        expect(result).toEqual(['New York', '']);
    });
});
