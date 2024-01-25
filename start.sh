#!/bin/zsh

# Run Flask migrations
pipenv run flask db upgrade

# Seed the database
pipenv run flask seed all

# Start the Flask server in the background
pipenv run flask run &

# Change directory to the React app
cd react-app

# Start the React development server
npm start
