# Interview Scheduler
React based SPA with API calls, persistent data (PostgreSQL) and dynamical page rendering. Connected to the WebSocket server, so two or more users can see updates in the real time.

## Functionality

Add a new interview by clicking the "+" button. Type the student name and select an interviewer. Save interview by clicking "Save" button.

!["Video of functionality"](https://github.com/PolinaSkrobot/Scheduler/blob/master/public/images/Add.gif)

Edit it if you wish.

!["Video of functionality"](https://github.com/PolinaSkrobot/Scheduler/blob/master/public/images/Edit.gif)

Delete an existing interview. Update the number of available interview spots for the day dynamically.

!["Video of functionality"](https://github.com/PolinaSkrobot/Scheduler/blob/master/public/images/Delete.gif)

Websocket allows to make/see changes in real-time on more than one page.

!["Video of functionality"](https://github.com/PolinaSkrobot/Scheduler/blob/master/public/images/Web.gif)
## Setup

Install dependencies with `npm install`. For this project cypress was installed globally.

## Running Webpack Development Server

```sh
npm start
```

## Running Jest Test Framework

```sh
npm test
```

## Running Storybook Visual Testbed

```sh
npm run storybook
```
## Dependencies

- "axios": "^0.21.4",
- "classnames": "^2.2.6",
- "fsevents": "^2.3.2",
- "normalize.css": "^8.0.1",
- "react": "^16.9.0",
- "react-dom": "^16.9.0",
- "react-hooks-testing-library": "^0.6.0",
- "react-scripts": "3.0.0"