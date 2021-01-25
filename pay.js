const Init = (secret) => {
	secret = secret || global.secret;
	const publicKey =
		"48e7qUxn9T7RyYE1MVZswX1FRSbE6iyCj2gCRwwF3Dnh5XrasNTx3BGPiMsyXQFNKQhvukniQG8RTVhYm3iPxePvizCAzKgioNQj55gdHzong7SPAbP7fZ2Cnt1izMGNmZhLPHfWnJX3jpDBdaNomGvZ7dLMWAq8pWbbk8grn8Nvz9dzPJErcVSNwqmtP";
	const SECRET_KEY =
		"eyJ2ZXJzaW9uIjoiUDJQIiwiZGF0YSI6eyJwYXlpbl9tZXJjaGFudF9zaXRlX3VpZCI6InRpdDA4by0wMCIsInVzZXJfaWQiOiI3OTE0NjYyMTQxMSIsInNlY3JldCI6ImU4ZGEwNDgzMTMzYTM5OWQ0ZmFiNzQ4ZTJkYzIyN2ZhZGQ2MzFkMWNjZGFmMjU4Yjc2MWM0OTY3NWQxNjk0NTgifX0=";
	const QiwiBillPaymentsAPI = require("@qiwi/bill-payments-node-js-sdk");
	const qiwiApi = new QiwiBillPaymentsAPI(SECRET_KEY);
	const crypto = require("crypto");

	const api = (req, res) => {
		const body = req.body;
		const query = req.query;

		if (query.secret) {
			if (query.secret === secret) {
				console.log({ body: body, query: query, req: req });
				res.sendStatus(200);
			}
		} else {
			StartPay(query.price, res);
		}
	};

	const GetBillId = () => {
		return crypto
			.createHash("sha256")
			.update(Date.now().toString())
			.digest("hex");
	};

	const StartPay = (price, res) => {
		const params = {
			publicKey,
			amount: price,
			billId: GetBillId(),
		};

		const link = qiwiApi.createPaymentForm(params);
		res.redirect(link);
	};

	return api;
};

module.exports = Init;
