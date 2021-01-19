const init = () => {
	const mongo = require("mongoose");
	mongo.connect(
		"mongodb+srv://server:nvUubzRUz5VQO2Lf@cluster0.cutzl.mongodb.net/yp-store-vault?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	);
	mongo.connection.once("open", () => {
		console.log("connected to mongodb");
	});
};

module.exports = init;
