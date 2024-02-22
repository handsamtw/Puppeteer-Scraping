## How to test the API

Clone the repository
cd to the repo's directory and run `npm install`
Run `node api.js` to activate the server
Turn on the browser or Postman and make GET request
Example Request
`http://localhost:3000/new york`

- get new york house listing on Redfin(by default only parse information of page 1)
  `http://localhost:3000/new%20york?from_page=1&to_page=6`
- get new york house listing from page 1 to page 6
