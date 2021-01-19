const mongo = require("mongoose");
const Schema = mongo.Schema;

const positionSchema = new Schema({
	type: String,
	name: String,
	description: String,
	price: Number,
	img: String,
});

module.exports = mongo.model("Position", positionSchema);
