"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = __importDefault(require("./middleware/auth"));
var userRoute_1 = __importDefault(require("./routes/userRoute"));
var assignmentRoutes_1 = __importDefault(require("./routes/assignmentRoutes"));
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//public routes
app.use(userRoute_1.default);
app.use(auth_1.default);
//private routes
app.use('/assignments', assignmentRoutes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map