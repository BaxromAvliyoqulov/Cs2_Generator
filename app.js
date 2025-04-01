const players = [];
const maps = ["Mirage", "Inferno", "Nuke", "Overpass", "Ancient", "Anubis", "Vertigo"];
let selectedMapMode = "bo1";
let finalSidesText = "";
let team1Players = [];
let team2Players = [];

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
		team1Players = shuffledPlayers.slice(0, half);
		team2Players = shuffledPlayers.slice(half);

		const team1List = document.getElementById("team1List");
		const team2List = document.getElementById("team2List");

		if (!team1List || !team2List) {
			console.error("team1List yoki team2List topilmadi!");
			return;
		}

		team1List.innerHTML = team1Players.map((p) => `<li>${p}</li>`).join("");
		team2List.innerHTML = team2Players.map((p) => `<li>${p}</li>`).join("");

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
		loadingDiv.remove();

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
		loadingDiv.remove();

		const randomSide = Math.random() < 0.5 ? "CT" : "TR";
		const team1Side = randomSide;
		const team2Side = randomSide === "CT" ? "TR" : "CT";

		finalSidesText = `Team 1: ${team1Side} | Team 2: ${team2Side}`;

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

	// Ensure we're using the teams created in generateTeams()
	const teamSides = finalSidesText.split("|");
	const team1Side = teamSides[0].trim().split(": ")[1].trim();
	const team2Side = teamSides[1].trim().split(": ")[1].trim();

	let finalPlayers = `
    <div class="final-team" id="team">
        <h3>Team 1️⃣ (${team1Side})</h3>
        <ol>${team1Players.map((player) => `<li>${player}</li>`).join("")}</ol>
    </div>

    <hr style="width: 50%; height: 3px; background-color: blue; margin: auto; border: none;" class="max"/>

    <div class="final-team" id="team">
        <h3>Team 2️⃣ (${team2Side})</h3>
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

	// Remove any existing close button before adding a new one
	const existingButton = document.getElementById("restartButton");
	if (existingButton) {
		existingButton.remove();
	}

	let closeButton = document.createElement("button");
	closeButton.id = "restartButton";
	closeButton.innerText = "Close & Restart";
	closeButton.style.marginTop = "20px";
	closeButton.style.padding = "10px 20px";
	closeButton.style.fontSize = "18px";
	closeButton.style.cursor = "pointer";
	closeButton.addEventListener("click", restartGame);

	document.getElementById("finalResultsScreen").appendChild(closeButton);
}

function restartGame() {
	// Reset all screens
	document.querySelectorAll(".screen").forEach((screen) => screen.classList.add("hidden"));

	// Reset the final results screen
	document.getElementById("finalResultsScreen").classList.add("hidden");

	// Show the initial screen
	document.getElementById("modeSelection").classList.remove("hidden");

	// Clear final results
	document.getElementById("finalTeamsDisplay").innerHTML = "";
	document.getElementById("finalMapsDisplay").innerHTML = "";
	document.getElementById("finalSidesDisplay").innerHTML = "";

	// Clear stored teams
	team1Players = [];
	team2Players = [];

	// Remove close button
	const closeButton = document.getElementById("restartButton");
	if (closeButton) {
		closeButton.remove();
	}
}

// Улучшенная функция создания и перемешивания игроков
function generatePlayers(playerCount) {
    let players = [];
    // Создаем массив игроков
    for (let i = 1; i <= playerCount; i++) {
        players.push(`Player${i}`);
    }
    // Тщательно перемешиваем массив используя алгоритм Фишера-Йетса
    for (let i = players.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [players[i], players[j]] = [players[j], players[i]];
    }
    return players;
}

// Random map tanlash
function pickRandomMap() {
	const maps = ["Dust2", "Mirage", "Inferno", "Nuke", "Overpass", "Ancient", "Train", "Vertigo"];
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

// === Quick Start funksiyasi ===
function startGameQuick() {
    // Создаем и перемешиваем 10 игроков
    const playerNames = generatePlayers(10);
    
    // Делим на команды (уже перемешанный массив)
    const half = Math.floor(playerNames.length / 2);
    team1Players = playerNames.slice(0, half);
    team2Players = playerNames.slice(half);

    // Остальной код остается без изменений
    // Xaritalarni tanlash
	const selectedMaps = [];
	while (selectedMaps.length < 5) {
		let randomMap = maps[Math.floor(Math.random() * maps.length)];
		if (!selectedMaps.includes(randomMap)) selectedMaps.push(randomMap);
	}

	// Jamoa tomonlarini aniqlash
	const randomSide = Math.random() < 0.5 ? "CT" : "TR";
	const team1Side = randomSide;
	const team2Side = randomSide === "CT" ? "TR" : "CT";
	finalSidesText = `Team 1: ${team1Side} | Team 2: ${team2Side}`;

	// Natijalarni ko'rsatish
	document.getElementById("finalResultsScreen").classList.remove("hidden");
	document.getElementById("modeSelection").classList.add("hidden");

	let finalPlayers = `
    <div class="final-team" id="team">
        <h3>Team 1️⃣ (${team1Side})</h3>
        <ol>${team1Players.map((player) => `<li>${player}</li>`).join("")}</ol>
    </div>

    <hr style="width: 50%; height: 3px; background-color: blue; margin: auto; border: none;" class="max"/>

    <div class="final-team" id="team">
        <h3>Team 2️⃣ (${team2Side})</h3>
        <ol>${team2Players.map((player) => `<li>${player}</li>`).join("")}</ol>
    </div>
    `;

	let finalMaps = `<h3><strong>Maps Order:</strong></h3><ol>${selectedMaps
		.map((m) => `<li>${m}</li>`)
		.join("")}</ol>`;

	document.getElementById("finalTeamsDisplay").innerHTML = finalPlayers;
	document.getElementById("finalMapsDisplay").innerHTML = finalMaps;
	document.getElementById(
		"finalSidesDisplay"
	).innerHTML = `<p style="font-size:22px; font-weight:bold;">${finalSidesText}</p>`;

	// Remove any existing close button before adding a new one
	const existingCloseButton = document.getElementById("restartButton");
	if (existingCloseButton) {
		existingCloseButton.remove();
	}

	let closeButton = document.createElement("button");
	closeButton.id = "restartButton";
	closeButton.innerText = "Close & Restart";
	closeButton.style.marginTop = "20px";
	closeButton.style.padding = "10px 20px";
	closeButton.style.fontSize = "18px";
	closeButton.style.cursor = "pointer";
	closeButton.addEventListener("click", restartGame);

	document.getElementById("finalResultsScreen").appendChild(closeButton);

	// Show the regenerate button only in quick game mode
	const regenerateButton = document.getElementById("regenerateButton");
	regenerateButton.classList.remove("hidden");
}

function showResults() {
	document.getElementById("finalResultsScreen").classList.remove("hidden");
	document.getElementById("teamDecisionScreen").classList.add("hidden");

	// Ensure we're using the teams created in generateTeams()
	const teamSides = finalSidesText.split("|");
	const team1Side = teamSides[0].trim().split(": ")[1].trim();
	const team2Side = teamSides[1].trim().split(": ")[1].trim();

	let finalPlayers = `
    <div class="final-team" id="team">
        <h3>Team 1️⃣ (${team1Side})</h3>
        <ol>${team1Players.map((player) => `<li>${player}</li>`).join("")}</ol>
    </div>

    <hr style="width: 50%; height: 3px; background-color: blue; margin: auto; border: none;" class="max"/>

    <div class="final-team" id="team">
        <h3>Team 2️⃣ (${team2Side})</h3>
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

	// Remove any existing close button before adding a new one
	const existingButton = document.getElementById("restartButton");
	if (existingButton) {
		existingButton.remove();
	}

	let closeButton = document.createElement("button");
	closeButton.id = "restartButton";
	closeButton.innerText = "Close & Restart";
	closeButton.style.marginTop = "20px";
	closeButton.style.padding = "10px 20px";
	closeButton.style.fontSize = "18px";
	closeButton.style.cursor = "pointer";
	closeButton.addEventListener("click", restartGame);

	document.getElementById("finalResultsScreen").appendChild(closeButton);

	// Hide the regenerate button in normal game mode
	const regenerateButton = document.getElementById("regenerateButton");
	regenerateButton.classList.add("hidden");
}
