const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./schema/schema");
const db = require("./db");

const app = express();
const mongo = db();

app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		graphiql: true,
	})
);

const server = app.listen(process.env.PORT || 4000, (port, address) => {
	console.log(`Server started on http://localhost:${server.address().port}/`);
});
