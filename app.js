document.getElementById("addPlayer").addEventListener("click", function () {
	let playerName = document.getElementById("playerName").value.trim();
	if (playerName) {
		let li = document.createElement("li");
		li.textContent = playerName;
		document.getElementById("playerList").appendChild(li);
		document.getElementById("playerName").value = "";
	}
});

document.getElementById("generateTeams").addEventListener("click", function () {
	let players = [...document.querySelectorAll("#playerList li")].map((li) => li.textContent);
	if (players.length < 2) {
		alert("Enter at least two players!");
		return;
	}
	document.getElementById("loading").classList.remove("hidden");
	setTimeout(() => {
		shuffleArray(players);
		let mid = Math.ceil(players.length / 2);
		document.getElementById("ctTeam").innerHTML = players
			.slice(0, mid)
			.map((p) => `<li>${p}</li>`)
			.join("");
		document.getElementById("trTeam").innerHTML = players
			.slice(mid)
			.map((p) => `<li>${p}</li>`)
			.join("");
		document.getElementById("loading").classList.add("hidden");
		document.getElementById("teams").classList.remove("hidden");
	}, 2000);
});

function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}
