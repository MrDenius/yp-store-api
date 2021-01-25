const Init = (secret) => {
	secret = secret || global.secret;
	const publicKey =
		"48e7qUxn9T7RyYE1MVZswX1FRSbE6iyCj2gCRwwF3Dnh5XrasNTx3BGPiMsyXQFNKQhvukniQG8RTVhYm3iPxePvizCAzKgioNQj55gdHzong7SPAbP7fZ2Cnt1izMGNmZhLPHfWnJX3jpDBdaNomGvZ7dLMWAq8pWbbk8grn8Nvz9dzPJErcVSNwqmtP";
	const SECRET_KEY =
		"eyJ2ZXJzaW9uIjoiUDJQIiwiZGF0YSI6eyJwYXlpbl9tZXJjaGFudF9zaXRlX3VpZCI6InRpdDA4by0wMCIsInVzZXJfaWQiOiI3OTE0NjYyMTQxMSIsInNlY3JldCI6ImU4ZGEwNDgzMTMzYTM5OWQ0ZmFiNzQ4ZTJkYzIyN2ZhZGQ2MzFkMWNjZGFmMjU4Yjc2MWM0OTY3NWQxNjk0NTgifX0=";
	const QiwiBillPaymentsAPI = require("@qiwi/bill-payments-node-js-sdk");
	const qiwiApi = new QiwiBillPaymentsAPI(SECRET_KEY);
	const crypto = require("crypto");
	const fetch = require("node-fetch");

	const api = (req, res) => {
		const body = req.body;
		const query = req.query;

		if (query.secret) {
			if (query.secret === secret) {
				console.log({ body: body, query: query, req: req });
				res.sendStatus(200);
			}
		} else if (query.check) {
			StartCheck(query.check, res);
		} else {
			StartPay(query.price, res, query);
		}
	};

	const GetBillId = () => {
		return crypto
			.createHash("sha256")
			.update(Date.now().toString())
			.digest("hex");
	};

	const StartCheck = (billId, res) => {
		qiwiApi
			.getBillInfo(billId)
			.then(async (data) => {
				res.setHeader("Content-Type", "application/json");
				if (data.status.value === "PAID") {
					data.payInfo = await GetPayInfo(data.billId, res);
				}
				res.send(JSON.stringify(data));
			})
			.catch((err) => {
				res.sendStatus(500);
			});
	};

	const GetPayInfo = (billId, res) => {
		return new Promise((resolve, reject) => {
			qiwiApi.getBillInfo(billId).then((data) => {
				if (data.status.value != "PAID") {
					res.sendStatus(500);
					return;
				}

				const query = `#graphql
				{PayInfoByBillId(billId: "${data.billId}", date:"${new Date(
					data.status.changedDateTime
				).getTime()}"){
						billId,date,payCode,
					},}`.replace(/(([ \n])|#graphql)*/g, "");

				fetch(`${global.address}graphql?query=${query}`)
					.then((res) => {
						res.json()
							.then((data) => {
								resolve(data.data.PayInfoByBillId);
							})
							.catch((err) => {
								console.error(err);
							});
					})
					.catch((err) => {
						console.error(err);
					});
			});
		});
	};

	const StartPay = (price, res, query) => {
		const params = {
			publicKey,
			amount: price,
			billId: GetBillId(),
			currency: "RUB",
			comment: query.comment,
		};

		qiwiApi
			.createBill(params.billId, params)
			.then((data) => {
				res.redirect(`/?q=buy&bid=${params.billId}`);
			})
			.catch((err) => {
				res.sendStatus(500);
			});
	};

	return api;
};

module.exports = Init;
