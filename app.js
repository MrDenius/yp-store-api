const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./schema/schema");
const db = require("./db");

const port = process.env.PORT || 4000;

const app = express();
const mongo = db();
const view = require("./views/view")(port);

app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		graphiql: true,
	})
);

app.use("/views/", express.static(__dirname + "/views/"));

app.get("/", (req, res) => {
	res.redirect(view(req.query));
});

const server = app.listen(port, () => {
	console.log(`Server started on http://localhost:${server.address().port}/`);
});
