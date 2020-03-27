# Voting App
An application to create polls and vote.

----
## Technologies & methodologies
##### Front-end
- TypeScript
- React, React Router
- Redux
- D3
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
Check the app [here](https://still-bayou-60170.herokuapp.com) (it takes about 10 seconds for sleeping app on Heroku to wakeup) or clone this repository - `git clone https://github.com/sukcinitas/voting-app.git`, install dependencies - 
`npm install` (you will need `npm` and `node` installed globally) 

- `npm run dev` - to run the app on [localhost:3000](http://localhost:3000/)
- `npm run test` - to run tests
- `npm run prod` - to run minified app on [localhost:8080](http://localhost:8080/) 

----
## Functionalities
- Votings in polls
- Voting results are displayed in bar charts
- Registering to receive additional functionality - to create and manage polls