"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pool_1 = __importDefault(require("./pool"));
var app_1 = __importDefault(require("./app"));
var isProd = process.env.ENV == 'production';
pool_1.default
    .connect({
    connectionString: process.env.DATABASE_URL ||
        'postgresql://postgres:postgres@localhost:5432/toddle',
    ssl: isProd && {
        rejectUnauthorized: false,
    },
})
    .then(function () {
    var port = process.env.port || 8080;
    app_1.default.listen(port, function () {
        console.log('Listening on port', port);
    });
})
    .catch(function (err) { return console.error(err); });
//# sourceMappingURL=index.js.map