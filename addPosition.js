const Init = () => {
	const imgur = require("imgur");
	const addPos = (body) => {
		imgur.uploadBase64(body.img).then((res) => {
			const query = `#graphql
            mutation {
                addPosition(type: "${body.type}", name: "${body.name}", description:"${body.description}", price:${body.price}, img:"${res}"){
                    id
                }
                }`.replace(/(([ \n])|#graphql)*/g, "");
			fetch({
				url: `${global.address}graphql`,
				method: "POST",
				body: {
					query: query,
				},
			});
		});
	};

	return addPos;
};

module.exports = Init;
