# Voting App

A responsive application for poll creation and voting. You can check the application demo [here](https://up-up.netlify.app/) (it might take ~ 10 seconds for the sleeping app to wake up).

![](https://github.com/sukcinitas/media/blob/master/uu/uu-1.gif)
![](https://github.com/sukcinitas/media/blob/master/uu/uu-2.gif)

---

## Built with

#### Front-end

- TypeScript
- React, React Router
- Redux
- D3
- Font Awesome
- Sass (SCSS syntax), BEM naming methodology

#### Back-end

- Node & Express
- MongoDB & Mongoose
- Axios
- Passport (local strategy, connect-mongo for storing sessions)
- Bcryptjs

##### Testing

- Jest & React Testing Library

##### Bundling

- Webpack

##### Linting

- ESLint (Airbnb & Airbnb-typescript style guides)

##### Compiling

- Babel

---

## Setup

Clone this repository - `git clone https://github.com/sukcinitas/voting-app.git`, install dependencies -
`npm install` (you will need `npm` and `node` installed globally)

- `npm run dev` - to run the app on [localhost:3000](http://localhost:3000/)
- `npm run test` - to run tests
- `npm run prod` - to run minified app on [localhost:8080](http://localhost:8080/)

---

## User stories

- As a user, I can see a list of polls. I can choose a way in which list is sorted from two options.
- As a user, I can vote in a poll. My vote is added immediately and reflected in a chart.
- As a user, I can register by providing an email, a username, and a password. Both, username and email must be unique. Registered users have access to additional functionalities: creating polls and saving polls that interest them.
- As a logged-in user, I can create a poll by providing a poll name, a poll statement/question and at least two options. The number of options can be increased or reduced. Poll options must be unique.
- As a logged-in user, I can delete the posts I have created either in profile page or specific poll page.
- As a logged-in user, I can save posts I like. A list of saved polls can be accessed in a profile page.
- As a logged-in user, I have an access to my profile page. In profile page I can change my user information (password, email) or delete user account entirely (user created polls are deleted as well); all these operations must be password confirmed. In this pages I can see list of polls I have created, and a list of polls I have saved.

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_URI`, `SESS_NAME`, `SESS_SECRET`

## Endpoints

### /api/user

<table>
  <tr>
    <th>URL & HTTP method</th>
    <th>Parameters | req body</th>
    <th>Response</th>
  </tr>
  <tr>
    <td>/api/user/register <code>POST</code></td>
    <td>
      Request body:
      <ul>
        <li><code>{ username: <em>string</em>, email: <em>string</em>, password: <em>string</em> }</code></li>
      </ul>
    </td>
    <td>
      Success response: 
      <ul>
        <li><code>200</code> <code>{ success: true, sessionUser: { userId: <em>string</em>, username: <em>string</em> }' }</code></li>
      </ul>
      Error responses:
      <ul>
        <li><code>400</code> <code>{ success: false, message: 'Username needs to be between 5 to 30 characters long! Password is required! Your password needs to be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character'
        } </code></li>
        <li><code>400</code> <code>{ success: false, message: 'Username is required. Username needs to be between 5 to 30 characters long! Password is required! Your password needs to be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character'
        } </code></li>
        <li><code>400</code> <code>{ success: false, message: 'Your password needs to be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character' } </code></li>
        <li><code>400</code> <code>{ success: false, message: 'Password is required. Your password needs to be at least 10 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character' } </code></li>
        <li><code>400</code> <code>{ success: false, message: 'Username and email are both already in use! Try again!', username_taken: true, email_taken: true } </code></li>
        <li><code>400</code> <code>{ success: false, username_taken: true, message: 'Username is already in use!' }</code></li>
        <li><code>400</code> <code>{ success: false, email_taken: true, message: 'Email is already in use!',
        }</code></li>
        <li><code>500</code> <code>{ success: false, message: 'User could not be registered!', error: err.message }</code></li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>/api/user/login <code>POST</code></td>
    <td>
      Request body:
      <ul>
        <li><code>{ username: <em>string</em>, password: <em>string</em> }</code></li>
      </ul>
    </td>
    <td>
      Success response: 
      <ul>
        <li><code>200</code> <code>{ success: true, sessionUser: { userId: <em>string</em>, username: <em>string</em> }' }</code></li>
      </ul>
      Error responses:
      <ul>
        <li><code>400</code> <code>{ success: false, message: 'Username is required.' }</code></li>
        <li><code>400</code> <code>{ success: false, message: 'Password is required.' }</code></li>
        <li><code>401</code> <code>{ success: false, message: 'Username or password is incorrect!' }</code></li>
        <li><code>500</code> <code>{ success: false, message: 'User could not be authenticated!' }</code></li>
      </ul>
    </td>
  </tr>
    <tr>
    <td>/api/user/login <code>GET</code></td>
    <td>
      none
    </td>
    <td>
      Success responses: 
      <ul>
        <li><code>200</code> <code>{ success: true, user: { userId: <em>string</em>, username: <em>string</em> }' }</code></li>
        <li><code>200</code> <code>{ success: true, user: { userId: '', username: '' }' }</code></li> if not logged in
      </ul>
      Error responses:
      <ul>
        <li><code>500</code> <code>{ success: false, message: 'Could not check if user is logged in!', error: [<em>error message</em>] }</code></li>
      </ul>
    </td>
  </tr>
    </tr>
    <tr>
    <td>/api/user/logout <code>GET</code></td>
    <td>
      none
    </td>
    <td>
      Success response: 
      <ul>
        <li><code>200</code> <code>{ success: true, message: 'User has successfully logged out!' }</code></li>
      </ul>
      Error responses:
      <ul>
        <li><code>500</code> <code>{ success: false, message: 'Logout failed!', error: [<em>error message</em>] }</code></li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>/api/user/profile/:username <code>GET</code></td>
    <td>
      none
    </td>
    <td>
      Success response: 
      <ul>
        <li><code>200</code> <code>{ success: true, user: { starredPolls: <em>string[]</em>,
      _id: <em>string</em>, username: <em>string</em>, email: <em>string</em> }[] }</code></li>
      </ul>
      Error response:
      <ul>
        <li><code>500</code> <code>{ success: false, message: 'User retrieval failed!', error: [<em>error message</em>] }</code></li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>/api/user/profile <code>DELETE</code></td>
    <td>
      Request body:
      <ul>
        <li><code>{ id: <em>string</em>, password: <em>string</em> }</code></li>
      </ul>
    </td>
    <td>
      Success response: 
      <ul>
        <li><code>200</code> <code>{ success: true, message: 'User has been successfully deleted!' }</code></li>
      </ul>
      Error responses:
      <ul>
        <li><code>401</code> <code>{ success: false, message: 'Password is incorrect! Try again!' }</code></li>
        <li><code>500</code> <code>{ success: false, message: 'User deletion failed!', error: [<em>error message</em>] }</code></li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>/api/user/profile <code>PUT</code></td>
    <td>
      Request body:
      <ul>
        <li><code>{ parameter: 'email', email: <em>string</em>, id: <em>string</em>, password: <em>string</em> }</code></li>
        <li><code>{ parameter: 'password, username: <em>string</em>, oldpassword: <em>string</em>, newpassword: <em>string</em> }</code></li>
      </ul>
    </td>
    <td>
      Success responses: 
      <ul>
        <li><code>200</code> <code>{ success: true, message: 'Your email has been successfully updated!' }</code></li>
        <li><code>200</code> <code>{ success: true, message: 'Your password has been successfully updated!' }</code></li>
      </ul>
      Error responses:
      <ul>
        <li><code>400</code> <code>{ success: false, message: 'This e-mail is already in use! Try again!' }</code></li>
        <li><code>400</code> <code>{ success: false, message: 'Password is required.' }</code></li>
        <li><code>400</code> <code>{ success: false, message: 'Password must be at least 10 characters and contain at least one uppercase letter, one lowercase letter, one number and one special character.' }</code></li>
        <li><code>400</code> <code>{ success: false, message: 'Email is required.' }</code></li>
        <li><code>400</code> <code>{ success: false, message: 'Invalid email.' }</code></li>
        <li><code>401</code> <code>{ success: false, message: 'Password is incorrect! Try again!' }</code></li>
        <li><code>500</code> <code>{ success: false, message: 'User update failed!', error: [<em>error message</em>] }</code></li>
      </ul>
    </td>
  </tr>
    <tr>
    <td>/api/user/star-poll <code>PUT</code></td>
    <td>
      Request body:
      <ul>
        <li><code>{ id: <em>string</em>, pollId: <em>string</em> }</code></li>
      </ul>
    </td>
    <td>
      Success responses: 
      <ul>
        <li><code>200</code> <code>{ success: true, message: 'Poll has been successfully saved!' }</code></li>
      </ul>
      Error responses:
      <ul>
        <li><code>500</code> <code>{ success: false, message: 'Could not save the poll!', error: [<em>error message</em>] }</code></li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>/api/user/unstar-poll <code>PUT</code></td>
    <td>
      Request body:
      <ul>
        <li><code>{ id: <em>string</em>, pollId: <em>string</em> }</code></li>
      </ul>
    </td>
    <td>
      Success responses: 
      <ul>
        <li><code>200</code> <code>{ success: true, message: 'Poll has been successfully removed!' }</code></li>
      </ul>
      Error responses:
      <ul>
        <li><code>500</code> <code>{ success: false, message: 'Could not remove the poll from the saved list!', error: [<em>error message</em>] }</code></li>
      </ul>
    </td>
  </tr>
</table>

### /api/polls

<table>
  <tr>
    <td>/api/polls <code>GET</code></td>
    <td>
      none
    </td>
    <td>
      Success response: 
      <ul>
        <li><code>200</code> <code>{ success: true, polls: {id: <em>string</em>, name: <em>string</em>, votes: <em>number</em>, createdBy: <em>string</em>, updatedAt: <em>string</em>}[] }</code></li>
      </ul>
      Error response:
      <ul>
        <li><code>500</code> <code>{ success: false, message: 'Could not retrieve polls!', error: [<em>error message</em>] }</code></li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>/api/polls/:id <code>GET</code></td>
    <td>
      none
    </td>
    <td>
      Success response: 
      <ul>
        <li><code>200</code> <code>{ success: true, poll: {options: <em>{option: <em>string</em>, votes: <em>number</em>}[]</em>, id: <em>string</em>, name: <em>string</em>, question: <em>string</em>, votes: <em>number</em>, createdBy: <em>string</em>, updatedAt: <em>string</em> } }</code></li>
      </ul>
      Error response:
      <ul>
        <li><code>500</code> <code>{ success: false, message: 'Could not retrieve poll information!', error: [<em>error message</em>] }</code></li>
      </ul>
    </td>
  </tr> -->
  <tr>
    <td>/api/polls/:id <code>PUT</code></td>
    <td>
      Request body:
      <ul>
        <li><code>{ option: <em>string</em>, options: <em>string</em>, votes: <em>number</em> }</code></li>
      </ul>
    </td>
    <td>
      Success response: 
      <ul>
        <li><code>200</code> <code>{ success: true, poll: {{options: <em>{option: <em>string</em>, votes: <em>number</em>}[]</em>, id: <em>string</em>, name: <em>string</em>, question: <em>string</em>, votes: <em>number</em>, createdBy: <em>string</em>, updatedAt: <em>string</em> }} }</code></li>
      </ul>
      Error response:
      <ul>
        <li><code>500</code> <code>{ success: false, message: 'Could not be updated!',
        error: [<em>error message</em>]
      }</code></li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>/api/polls/user/:username <code>GET</code></td>
    <td>
      none
    </td>
    <td>
      Success response: 
      <ul>
        <li><code>200</code> <code>{ success: true, polls: {name: <em>string</em>, votes: <em>number</em>, id: <em>string</em> }[]] }</code></li>
      </ul>
      Error response:
      <ul>
        <li><code>500</code> <code>{ success: false, message: 'Could not retrieve polls!',
        error: [<em>error message</em>]
      }</code></li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>/api/polls/create-poll <code>POST</code></td>
    <td>
      Request body:
      <ul>
        <li><code>{ name: <em>string</em>, question: <em>string</em>, options: {<em>string</em>, votes: <em>number</em>}[], createdBy: <em>string</em> }</code></li>
      </ul>
    </td>
    <td>
      Success response: 
      <ul>
        <li><code>200</code> <code>{ success: true, id: string }</code></li>
      </ul>
      Error response:
      <ul>
        <li><code>400</code> <code>{ success: false, message: 'All fields must be filled in for form submission!',
        error: [<em>error message</em>]
        }</code></li>
        <li><code>500</code> <code>{ success: false, message: 'Could not create a poll!',
        error: [<em>error message</em>]
        }</code></li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>/api/polls/starred <code>POST</code></td>
    <td>
      Request body:
      <ul>
        <li><code>{ listOfIds: string[] }</code></li>
      </ul>
    </td>
    <td>
      Success response: 
      <ul>
        <li><code>200</code> <code>{ success: true, polls: {_id: <em>string</em>, name: <em>string</em>, votes: <em>number</em> }[] }</code></li>
      </ul>
      Error response:
      <ul>
        <li><code>500</code> <code>{ success: false, message: 'Could not retrieve polls!',
        error: [<em>error message</em>]
      }</code></li>
      </ul>
    </td>
  </tr>
</table>
