"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = __importDefault(require("pg"));
var Pool = /** @class */ (function () {
    function Pool() {
        this._pool = null;
    }
    Pool.prototype.connect = function (options) {
        this._pool = new pg_1.default.Pool(options);
        return this._pool.query('SELECT 1 + 1;');
    };
    Pool.prototype.close = function () {
        return this._pool.end();
    };
    Pool.prototype.query = function (sql, params) {
        return this._pool.query(sql, params);
    };
    return Pool;
}());
exports.default = new Pool();
//# sourceMappingURL=pool.js.map