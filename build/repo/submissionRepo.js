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
exports.SubmissionRepo = void 0;
var sql_1 = __importDefault(require("sql"));
var pool_1 = __importDefault(require("../pool"));
var filters_1 = require("../types/filters");
sql_1.default.setDialect('postgres');
var submission = sql_1.default.define({
    name: 'submissions',
    schema: 'public',
    columns: {
        id: { dataType: 'INTEGER' },
        user_id: { dataType: 'INTEGER' },
        assignment_id: { dataType: 'INTEGER' },
        submitted_at: { dataType: 'TIMESTAMP' },
    },
});
var assignment = sql_1.default.define({
    name: 'assignments',
    schema: 'public',
    columns: {
        id: { dataType: 'INTEGER' },
        user_id: { dataType: 'INTEGER' },
        description: { dataType: 'TEXT' },
        published_at: { dataType: 'TIMESTAMP' },
        deadline_at: { dataType: 'TIMESTAMP' },
    },
});
var SubmissionRepo = /** @class */ (function () {
    function SubmissionRepo() {
    }
    SubmissionRepo.createSubmissions = function (assignmentId, userIds) {
        return __awaiter(this, void 0, void 0, function () {
            var submissions, query, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        submissions = userIds.map(function (id) {
                            return { user_id: id, assignment_id: assignmentId };
                        });
                        query = submission
                            .insert(submissions)
                            .returning(submission.star())
                            .toQuery();
                        return [4 /*yield*/, pool_1.default.query(query)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows];
                }
            });
        });
    };
    SubmissionRepo.updateUserSubmissionsForAssignment = function (assignmentId, userIds) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows, oldUsersIds, usersToAdd, usersToDelete, addedSubmissions, _a, deletedSubmissions, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        query = submission
                            .select(submission.star())
                            .where(submission.assignment_id.equals(assignmentId))
                            .toQuery();
                        return [4 /*yield*/, pool_1.default.query(query)];
                    case 1:
                        rows = (_c.sent()).rows;
                        oldUsersIds = rows.map(function (submission) { return submission.user_id; });
                        usersToAdd = userIds.filter(function (newUserId) { return !oldUsersIds.includes(newUserId); });
                        usersToDelete = oldUsersIds.filter(function (oldUserId) { return !userIds.includes(oldUserId); });
                        if (!(usersToAdd === null || usersToAdd === void 0 ? void 0 : usersToAdd.length)) return [3 /*break*/, 3];
                        return [4 /*yield*/, SubmissionRepo.createSubmissions(assignmentId, usersToAdd)];
                    case 2:
                        _a = _c.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _a = [];
                        _c.label = 4;
                    case 4:
                        addedSubmissions = _a;
                        if (!(usersToDelete === null || usersToDelete === void 0 ? void 0 : usersToDelete.length)) return [3 /*break*/, 6];
                        return [4 /*yield*/, SubmissionRepo.deleteUserSubmissionByIds(assignmentId, usersToDelete)];
                    case 5:
                        _b = _c.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        _b = [];
                        _c.label = 7;
                    case 7:
                        deletedSubmissions = _b;
                        return [2 /*return*/, { addedSubmissions: addedSubmissions, deletedSubmissions: deletedSubmissions }];
                }
            });
        });
    };
    SubmissionRepo.deleteUserSubmissionByIds = function (assignmentId, userIds) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = submission
                            .delete()
                            .where(submission.assignment_id
                            .equals(assignmentId)
                            .and(submission.user_id.in(userIds)))
                            .returning(submission.star())
                            .toQuery();
                        return [4 /*yield*/, pool_1.default.query(query)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows];
                }
            });
        });
    };
    SubmissionRepo.getSubmission = function (userId, assignmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var query, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = submission
                            .select(submission.star())
                            .where(submission.assignment_id
                            .equals(assignmentId)
                            .and(submission.user_id.equals(userId)))
                            .toQuery();
                        return [4 /*yield*/, pool_1.default.query(query)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                }
            });
        });
    };
    SubmissionRepo.updateSubmission = function (userId, assignmentId) {
        return __awaiter(this, void 0, void 0, function () {
            var updateSubmission, query, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        updateSubmission = { submitted_at: new Date().toISOString() };
                        query = submission
                            .update(updateSubmission)
                            .where(submission.user_id
                            .equals(userId)
                            .and(submission.assignment_id.equals(assignmentId)))
                            .returning(submission.star())
                            .toQuery();
                        return [4 /*yield*/, pool_1.default.query(query)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows[0]];
                }
            });
        });
    };
    SubmissionRepo.getSubmissionsByUserId = function (userId, publishStatus, submissionStatus, limit, skip) {
        if (limit === void 0) { limit = 20; }
        if (skip === void 0) { skip = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var subQ, submissionToAssignment, query, rows;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        subQ = [];
                        submissionToAssignment = submission
                            .leftJoin(assignment)
                            .on(submission.assignment_id.equals(assignment.id));
                        if (publishStatus === filters_1.PUBLISH_STATUS.ONGOING) {
                            subQ.push(assignment.published_at.lte(new Date().toISOString()));
                        }
                        if (publishStatus === filters_1.PUBLISH_STATUS.SCHEDULED) {
                            subQ.push(assignment.published_at.gt(new Date().toISOString()));
                        }
                        if (submissionStatus === filters_1.SUBMISSION_STATUS.SUBMITTED) {
                            subQ.push(submission.submitted_at
                                .isNotNull()
                                .and(submission.submitted_at.lte(assignment.deadline_at)));
                        }
                        if (submissionStatus === filters_1.SUBMISSION_STATUS.OVERDUE) {
                            subQ.push(submission.submitted_at
                                .isNotNull()
                                .and(submission.submitted_at.gt(assignment.deadline_at)));
                        }
                        if (submissionStatus === filters_1.SUBMISSION_STATUS.PENDING) {
                            subQ.push(submission.submitted_at.isNull());
                        }
                        query = submission
                            .from(submissionToAssignment)
                            .where(submission.user_id.equals(userId));
                        if ((subQ === null || subQ === void 0 ? void 0 : subQ.length) > 0) {
                            subQ.forEach(function (subQuery) {
                                query.where(subQuery);
                            });
                        }
                        query = query.limit(limit).offset(skip).toQuery();
                        return [4 /*yield*/, pool_1.default.query(query)];
                    case 1:
                        rows = (_a.sent()).rows;
                        return [2 /*return*/, rows];
                }
            });
        });
    };
    return SubmissionRepo;
}());
exports.SubmissionRepo = SubmissionRepo;
exports.default = SubmissionRepo;
//# sourceMappingURL=submissionRepo.js.map