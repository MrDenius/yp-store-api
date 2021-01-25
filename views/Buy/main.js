const urlParams = new URLSearchParams(window.location.search);
const content = document.querySelector("#content");
const billId = urlParams.get("bid");

const Init = async () => {
	const billInfo = await CheckStatus();
	console.log(billInfo);
	InsertInfo(billInfo);
};

const InsertInfo = (billInfo) => {
	const $tp = content.querySelector("#top-panel");
	const $desc = content.querySelector("#description");
	const $pu = content.querySelector("#pay-url");
	const $price = $tp.children[0];
	const $status = $tp.children[1];

	$desc.innerHTML = billInfo.comment;
	$price.innerHTML = `${billInfo.amount.value} ${billInfo.amount.currency}`;
	$pu.onclick = () => window.open(billInfo.payUrl, "_blank");

	$tp.classList = "";
	$desc.classList = "";
	if (billInfo.status.value != "PAID") $pu.classList = "";

	content.querySelector("#logo").classList = "hide";
	content.querySelector("#loading").classList = "hide";
};

const GetBillInfo = async () => {
	return await (await fetch(`/pay?check=${billId}`)).json();
};

const CheckStatus = async () => {
	const status = content.querySelector("#status");
	const $pu = content.querySelector("#pay-url");
	const Check = async () => {
		const bInfo = await GetBillInfo();

		switch (bInfo.status.value) {
			case "WAITING":
				status.innerHTML = "Ожидание";
				status.style.color = "#FFFB00";
				break;
			case "REJECTED":
				status.innerHTML = "Отклонён";
				status.style.color = "#FFFB00";
				break;
			case "PAID":
				status.innerHTML = "Оплачено";
				status.style.color = "#00FF00";
				$pu.classList = "hide";
				const $su = content.querySelector("#sucess");
				$su.classList = "";
				$su.querySelector(
					"#payCode"
				).innerHTML = `${bInfo.payInfo.payCode}`;
				return bInfo;
			default:
				status.innerHTML = bInfo.status.value;
				status.style.color = "#FF0000";
				break;
		}

		setTimeout(Check, 1000);
		return bInfo;
	};

	return await Check();
};

Init();
