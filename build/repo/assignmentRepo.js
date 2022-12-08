"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssignmentRepo = void 0;
var pool_1 = __importDefault(require("../pool"));
var filters_1 = require("../types/filters");
var AssignmentRepo = /** @class */ (function () {
    function AssignmentRepo() {
    }
    AssignmentRepo.createAssignment = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var values, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        values = [
                            data.user_id,
                            data.description,
                            data.published_at,
                            data.deadline_at,
                        ];
                        return [4 /*yield*/, pool_1.default.query("INSERT INTO assignments (user_id,description, published_at, deadline_at)\n       VALUES ($1,$2,$3,$4) RETURNING *;", values)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                }
            });
        });
    };
    AssignmentRepo.getAssignmentById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pool_1.default.query("SELECT * from assignments WHERE id = $1", [id])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                }
            });
        });
    };
    AssignmentRepo.getAssignmentsByUserId = function (user_id, publishStatus, limit, skip) {
        if (limit === void 0) { limit = 20; }
        if (skip === void 0) { skip = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var subQ, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        subQ = '';
                        if (publishStatus === filters_1.PUBLISH_STATUS.ONGOING) {
                            subQ = 'AND published_at <=current_timestamp';
                        }
                        if (publishStatus === filters_1.PUBLISH_STATUS.SCHEDULED) {
                            subQ = 'AND published_at >current_timestamp';
                        }
                        return [4 /*yield*/, pool_1.default.query("SELECT * from assignments WHERE user_id = $1 ".concat(subQ, " LIMIT ").concat(limit, " OFFSET ").concat(skip, ";"), [user_id])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows];
                }
            });
        });
    };
    AssignmentRepo.updateAssignment = function (assignment) {
        return __awaiter(this, void 0, void 0, function () {
            var values, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        values = [
                            assignment.description,
                            assignment.published_at,
                            assignment.deadline_at,
                            new Date().toISOString(),
                            assignment.id,
                        ];
                        return [4 /*yield*/, pool_1.default.query("UPDATE assignments \n       SET description=$1, published_at=$2, deadline_at=$3,updated_at=$4\n      WHERE id=$5 RETURNING *", values)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                }
            });
        });
    };
    AssignmentRepo.deleteAssignment = function (assignmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, pool_1.default.query("DELETE from assignments WHERE id=$1 RETURNING *", [assignmentId])];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                }
            });
        });
    };
    return AssignmentRepo;
}());
exports.AssignmentRepo = AssignmentRepo;
exports.default = AssignmentRepo;
//# sourceMappingURL=assignmentRepo.js.map