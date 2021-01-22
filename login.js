const admin = {
	login: "admin",
	password: "admin",
};

const Init = () => {
	const api = (postData) => {
		console.log(postData);
		if (
			postData.login === admin.login &&
			postData.password === admin.password
		) {
			return "sucess";
		}
		return "error";
	};

	return api;
};

module.exports = Init;
