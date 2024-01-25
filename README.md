# Ripaw 

Ripaw is a Flask - React fullstack clone of many different parts of common banking apps. It was built to act as a way for me to practice engaging with data and presenting it in more meaningful ways to a customer. The longterm learning intention is to develop the skills required to show a potential future employer that I can interact with and manipulate data in meaningful ways.

## Live Site
- **See what I am working on!: ** [Ripaw](https://ripbawbanking.onrender.com/)

## Technologies Used

To be sorted: Websockets
Future implementation: Charting data using Canvas

### Frontend
- JavaScript
- React
- Redux
- WebSockets: Used for enabling real-time communication features.

### Backend
- PostgreSQL
- Python
- Flask
- SQLAlchemy
- WebSockets: Integrated to manage real-time data exchange and updates from the frontend.

## To Get Started

1. Clone this respository

2. Create **.env** files based on the development examples.

3. Get into your shell

4. Install dependencies
```bash
pipenv install -r requirements.txt
```

5. Install Node.js Dependencies (for the React frontend):
```bash
cd react-app
npm install
```

6. Run the start.sh Script to Start the Application by navigating back to the root directory and using:
```bash
npm run start-fullstack
```
or
```bash
./start.sh
```

Update Needed:

Installation and setup instructions needed.
Create a single line command to start everything if possible.

Add User experience
Add all routes

Upcoming Features:
Friends
Sending Transactions through messaging (via websockets)
