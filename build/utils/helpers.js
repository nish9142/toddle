"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allRequiredKeysPresent = void 0;
var allRequiredKeysPresent = function (keys, payload, res) {
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        if (!payload[key]) {
            res.status(403).send({ error: 'Required key(s) missing' });
            throw new Error('Required key(s) missing');
        }
    }
};
exports.allRequiredKeysPresent = allRequiredKeysPresent;
//# sourceMappingURL=helpers.js.map