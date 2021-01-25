const mongo = require("mongoose");
const Schema = mongo.Schema;

const payInfoSchema = new Schema({
	payCode: String,
	billId: String,
	date: Date,
});

module.exports = mongo.model("PayInfo", payInfoSchema);
