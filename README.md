# Twilio Sync JS Quickstart with React

This is an example project for [Twilio Sync](https://www.twilio.com/docs/sync) that uses Javascript and React. 

This application shows you how you might implement cobrowsing in a React application with Twilio Sync. For instance, a customer could be talking to a customer service agent over a voice connection for help filling out a form on a web application. After starting a cobrowsing session, both the agent and the customer can edit and modify the form in real time.

We use Twilio Sync to manage the React application's form data, as well as the list of participants in the cobrowsing session.

You can use this application as the base for your own cobrowsing projects, or you can explore the code in this application to learn more about how to implement solutions with Twilio Sync.

## Prerequisites

You need a recent version of Node.js, as well as a Twilio account.

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

To run the quickstart in development node, you will need to run two commands, in two different command windows. Run them in this order:

`node server.js`

`npm start`

Watch for any errors in the command line for either one of these applications when they start.

## Up and Running

Running `yarn start` will open up a local web browser that points to (http://localhost:3000/), where you will find the web application up and running.

Open two tabs, and log in to the cobrowsing session with two different usernames.

Change the form data in one tab, and you will see it change in the other tab.

# Created with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
