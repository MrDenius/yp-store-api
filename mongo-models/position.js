const mongo = require("mongoose");
const Schema = mongo.Schema;

const positionSchema = new Schema({
	type: String,
	name: String,
	description: String,
	price: Number,
});

module.exports = mongo.model("Position", positionSchema);
