
# URL shortener microservice

created as a part of [FCC](https://learn.freecodecamp.org/)'s APIs and microservices projects, url-shortener is a humble project that uses [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/) to generate short URLs that redirect to your originally long URL

https://shortyurlme.herokuapp.com/

## Installation and testing
```bash
git clone https://github.com/muubar/url-shortener-microservice.git
npm install
```
make sure you have a mongod running version 3.2.x of MongoDB, set the `MONGODB_DB` to your database name, and `MONGODB_URI` to your [mongo connection URI](https://docs.mongodb.com/manual/reference/connection-string/) in the `package.json` file:
```javascript
	"scripts": {
		"test": "cross-env NODE_ENV=test PORT=3000 MONGODB_DB=%YOUR_DB_NAME% MONGODB_URI=%YOUR_CONNECTION_URI% mocha --timeout 10000 --sort"
	}
  ```

then run the following command:
```bash
npm run test
```
