const urlParams = new URLSearchParams(window.location.search);
const content = document.querySelector("#content");

const init = () => {
	for (var p of urlParams.entries()) {
		let value = p[1];
		switch (p[0]) {
			case "name":
				Name(value);
				break;
			default:
				break;
		}
	}
};

const Name = (text) => {
	content.innerHTML = text;
	content.classList = "name";
};

init();
