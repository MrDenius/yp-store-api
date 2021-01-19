const init = (port) => {
	const express = require("express");

	const api = (params) => {
		console.log(params);
		let qu = "";
		Object.entries(params).forEach((p) => {
			qu += `${p[0]}=`;
			if (p[1]) qu += p[1];
			qu += "&";
		}); //http://localhost:4000/?q=position
		params.q = undefined;
		if (params.q === "position") {
			{
				return `views/Position/?${qu}`;
			}
		}
	};

	return api;
};

module.exports = init;
