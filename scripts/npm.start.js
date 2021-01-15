const fullstack = "fullstack";
const client = "client";
const server = "server";
const commands = {
	back: "cd server && npm start",
	common: "cd common && npm start",
	front: "cd client && npm start",
};
const allowedAliases = {
	all: fullstack,
	e2e: fullstack,
	fullstack: fullstack,
	client: client,
	react: client,
	front: client,
	server: server,
	back: server,
};
const requestedProject = allowedAliases[process.argv[2]] || fullstack;

if (requestedProject === fullstack) {
	console.log("Starting Yahalom-tests E2E");
	return execChild(
		`concurrently "(${commands.back})" "(${commands.front})" "${
			commands.common
		}"`
	);
}
if (requestedProject === client) {
	console.log("Starting Yahalom-tests Client");
	return execChild(commands.front);
}
if (requestedProject === server) {
	console.log("Starting Yahalom-tests Server");
	return execChild(
		`concurrently "(${commands.back})" "(${commands.common})"`
	);
}

async function execChild(command) {
	const { exec } = require("child_process");
	const child = exec(command);
	child.stdout.pipe(process.stdout);
	child.stderr.pipe(process.stderr);
	const exitCode = await new Promise((resolve, _) => {
		child.on("exit", resolve);
	});

	if (exitCode) {
		throw new Error(`exited with code: ${exitCode}`);
	}
}
