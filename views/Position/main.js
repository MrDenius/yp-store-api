const urlParams = new URLSearchParams(window.location.search);
const content = document.querySelector("#content");

const init = async () => {
	for (var p of urlParams.entries()) {
		let value = p[1];
		switch (p[0]) {
			case "name":
				Name(value, content.name);
				break;
			case "description":
				Description(value, content.description);
				break;
			case "price":
				Price(value, content.price);
				break;
			case "img":
				Img(value, content.img);
				break;
			case "full":
				await Full();
				break;
			case "small":
				await Small();
				break;
			default:
				break;
		}
	}
};

const StartPay = () => {};

const Full = async () => {
	document.body.innerHTML = await (await fetch("./full.html")).text();

	content.name = document.querySelector("#name");
	content.description = document.querySelector("#description");
	content.price = document.querySelector("#price");
	content.img = document.querySelector("#img");

	content.price.addEventListener("click", StartPay);
};

const Small = async () => {
	document.body.innerHTML = await (await fetch("./small.html")).text();

	content.name = document.querySelector("#name");
	content.price = document.querySelector("span#price");
	content.img = document.querySelector("#img");

	content.description = "disable";
};

const Name = (text, content) => {
	if (content === "disable") return;
	content = content || this.content;
	content.innerHTML = text;
	content.classList = "name";
};

const Description = (text, content) => {
	if (content === "disable") return;
	content = content || this.content;
	content.innerHTML = text;
	content.classList = "description";
};

const Price = (text, content) => {
	if (content === "disable") return;
	content = content || this.content;
	content.innerHTML = `${text}`;
	content.classList = "price";
};

const Img = (url, content) => {
	if (content === "disable") return;
	content = content || this.content;
	const img = document.createElement("img");
	img.src = url;
	img.classList = "img";
	content.appendChild(img);
	content.classList = "img";
};

init();