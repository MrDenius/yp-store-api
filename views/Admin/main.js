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
			content
				.querySelector(`[data-tool="positions-manager"]`)
				.addEventListener("click", Tools.PositionsManager);
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
			});
		});
	},
	PositionsManager: () => {
		const gq = (query) => {
			return fetch("/graphql", {
				method: "POST",
				body: JSON.stringify({
					query: query,
				}),
				headers: { "Content-Type": "application/json" },
			});
		};

		const db = {
			GetPositions: () => {
				const query = `#graphql
				{
					positions{
						id, name, type, description, price, img
					}
				}`.replace(/(([ \n])|#graphql)*/g, "");

				return new Promise((resolve, reject) => {
					gq(query).then((data) => {
						data.json().then((d) => {
							resolve(d.data.positions);
						});
					});
				});
			},
			DeletePosition: (id) => {
				const query = `#graphql
				mutation {
					delPosition(id: "${id}"){
						id
					}
				}`.replace(/(([ \n])|#graphql)*/g, "");

				gq(query).then((data) => {
					console.log(`${id} DELETED!`);
				});
			},
		};

		fetch.tools("PositionsManager").then((data) => {
			content.innerHTML = data;
			content.style.height = window.innerHeight + "px";

			const container = document.querySelector("#pos-con");
			const table = document.createElement("table");
			table.id = "data-tab";
			container.appendChild(table);

			const AddToTable = (con) => {
				const tr = document.createElement("tr");
				let i = 0;
				con.forEach((data) => {
					const td = document.createElement("td");
					td.className = `td${i}`;
					if (typeof data === "string") {
						td.innerText = data;
					} else {
						td.appendChild(data);
					}

					tr.appendChild(td);
					i++;
				});
				table.appendChild(tr);
			};

			AddToTable(["Имя", "Тип", "Цена", "Кнопки управления"]);

			db.GetPositions().then((data) => {
				data.forEach((pos) => {
					let position = document.createElement("div");
					position.id = "position";
					container.appendChild(position);

					const img = document.createElement("img");
					img.id = "img";
					img.src = pos.img;

					const name = document.createElement("div");
					name.id = "name";
					name.textContent = pos.name;

					const description = document.createElement("div");
					description.id = "description";
					description.textContent = pos.description;

					const type = document.createElement("div");
					type.id = "type";
					type.textContent = pos.type;

					const price = document.createElement("div");
					price.id = "price";
					price.textContent = `${pos.price} руб.`;

					//position.appendChild(img);
					//position.appendChild(name);
					//position.appendChild(description);
					//position.appendChild(type);
					//position.appendChild(price);

					const conManButtons = document.createElement("div");
					conManButtons.id = "con-man-buttons";

					const bDel = document.createElement("button");
					bDel.textContent = "УДАЛИТЬ";
					bDel.id = "";
					bDel.onclick = () => {
						db.DeletePosition(pos.id);
						Tools.PositionsManager();
					};

					conManButtons.appendChild(bDel);

					AddToTable([name, type, price, conManButtons]);
				});
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
