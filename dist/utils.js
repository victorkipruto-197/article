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
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIfAdminAndIsActive = exports.currentTimestamp = void 0;
const entities_1 = require("./entities");
const currentTimestamp = () => Date.now();
exports.currentTimestamp = currentTimestamp;
const checkIfAdminAndIsActive = (repository, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield repository.db.getUserById(adminId);
    if (admin === undefined) {
        return false;
    }
    if (!admin.isActive) {
        return false;
    }
    const adminRoles = yield repository.db.getUserRoles(adminId);
    if (!adminRoles.includes(entities_1.Role.Admin)) {
        return false;
    }
    return true;
});
exports.checkIfAdminAndIsActive = checkIfAdminAndIsActive;
