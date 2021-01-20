const urlParams = new URLSearchParams(window.location.search);
const content = document.querySelector("#content");

const Init = async () => {
	const positions = await GetPositionsByType(urlParams.get("type"));
	console.log(positions);

	positions.forEach((pos) => {
		AddPosition(pos);
	});
};

const AddPosition = (pos) => {
	const frame = document.createElement("iframe");
	frame.id = "frame";

	let src = `../Position/?small=1&`;

	Object.entries(pos).forEach((p) => {
		src += `${p[0]}=`;
		if (p[1]) src += p[1];
		src += "&";
	});

	frame.src = src;
	frame.addEventListener("load", () => {
		frame.contentWindow.document.addEventListener("click", () => {
			window.location.href = `/?q=position&i=full&id=${pos.id}`;
		});
	});

	content.appendChild(frame);
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

	const queryData = await (await fetch(`/graphql?query=${query}`)).json();
	console.log(queryData);
	_positionsByType = queryData.data.positionsByType;
	return _positionsByType;
};

Init();
