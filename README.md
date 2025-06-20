# Whiplash

Whiplash is a full-stack music streaming app featuring a Flask-based API and a React frontend built with Vite. The app lets you explore trending songs and artists, manage your music library, and utilize an admin panel to manage songs.

## Project Structure

- **/api**  
  Contains the Flask API with configurations in [config.py](api/config.py) and core routes in [main.py](api/main.py).  
  The API handles user authentication, song management, and serves data for the music library.

- **/client**  
  Contains the React frontend built with Vite. Key files include:  
  - [index.html](client/index.html): The main HTML file.  
  - [src/main.jsx](client/src/main.jsx): Initializes React, routing, and renders the app.  
  - Components for pages (e.g., [Home.jsx](client/src/components/home/Home.jsx), [Explore.jsx](client/src/components/pages/Explore.jsx)) and forms (e.g., [Login.jsx](client/src/components/forms/Login.jsx), [Register.jsx](client/src/components/forms/Register.jsx)).

## Features

- **Home & Navigation**  
  Browse top songs, artists, and albums with dynamic animations using GSAP.  
  Navigation components are managed in [Navbar.jsx](client/src/components/common_components/Navbar.jsx) and [Footer.jsx](client/src/components/common_components/Footer.jsx).

- **User Authentication**  
  Login and registration forms built with React Hook Form are available in [Login.jsx](client/src/components/forms/Login.jsx) and [Register.jsx](client/src/components/forms/Register.jsx).

- **Music Library**  
  Access your personal library of songs (see [Library.jsx](client/src/components/pages/Library.jsx)).  
  Use features like play/pause, song queues, and more.

- **Admin Panel**  
  Manage songs with options to add ([AddSongForm.jsx](client/src/components/forms/AddSongForm.jsx)) and delete ([DeleteSongForm.jsx](client/src/components/forms/DeleteSongForm.jsx)) tracks.

- **Additional Pages**  
  Explore trending media on the [Explore.jsx](client/src/components/pages/Explore.jsx) page, view individual artist pages ([ArtistPage.jsx](client/src/components/pages/ArtistPage.jsx)) and albums ([AlbumPage.jsx](client/src/components/pages/AlbumPage.jsx)).

## Technologies

- **Frontend:** React, React Router, React Hook Form, GSAP, TailwindCSS, Vite  
- **Backend:** Flask, SQLite (via the music_library.db instance)  
- **Utilities:** Axios for API calls, custom cookie-based authentication ([auth.js](client/src/utils/auth.js), [cookies.js](client/src/utils/cookies.js))

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for the client)
- [Python 3](https://www.python.org/) (for the API)

### Installation

1. **Clone the repository:**

    ```sh
    git clone <repository-url>
    cd Whiplash
    ```

2. **Setup the Flask API:**

    - Navigate to the `/api` folder.
    - Create and activate a virtual environment:
      ```sh
      python -m venv venv
      source venv/bin/activate  # On Windows use: venv\Scripts\activate
      ```
    - Install dependencies:
      ```sh
      pip install -r requirements.txt
      ```
    - Run the API server:
      ```sh
      python main.py
      ```

3. **Setup the React Client:**

    - Navigate to the [client](http://_vscodecontentref_/0) folder.
    - Install npm dependencies:
      ```sh
      npm install
      ```
    - Start the development server:
      ```sh
      npm run dev
      ```
    - Open [index.html](http://_vscodecontentref_/1) in your browser via the provided development URL.

## Build & Deployment

- **Frontend Production Build:**
  ```sh
  npm run build
  ```
