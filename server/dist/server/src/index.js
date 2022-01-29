'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ws_1 = require("ws");
const pg_1 = __importDefault(require("pg"));
const messageHandler_1 = __importDefault(require("./messageHandler"));
const PG_STRING = process.env.DATABASE || "postgres://llisrnjpdesecw:df3b4f1395828a70777b2a2954eb297b206bfa672038d535f2a017484d1978b5@ec2-34-247-151-118.eu-west-1.compute.amazonaws.com:5432/dek446v3vgvqun";
const db = new pg_1.default.Client({
    connectionString: PG_STRING,
    ssl: {
        rejectUnauthorized: false
    }
});
db.connect().then(() => {
    db.query("TRUNCATE TABLE player RESTART IDENTITY CASCADE;");
    db.query("TRUNCATE TABLE room RESTART IDENTITY CASCADE;");
    db.query("TRUNCATE TABLE match RESTART IDENTITY CASCADE;");
});
const PORT = process.env.PORT || 3001;
const server = (0, express_1.default)()
    .use((req, res) => res.send("OK"))
    .listen(PORT, () => console.log(`Listening on ${PORT}`));
const wss = new ws_1.Server({ server });
wss.on('connection', (ws, request) => {
    console.log("Client connected!");
    ws.on('close', () => console.log('Client disconnected!'));
    ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        (0, messageHandler_1.default)(request, message, ws, db);
    });
});
//# sourceMappingURL=index.js.map