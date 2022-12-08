"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var express_1 = __importDefault(require("express"));
var assignmentRepo_1 = __importDefault(require("../repo/assignmentRepo"));
var submissionRepo_1 = __importDefault(require("../repo/submissionRepo"));
var userRepo_1 = require("../repo/userRepo");
var filters_1 = require("../types/filters");
var helpers_1 = require("../utils/helpers");
var router = express_1.default.Router();
router.post('/create', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, user, requiredKeys, publishDate, deadLineDate, assignment, submissions, error_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                payload = req.body || {};
                user = req.user;
                requiredKeys = ['description', 'published_at', 'deadline_at'];
                (0, helpers_1.allRequiredKeysPresent)(requiredKeys, payload, res);
                publishDate = new Date(payload.published_at);
                deadLineDate = new Date(payload.deadline_at);
                //@ts-ignore
                if (deadLineDate - publishDate < 0) {
                    throw new Error('Deadline date is before publish date');
                }
                if (user.user_type !== userRepo_1.USER_TYPE.TUTOR) {
                    throw new Error('Unauthorized user');
                }
                if (!(Array.isArray(payload === null || payload === void 0 ? void 0 : payload.students) && ((_a = payload === null || payload === void 0 ? void 0 : payload.students) === null || _a === void 0 ? void 0 : _a.length) > 0)) return [3 /*break*/, 2];
                return [4 /*yield*/, areAllUsersStudents(payload.students)];
            case 1:
                _b.sent();
                return [3 /*break*/, 3];
            case 2:
                payload.students = null;
                _b.label = 3;
            case 3:
                payload.user_id = user.id;
                return [4 /*yield*/, assignmentRepo_1.default.createAssignment(payload)];
            case 4:
                assignment = _b.sent();
                submissions = [];
                if (!(payload === null || payload === void 0 ? void 0 : payload.students)) return [3 /*break*/, 6];
                return [4 /*yield*/, submissionRepo_1.default.createSubmissions(assignment.id, payload.students)];
            case 5:
                //verify all users are students
                submissions = _b.sent();
                _b.label = 6;
            case 6: return [2 /*return*/, res.json({ assignment: assignment, submissions: submissions })];
            case 7:
                error_1 = _b.sent();
                console.error(error_1);
                res.status(500).send({ error: error_1 === null || error_1 === void 0 ? void 0 : error_1.message });
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); });
router.put('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var payload, user, assignmentId, assignment, updateAssignment, updatedAssignment, submissions, error_2;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 9, , 10]);
                payload = req.body || {};
                user = req.user;
                assignmentId = parseInt(req.params.id);
                return [4 /*yield*/, assignmentRepo_1.default.getAssignmentById(assignmentId)];
            case 1:
                assignment = _b.sent();
                return [4 /*yield*/, isValidUserForAssignment(user, assignment, userRepo_1.USER_TYPE.TUTOR)];
            case 2:
                _b.sent();
                updateAssignment = __assign(__assign({}, assignment), payload);
                if (!(Array.isArray(payload === null || payload === void 0 ? void 0 : payload.students) && ((_a = payload === null || payload === void 0 ? void 0 : payload.students) === null || _a === void 0 ? void 0 : _a.length) > 0)) return [3 /*break*/, 4];
                return [4 /*yield*/, areAllUsersStudents(payload.students)];
            case 3:
                _b.sent();
                return [3 /*break*/, 5];
            case 4:
                payload.students = null;
                _b.label = 5;
            case 5: return [4 /*yield*/, assignmentRepo_1.default.updateAssignment(updateAssignment)];
            case 6:
                updatedAssignment = _b.sent();
                submissions = {};
                if (!payload.students) return [3 /*break*/, 8];
                return [4 /*yield*/, submissionRepo_1.default.updateUserSubmissionsForAssignment(assignmentId, payload === null || payload === void 0 ? void 0 : payload.students)];
            case 7:
                submissions = _b.sent();
                _b.label = 8;
            case 8: return [2 /*return*/, res.json({ assignment: updatedAssignment, submissions: submissions })];
            case 9:
                error_2 = _b.sent();
                console.error(error_2);
                res.status(500).send({ error: error_2 === null || error_2 === void 0 ? void 0 : error_2.message });
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); });
router.delete('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, assignmentId, assignment, deletedAssignment, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                user = req.user;
                assignmentId = parseInt(req.params.id);
                return [4 /*yield*/, assignmentRepo_1.default.getAssignmentById(assignmentId)];
            case 1:
                assignment = _a.sent();
                return [4 /*yield*/, isValidUserForAssignment(user, assignment, userRepo_1.USER_TYPE.TUTOR)];
            case 2:
                _a.sent();
                return [4 /*yield*/, assignmentRepo_1.default.deleteAssignment(assignmentId)];
            case 3:
                deletedAssignment = _a.sent();
                return [2 /*return*/, res.json({ deletedAssignment: deletedAssignment })];
            case 4:
                error_3 = _a.sent();
                console.error(error_3);
                res.status(500).send({ error: error_3 === null || error_3 === void 0 ? void 0 : error_3.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
router.post('/submit/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, assignmentId, assignment, submission, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                user = req.user;
                assignmentId = parseInt(req.params.id);
                return [4 /*yield*/, assignmentRepo_1.default.getAssignmentById(assignmentId)];
            case 1:
                assignment = _a.sent();
                return [4 /*yield*/, isValidUserForAssignment(user, assignment, userRepo_1.USER_TYPE.STUDENT)];
            case 2:
                _a.sent();
                return [4 /*yield*/, submissionRepo_1.default.getSubmission(user.id, assignmentId)];
            case 3:
                submission = _a.sent();
                if (!submission) {
                    throw new Error('Student cant submit to this assignment');
                }
                return [4 /*yield*/, submissionRepo_1.default.updateSubmission(user.id, assignmentId)];
            case 4:
                submission = _a.sent();
                return [2 /*return*/, res.json({ submission: submission })];
            case 5:
                error_4 = _a.sent();
                console.error(error_4);
                res.status(500).send({ error: error_4 === null || error_4 === void 0 ? void 0 : error_4.message });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); });
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user, payload, assignments, submissions, error_5;
    var _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 6, , 7]);
                user = req.user;
                payload = req.body || {};
                payload.publishAt = (payload === null || payload === void 0 ? void 0 : payload.publishAt)
                    ? payload === null || payload === void 0 ? void 0 : payload.publishAt.toUpperCase()
                    : filters_1.PUBLISH_STATUS.ALL;
                payload.status = (payload === null || payload === void 0 ? void 0 : payload.status)
                    ? payload === null || payload === void 0 ? void 0 : payload.status.toUpperCase()
                    : filters_1.SUBMISSION_STATUS.ALL;
                payload.limit = (_a = payload === null || payload === void 0 ? void 0 : payload.limit) !== null && _a !== void 0 ? _a : 20;
                payload.skip = (_b = payload === null || payload === void 0 ? void 0 : payload.skip) !== null && _b !== void 0 ? _b : 0;
                if (isNaN(payload.limit) || isNaN(payload.skip)) {
                    throw new Error("Limit or Skip value is invalid");
                }
                if (!(user.user_type === userRepo_1.USER_TYPE.TUTOR)) return [3 /*break*/, 2];
                if (!filters_1.PUBLISH_STATUS_VALUES.includes(payload.publishAt)) {
                    throw new Error("publishAt value is invalid");
                }
                return [4 /*yield*/, assignmentRepo_1.default.getAssignmentsByUserId(user.id, payload.publishAt, payload.limit, payload.skip)];
            case 1:
                assignments = _c.sent();
                return [2 /*return*/, res.json({ assignments: assignments })];
            case 2:
                if (!(user.user_type === userRepo_1.USER_TYPE.STUDENT)) return [3 /*break*/, 4];
                if (!filters_1.PUBLISH_STATUS_VALUES.includes(payload.publishAt) ||
                    !filters_1.SUBMISSION_STATUS_VALUES.includes(payload.status)) {
                    throw new Error("publishAt or status value is invalid");
                }
                return [4 /*yield*/, submissionRepo_1.default.getSubmissionsByUserId(user.id, payload.publishAt, payload.status, payload.limit, payload.skip)];
            case 3:
                submissions = _c.sent();
                return [2 /*return*/, res.json({ submissions: submissions })];
            case 4:
                res.status(500).send({ error: 'Something went wrong' });
                _c.label = 5;
            case 5: return [3 /*break*/, 7];
            case 6:
                error_5 = _c.sent();
                console.error(error_5);
                res.status(500).send({ error: error_5 === null || error_5 === void 0 ? void 0 : error_5.message });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); });
var areAllUsersStudents = function (studentIds) { return __awaiter(void 0, void 0, void 0, function () {
    var users, _i, users_1, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, userRepo_1.UserRepo.getUsersByIds(studentIds)];
            case 1:
                users = _a.sent();
                if (studentIds.length !== users.length) {
                    throw new Error('Found Invalid user Id in students');
                }
                for (_i = 0, users_1 = users; _i < users_1.length; _i++) {
                    user = users_1[_i];
                    if (user.user_type !== userRepo_1.USER_TYPE.STUDENT) {
                        throw new Error("user ".concat(user.id, " is not a student"));
                    }
                }
                return [2 /*return*/];
        }
    });
}); };
var isValidUserForAssignment = function (user, assignment, type) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (user.user_type !== type) {
            throw new Error('Unauthorized user');
        }
        if (!assignment) {
            throw new Error('Assignment not found');
        }
        if (type === userRepo_1.USER_TYPE.TUTOR && user.id !== assignment.user_id) {
            throw new Error('Unauthorized operation');
        }
        return [2 /*return*/];
    });
}); };
exports.default = router;
//# sourceMappingURL=assignmentRoutes.js.map