const cli = require("cli");

global.debug = false;
if (process.env.NODE_ENV === "development") {
	global.debug = true;
	cli.debug("=====Development mode=====");
}

const port = process.env.PORT || 4000;

if (global.debug) {
	global.address = `http://localhost:${port}/`;
} else {
	global.address = `https://yp-store-api.herokuapp.com/`;
}

let _progress = 0;
const INIT_STEPS = 2;
const InitingProgress = (mes) => {
	//cli.spinner(`[${_progress}/${INIT_STEPS}] Starting...`, true);
	_progress += 1;
	cli.info(`[${_progress}/${INIT_STEPS}] ${mes}`);
	if (_progress === INIT_STEPS) {
		cli.ok(`Init finished successfully!`);
		cli.info(`Started on ${global.address}`);
		//cli.spinner("Starting sucessful!", true);
	}
};
cli.info("Start initing started!");
//cli.spinner("Starting...");

const express = require("express");
const bodyParser = require("body-parser");
const { graphqlHTTP } = require("express-graphql");

const schema = require("./schema/schema");
const db = require("./db");

const app = express();
const mongo = db(() => {
	InitingProgress("MongoDB connection opened successfully");
});
const view = require("./views/view")(port);
const login = require("./login")();
const addPosition = require("./addPosition")();

app.use(
	"/graphql",
	graphqlHTTP({
		schema,
		graphiql: true,
	})
);
app.use(bodyParser.urlencoded({ extended: true }));

//app.use("/views/", view.static);
//console.log(view.static);

app.use("/views/", express.static(__dirname + "/views/"));

app.get("/", async (req, res) => {
	res.redirect(await view(req.query));
});

app.post("/login", (req, res) => {
	if (login(req.body) === "sucess") {
		res.redirect("/?q=admin&login=1");
	} else {
		res.send("Login or pasword error!");
	}
});

app.post("/addPosition", (req, res) => {
	res.send(addPosition(req.body));
});

const server = app.listen(port, () => {
	InitingProgress("Api inited!");
});
