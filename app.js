const players = [];
const maps = ["Mirage", "Inferno", "Nuke", "Overpass", "Ancient", "Anubis", "Vertigo"];
let selectedMapMode = "bo1";
let finalSidesText = "";

document.addEventListener("keydown", function (event) {
	if (event.key === "Enter") {
		const activeScreen = document.querySelector(".screen:not(.hidden)");

		if (activeScreen.id === "playerInputScreen") {
			generateTeams();
		} else if (activeScreen.id === "teamScreen") {
			nextStep();
		} else if (activeScreen.id === "mapSelectionScreen") {
			chooseMapMode(selectedMapMode);
		} else if (activeScreen.id === "mapScreen") {
			finalStep();
		} else if (activeScreen.id === "teamDecisionScreen") {
			showResults();
		}
	}
});

function startGame(playerCount) {
	players.length = 0;
	document.getElementById("playerInputScreen").classList.remove("hidden");
	document.getElementById("modeSelection").classList.add("hidden");

	const playerInputs = document.getElementById("playerInputs");
	playerInputs.innerHTML = "";

	for (let i = 0; i < playerCount * 2; i++) {
		const input = document.createElement("input");
		input.type = "text";
		input.placeholder = `Player ${i + 1}`;
		input.classList.add("player-input");

		input.addEventListener("input", function () {
			if (input.value.length > 10) {
				input.value = input.value.slice(0, 10);
			}
		});

		input.addEventListener("keydown", function (event) {
			if (event.key === "Enter") {
				event.preventDefault();
				if (i < playerCount * 2 - 1) {
					playerInputs.children[i + 1].focus();
				} else {
					generateTeams();
				}
			}
		});

		players.push(input);
		playerInputs.appendChild(input);
	}

	if (players.length > 0) {
		players[0].focus();
	}
}

function generateTeams() {
	const teamScreen = document.getElementById("teamScreen");
	const loadingDiv = document.createElement("div");
	loadingDiv.classList.add("loading-animation");
	loadingDiv.innerText = "Generating teams...";
	teamScreen.appendChild(loadingDiv);

	setTimeout(() => {
		loadingDiv.remove();

		const playerNames = players.map((input) => input.value.trim()).filter((name) => name.length >= 1);

		if (playerNames.length < players.length) {
			showToast("Iltimos, barcha o'yinchilarni kiriting!", "red");
			return;
		}

		const shuffledPlayers = [...playerNames].sort(() => Math.random() - 0.5);
		const half = Math.floor(shuffledPlayers.length / 2);
		const ctTeam = shuffledPlayers.slice(0, half);
		const trTeam = shuffledPlayers.slice(half);

		const team1List = document.getElementById("team1List");
		const team2List = document.getElementById("team2List");

		if (!team1List || !team2List) {
			console.error("team1List yoki team2List topilmadi!");
			return;
		}

		team1List.innerHTML = ctTeam.map((p) => `<li>${p}</li>`).join("");
		team2List.innerHTML = trTeam.map((p) => `<li>${p}</li>`).join("");

		teamScreen.classList.remove("hidden");
		document.getElementById("playerInputScreen").classList.add("hidden");

		showToast("Teams Generated!", "green");
	}, 1500);
}

function nextStep() {
	document.getElementById("teamScreen").classList.add("hidden");
	document.getElementById("mapSelectionScreen").classList.remove("hidden");
}

function chooseMapMode(mode) {
	selectedMapMode = mode;
	document.getElementById("mapSelectionScreen").classList.add("hidden");
	document.getElementById("mapScreen").classList.remove("hidden");
	generateMaps();
}

function generateMaps() {
	const mapList = document.getElementById("mapList");
	mapList.innerHTML = "";

	const loadingDiv = document.createElement("div");
	loadingDiv.classList.add("loading-animation");
	loadingDiv.innerText = "Generating maps...";
	mapList.appendChild(loadingDiv);

	setTimeout(() => {
		loadingDiv.remove(); // ⬅️ Loading animatsiyasini o‘chirish

		let selectedMaps = [];
		let requiredCount = selectedMapMode === "bo1" ? 1 : selectedMapMode === "bo3" ? 3 : 5;

		while (selectedMaps.length < requiredCount) {
			let randomMap = maps[Math.floor(Math.random() * maps.length)];
			if (!selectedMaps.includes(randomMap)) selectedMaps.push(randomMap);
		}

		mapList.innerHTML = selectedMaps.map((m) => `<li>${m}</li>`).join("");
	}, 1500);
}

function determineSides() {
	const teamDecisionDisplay = document.getElementById("teamDecisionDisplay");
	teamDecisionDisplay.innerHTML = "";

	const loadingDiv = document.createElement("div");
	loadingDiv.classList.add("loading-animation");
	loadingDiv.innerText = "Deciding sides...";
	teamDecisionDisplay.appendChild(loadingDiv);

	setTimeout(() => {
		loadingDiv.remove(); // ⬅️ Loading animatsiyasini o‘chirish

		const randomSide = Math.random() < 0.5 ? "CT" : "TR";
		const team1Side = randomSide;
		const team2Side = randomSide === "CT" ? "TR" : "CT";

		finalSidesText = `Team 1: ${team1Side} | Team 2: ${team2Side}`;

		// **Bu yerda natijani chiqaramiz**
		teamDecisionDisplay.innerHTML = `<p style="font-size:22px; font-weight:bold;">${finalSidesText}</p>`;
	}, 1500);
}

