# Ripaw 

Ripaw is a Flask - React fullstack clone of many different parts of common banking apps. It was built to act as a way for me to practice engaging with data and presenting it in more meaningful ways to a customer. The longterm learning intention is to develop the skills required to show a potential future employer that I can interact with and manipulate data in meaningful ways.

## Live Site
- **See what I am working on: ** [Ripaw](https://ripbawbanking.onrender.com/)

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

## To Get Started (Bash / Zsh)

1. Clone this respository

2. Create **.env** files based on the development examples.

3. Get into your shell

4. Install dependencies
```bash
pipenv install -r requirements.txt
```

5. Install Node.js Dependencies:
```bash
cd react-app
npm install
```

6. Start the backend:
```bash
flask db upgrade
flask seed all
flask run
```

7. Start the frontend:
```bash
cd react-app
npm start
```

7. The application will now be running at [http://localhost:3000/](http://localhost:3000/).

## Functionality & MVPs

### Authentication

A user can:
- Sign Up
- Log In
- Log Out

Demo User available

### Accounts

A user can:
- View their account(s)
- Open an account
- Edit an account
- Close an account

### Transactions

A user can:
- View transactions for their account(s)
- Create a transaction request
- Cancel a pending transaction
- Edit a pending transaction

Admins can delete a transaction.

### Messaging

A user can:
- Send messages
- Delete their last message sent

Upcoming Features:
Friends
Sending Transactions through messaging (via websockets)
