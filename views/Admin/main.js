const urlParams = new URLSearchParams(window.location.search);
const content = document.querySelector("body");

fetch.tools = (toolName) =>
	fetch(`./Tools/${toolName}.html`).then((res) => res.text());

const Init = () => {
	if (urlParams.get("login") === "1") {
		LoginSucess();
	}
};

const LoginSucess = () => {
	content.innerHTML = "<h1>Loading....<h1/>";

	fetch("./aPanel.html")
		.then((res) => res.text())
		.then((data) => {
			content.innerHTML = data;
			content
				.querySelector(`[data-tool="add-position"]`)
				.addEventListener("click", Tools.AddPosition);
		});
};

const Tools = {
	AddPosition: () => {
		fetch.tools("AddPosition").then((data) => {
			content.innerHTML = data;
			content.style.height = window.innerHeight + "px";

			dragDrop(content.querySelector("#dropTarget"), (result) => {
				const img = document.createElement("img");
				img.src = result;

				img.className = "img";

				content.querySelector("#dropTarget").remove();
				content.querySelector("#img").appendChild(img);

				document.querySelector("#img-input").value = result;
				document.querySelector("#sub").click();
			});
		});
	},
};

//#region Drag-Drop

function dragDrop(elem, listeners) {
	elem.ondrop = (ev) => dropHandler(ev);
	elem.ondragover = (ev) => dragOverHandler(ev);

	let $dropzone = elem;
	let dt;

	function dropHandler(ev) {
		console.log("File(s) dropped");
		dt = ev.dataTransfer;
		// Prevent default behavior (Prevent file from being opened)
		ev.stopPropagation();
		ev.preventDefault();

		let reader = new FileReader();
		reader.onload = function () {
			if (listeners) listeners(reader.result);
		};
		reader.readAsDataURL(ev.dataTransfer.files[0]);
	}

	function dragOverHandler(ev) {
		console.log("File(s) in drop zone");
		ev.dataTransfer.dropEffect = "copy";

		// Prevent default behavior (Prevent file from being opened)
		ev.preventDefault();
		ev.stopPropagation();
	}
}

//#endregion

Init();
