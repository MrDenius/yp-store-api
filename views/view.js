const { query } = require("express");
const fetch = require("node-fetch");

const init = (port) => {
	const express = require("express");

	const api = async (params) => {
		_position = undefined;
		_positionsByType = undefined;

		console.log(params);
		const quest = params.q;
		const item = params.i;
		const id = params.id || "60069cf1f8c79a3fb07d8094";
		params.q = undefined;
		params.id = id;
		params.i = undefined;
		let qu = "";
		Object.entries(params).forEach((p) => {
			qu += `${p[0]}=`;
			if (p[1]) qu += p[1];
			qu += "&";
		}); //http://localhost:4000/?q=position&i=name //http://localhost:4000/?q=catalog&type=dog-fod
		//http://localhost:4000/?q=position&i=full&id=600834e92c601024fca59e3f

		switch (item) {
			case "name":
				qu += `name=${(await GetPosition(id)).name}`;
				break;
			case "full":
				qu += `full=1`;
				Object.entries(await GetPosition(id)).forEach((p) => {
					qu += `${p[0]}=`;
					if (p[1]) qu += p[1];
					qu += "&";
				});
				break;
			case "small":
				qu += `small=1`;
				Object.entries(await GetPosition(id)).forEach((p) => {
					qu += `${p[0]}=`;
					if (p[1]) qu += p[1];
					qu += "&";
				});
				break;
		}
		console.log(qu);
		if (quest === "position") {
			return `views/Position/?${qu}`;
		}
		if (quest === "catalog") {
			return `views/Catalog/?${qu}`;
		}
		if (quest === "admin") {
			return `views/Admin/?${qu}`;
		}
		if (quest === "buy") {
			return `views/Buy/?${qu}`;
		}
	};

	let _position;
	const GetPosition = async (id) => {
		if (_position) {
			return _position;
		}
		const query = `#graphql
        {
            position(id: \"${id}\") {
              	type,
              	name,
              	description,
              	price,
              	img,
            }
        }`.replace(/(([ \n])|#graphql)*/g, "");

		const queryData = await (
			await fetch(`${global.address}graphql?query=${query}`)
		).json();
		console.log(queryData);
		_position = queryData.data.position;
		return _position;
	};

	let _positionsByType;
	const GetPositionsByType = async (type) => {
		if (_positionsByType) {
			return _positionsByType;
		}
		const query = `#graphql
        {
            positionsByType(type: \"${type}\") {
				id,
              	name,
              	description,
              	price,
              	img,
            }
        }`.replace(/(([ \n])|#graphql)*/g, "");

		const queryData = await (
			await fetch(`${global.address}graphql?query=${query}`)
		).json();
		console.log(queryData);
		_positionsByType = queryData.data.positionsByType;
		return _positionsByType;
	};

	return api;
};

module.exports = init;
