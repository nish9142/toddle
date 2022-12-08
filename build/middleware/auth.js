"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var constants_1 = require("../utils/constants");
var authMiddleware = function (req, res, next) {
    var _a, _b;
    try {
        var bearerHeader = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization;
        var bearerToken = bearerHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(bearerToken, constants_1.JWT_SECRET_KEY);
        var jwtData = jsonwebtoken_1.default.decode(bearerToken, {
            complete: true,
            json: true,
        });
        if (!((_b = jwtData === null || jwtData === void 0 ? void 0 : jwtData.payload) === null || _b === void 0 ? void 0 : _b.user)) {
            throw new Error('Invalid user');
        }
        //@ts-ignore
        req.user = jwtData.payload.user;
        next();
    }
    catch (error) {
        res.status(403).send({ error: 'Invalid token or token expired' });
    }
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.js.map