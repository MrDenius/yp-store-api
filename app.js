global.debug = process.env.debug || false;

const port = process.env.PORT || 4000;

if (global.debug) {
	global.address = `http://localhost:${port}/`;
} else {
	global.address = `https://yp-store-api.herokuapp.com/`;
}

const express = require("express");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./schema/schema");
const db = require("./db");

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

//app.use("/views/", view.static);
//console.log(view.static);

app.use("/views/", express.static(__dirname + "/views/"));

app.get("/", async (req, res) => {
	res.redirect(await view(req.query));
});

const server = app.listen(port, () => {
	console.log(`Server started on http://localhost:${server.address().port}/`);
});
