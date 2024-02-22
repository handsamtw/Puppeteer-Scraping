## How to test the API

1. Clone the repository
2. cd to the repo's directory
3. run `npm install` to install dependency
4. Run `node api.js` to activate the server
5. Turn on the browser or Postman and make GET request

- Example Request
  - `http://localhost:3000/new york`
    - get new york house listing on Redfin(by default only parse information of page 1)
  - `http://localhost:3000/new%20york?from_page=1&to_page=6`
    - get new york house listing from page 1 to page 6
