# Twilio Sync JS Quickstart with React

This is an example project for [Twilio Sync](https://www.twilio.com/docs/sync) that uses Javascript and React.

This application shows you how you might implement cobrowsing in a React application with Twilio Sync. For instance, a customer could be talking to a customer service agent over a voice connection for help filling out a form on a web application. After starting a cobrowsing session, both the agent and the customer can edit and modify the form in real time.

We use Twilio Sync to manage the React application's form data, as well as the list of participants in the cobrowsing session.

You can use this application as the base for your own cobrowsing projects, or you can explore the code in this application to learn more about how to implement solutions with Twilio Sync.

## Prerequisites

You need Node.js version 16.20.2 or older; newer versions are not supported, as well as a Twilio account.

For more on how to install Node.js, see [How to set up your Node.js Development Environment](https://www.twilio.com/docs/usage/tutorials/how-to-set-up-your-node-js-and-express-development-environment).

If you need to create a Twilio account, you can sign up here: [Try Twilio](https://www.twilio.com/try-twilio).

## Steps to Run the Application

Before you can run the application, you need to fill in your Twilio credentials, and provide a Sync Service id to work with.

### Create a .env file

Copy the `.env.example` file to a new file named `.env`

### Edit the .env file

Replace the placeholder values in the `.env` file with the appropriate values from your Twilio Console.

| Config Value  | Description |
| :-------------  |:------------- |
`TWILIO_ACCOUNT_SID` | Your primary Twilio account identifier - find this [in the console here](https://www.twilio.com/console).
`TWILIO_API_KEY` | Used to authenticate - [generate one here](https://www.twilio.com/console/dev-tools/api-keys).
`TWILIO_API_SECRET` | Used to authenticate - [just like the above, you'll get one here](https://www.twilio.com/console/dev-tools/api-keys).
`TWILIO_SYNC_SERVICE_SID` | Sync Service | [Generate one in the Twilio Sync console](https://www.twilio.com/console/sync/services)


### Run `npm install`

Run the `npm install` command to download the Javascript dependencies for the project.

## Running the Quickstart in Development Mode

To run the quickstart in development node, run the following command:

`npm start`

Watch for any errors in the command line as they start.

Your web browser will open up to (http://localhost:3000/) with the React app.

Open two tabs, and log in to the cobrowsing session with two different usernames.

Change the form data in one tab, and you will see it change in the other tab.

# Created with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Learn More about React and Create React App

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
