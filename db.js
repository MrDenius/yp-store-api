const init = (callback) => {
	const mongo = require("mongoose");
	mongo.connect(
		"mongodb+srv://server:nvUubzRUz5VQO2Lf@cluster0.cutzl.mongodb.net/yp-store-vault?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	);
	mongo.connection.once("open", callback);

	return mongo;
};

module.exports = init;
