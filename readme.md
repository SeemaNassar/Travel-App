# Project Name: Travel App

## Introduction
The **Travel App** allows users to plan trips by entering a destination and travel date. It fetches and displays weather information, along with an image of the destination, helping users make better travel decisions.

## Features
- Input a country and a travel date to receive a weather forecast for that location.
- Fetch and display images of the destination to enhance the user experience.
- Utilize multiple APIs for location data, weather, and images.

## Dependencies
This project uses the following libraries and tools:
1. **Express.js**: Handles server-side logic.
2. **Webpack**: Bundles JavaScript files.
3. **Jest**: Used for testing.
4. **Node-fetch**: Handles API requests.
5. **HTML & CSS**: Provides front-end structure and styling.

## APIs
The project integrates the following APIs:
1. **GeoNames API**: For fetching geographical data.
2. **Weatherbit API**: For retrieving weather information based on the destination.
3. **Pixabay API**: For fetching destination images.

## Note for API Keys:
- The app uses three API keys: **Weatherbit API key**, **Pixabay API key**, and **GeoNames username**.
- The API keys used in **server.js** are stored in the **.env** file.
- To update API keys in **server.js**, modify them in the **.env** file.

## Installation and Running the Project:
1. Ensure you are using **Node.js** version `v20.15.1` or higher.
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. To build the production version and see the dist files:
   ```bash
   npm run build-prod
   ```
4. To start the server and open the app on localhost:4200:
   ```bash
   npm start
   ```
5. For development mode and running the app on localhost:3000:
   ```bash
   npm run build-dev
   ```

## Tests:
- To run the test suite:
   ```bash
   npm run test
   ```

## Deployment with Netlify:
To deploy your project on Netlify, follow these simple steps:

1. **Push your code to GitHub:** Ensure your project is pushed to a GitHub repository.

2. **Connect with Netlify:** Go to Netlify, sign up or log in, and click "New site from Git".

3. **Choose GitHub:** Authorize Netlify to access your GitHub account and select the repository you want to deploy.

4. **Configure Build Settings:** For most static sites, the default build settings are sufficient. You can specify the build command (e.g., npm run build-prod) and the output directory (e.g., dist).

6. **Environment Variables:** configure the same environment variables (you have them iside .env) on Netlify by add them there.

5. **Deploy:** Click "Deploy site" and let Netlify handle the build and deployment process.

Once deployed, Netlify will provide you with a live URL, which you can use to access your site. You can also set up custom domains and automatic deployments for future updates.

[Visit Travel App](seema-travel-app.netlify.app)

---

Thank you, Seema Nassar.