function finalStep() {
	document.getElementById("mapScreen").classList.add("hidden");
	document.getElementById("teamDecisionScreen").classList.remove("hidden");

	determineSides();
}

function showResults() {
	document.getElementById("finalResultsScreen").classList.remove("hidden");
	document.getElementById("teamDecisionScreen").classList.add("hidden");

	const playerNames = players.map((input) => input.value.trim()).filter((name) => name !== "");

	let half = Math.floor(playerNames.length / 2);
	let team1Players = playerNames.slice(0, half);
	let team2Players = playerNames.slice(half);

	let finalSidesText = `Team 1️⃣ - CT | Team 2️⃣ - TR`;

	let finalPlayers = `
	<div class="final-team">
		<h3>Team 1️⃣ (CT)</h3>
		<ol>${team1Players.map((player) => `<li>${player}</li>`).join("")}</ol>
	</div>

	<hr style="width: 50%; height: 3px; background-color: crimson; margin: auto; border: none;" />

	<div class="final-team">
		<h3>Team 2️⃣ (TR)</h3>
		<ol>${team2Players.map((player) => `<li>${player}</li>`).join("")}</ol>
	</div>
`;

	let mapList = document.getElementById("mapList").innerHTML.trim();
	let finalMaps = mapList
		? `<h3><strong>Maps Order:</strong></h3><ol>${mapList}</ol>`
		: `<h3><strong>Maps Order:</strong></h3><p>No maps selected.</p>`;

	document.getElementById("finalTeamsDisplay").innerHTML = finalPlayers;
	document.getElementById("finalMapsDisplay").innerHTML = finalMaps;
	document.getElementById(
		"finalSidesDisplay"
	).innerHTML = `<p style="font-size:22px; font-weight:bold;">${finalSidesText}</p>`;

	let closeButton = document.createElement("button");
	closeButton.innerText = "Close & Restart";
	closeButton.style.marginTop = "20px";
	closeButton.style.padding = "10px 20px";
	closeButton.style.fontSize = "18px";
	closeButton.style.cursor = "pointer";
	closeButton.addEventListener("click", restartGame);

	document.getElementById("finalResultsScreen").appendChild(closeButton);
}

function restartGame() {
	// Barcha screenlarni yopish
	document.querySelectorAll(".screen").forEach((screen) => screen.classList.add("hidden"));

	// **Final Results oynasini ham yashirish**
	document.getElementById("finalResultsScreen").classList.add("hidden");

	// Asosiy boshlang‘ich ekranni ko‘rsatish
	document.getElementById("modeSelection").classList.remove("hidden");

	// Final natijalarni tozalash
	document.getElementById("finalTeamsDisplay").innerHTML = "";
	document.getElementById("finalMapsDisplay").innerHTML = "";
	document.getElementById("finalSidesDisplay").innerHTML = "";

	// **Close tugmasi har safar o‘chib ketadi**
	const closeButton = document.getElementById("finalResultsScreen").querySelector("button");
	if (closeButton) {
		closeButton.remove();
	}
}
// O'yinchilar ro'yxatini avtomatik yaratish
function generatePlayers(playerCount) {
	let players = [];
	for (let i = 1; i <= playerCount; i++) {
		players.push(`Player${i}`);
	}
	return players;
}

// Jamoalarni yaratish
function generateTeams(players) {
	let shuffledPlayers = players.sort(() => Math.random() - 0.5); // Aralashtirish
	let mid = Math.floor(players.length / 2);

	let team1 = shuffledPlayers.slice(0, mid);
	let team2 = shuffledPlayers.slice(mid);

	console.log("Team 1:", team1);
	console.log("Team 2:", team2);
}

// Random map tanlash
function pickRandomMap() {
	const maps = ["Dust2", "Mirage", "Inferno", "Nuke", "Overpass"];
	let selectedMap = maps[Math.floor(Math.random() * maps.length)];
	console.log("Selected Map:", selectedMap);
}

// CT yoki T tomonini aniqlash
function pickRandomSide() {
	let sides = ["CT", "T"];
	let selectedSide = sides[Math.floor(Math.random() * sides.length)];
	console.log("Starting Side:", selectedSide);
}

// O'yinni tugatish
function finishGame() {
	console.log("Game Setup Complete! ✅");
}

// Quick Start funksiyasi
function startGameQuick() {
	let players = generatePlayers(10); // 10 ta Player yaratish

	setTimeout(() => generateTeams(players), 500);
	setTimeout(() => pickRandomMap(), 1000);
	setTimeout(() => pickRandomSide(), 1500);
	setTimeout(() => finishGame(), 2000);
}

// HTML Tugma
document.getElementById("quickStart").addEventListener("click", startGameQuick);
const { Telegraf } = require("telegraf");
const bot = new Telegraf("8150039939:AAER_LPw3SPJXv0lLVkIxGd_stiuBwJOmxc");

bot.start((ctx) => {
	ctx.reply(
		"Salom! 👋 'Cs2 Generator'ga Xush kelipsiz\n\n" +
			"Jamoa, Xaritalarni Random tanlab beradi \n" +
			`ℹ️ Savollaringiz bolsa, "@Baxrom_Dev" ga yozing.`
	);
});

bot.launch();
