const { query } = require("express");
const fetch = require("node-fetch");

const init = (port) => {
	const express = require("express");

	const api = async (params) => {
		console.log(params);
		const quest = params.q;
		const item = params.i || "";
		const id = params.id;
		params.q = undefined;
		params.id = undefined;
		params.i = undefined;
		let qu = "";
		Object.entries(params).forEach((p) => {
			qu += `${p[0]}=`;
			if (p[1]) qu += p[1];
			qu += "&";
		}); //http://localhost:4000/?q=position&i=name

		switch (item) {
			case "name":
				qu += `name=${
					(await GetPosition("60069cf1f8c79a3fb07d8094")).name
				}`;
				break;
		}
		if (quest === "position") {
			{
				return `views/Position/?${qu}`;
			}
		}
	};

	const GetPosition = async (id) => {
		const query = `#graphql
        {
            position(id: \"${id}\") {
              type,
              name,
              description,
              price,
            }
        }`.replace(/(([ \n])|#graphql)*/g, "");

		const queryData = await (
			await fetch(`${global.address}graphql?query=${query}`)
		).json();
		console.log(queryData);
		return queryData.data.position;
	};

	return api;
};

module.exports = init;
