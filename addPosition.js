const Init = () => {
	const imgur = require("imgur");
	const fetch = require("node-fetch");
	const addPos = (body) => {
		body.img = body.img.replace(/data(.*)base64,/g, "");

		imgur
			.uploadBase64(body.img)
			.then((res) => {
				const query = `#graphql
            mutation {
                addPosition(type: "${body.type}", name: "${body.name}", description:"${body.description}", price:${body.price}, img:"${res.data.link}"){
                    id
                }
				}`.replace(/(([ \n])|#graphql)*/g, "");
				console.log(query);
				console.log(res);
				console.log(`${global.address}graphql`);
				fetch(`${global.address}graphql`, {
					method: "POST",
					body: JSON.stringify({
						query: query,
					}),
					headers: { "Content-Type": "application/json" },
				})
					.then((res) => {
						return res.status;
					})
					.catch((err) => {
						console.error(err);
					});
			})
			.catch((err) => {
				console.error(err);
			});
	};

	return addPos;
};

module.exports = Init;
