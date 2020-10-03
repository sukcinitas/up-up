# Voting App
An application to create polls and vote.

----
## Technologies & methodologies
##### Front-end
- TypeScript
- React, React Router
- Redux
- D3
- Font Awesome
- Sass (SCSS syntax)
- BEM naming methodology

##### Back-end
- Node & Express
- MongoDB & Mongoose
- Axios
- Passport (local strategy, connect-mongo for storing sessions)
- Bcryptjs

##### Testing & linting & bundling & compiling
- Jest & React Testing Library
- Webpack 
- Babel
- ESLint (Airbnb & Airbnb-typescript style guides)

----
## Setup
Check the app [here](https://still-bayou-60170.herokuapp.com) (it takes ~ 10 seconds for the sleeping app on Heroku to wake up) or clone this repository - `git clone https://github.com/sukcinitas/voting-app.git`, install dependencies - 
`npm install` (you will need `npm` and `node` installed globally) 

- `npm run dev` - to run the app on [localhost:3000](http://localhost:3000/)
- `npm run test` - to run tests
- `npm run prod` - to run minified app on [localhost:8080](http://localhost:8080/) 

----
## User stories

- As a user, I can see a list of polls. I can choose a way in which list is sorted from two options.
- As a user, I can vote in a poll. My vote is added immediately and reflected in a chart.
- As a user, I can register by providing an email, a username, and a password. Both, username and email must be unique. Password must be at least 6 characters long. Registered users have access to additional functionalities: creating polls and saving polls that interest them.
- As a logged-in user, I can create a poll by providing a poll name, a poll statement/question and at least two options. The number of options can be increased or reduced.
- As a logged-in user, I can delete the posts I have created either in profile page or specific poll page.
- As a logged-in user, I can save posts I like. A list of saved polls can be accessed in a profile page.
- As a logged-in user, I have an access to my profile page. In profile page I can change my user information (password, email) or delete user account entirely. I can see list of polls I have created, and a list of polls I have saved.