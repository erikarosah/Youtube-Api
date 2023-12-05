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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const knex_1 = __importDefault(require("../database/knex"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const auth_1 = __importDefault(require("../configs/auth"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
class SessionController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield (0, knex_1.default)("users").where({ email }).first();
            if (!user) {
                throw new AppError_1.default("E-mail e/ou senha inválidos", 401);
            }
            const checkPassword = yield (0, bcryptjs_1.compare)(password, user.password);
            if (!checkPassword) {
                throw new AppError_1.default("E-mail e/ou senha inválidos", 401);
            }
            const { secret, expiresIn } = auth_1.default.jwt;
            const token = (0, jsonwebtoken_1.sign)({}, secret, {
                subject: String(user.id),
                expiresIn
            });
            delete user.password;
            return res.status(200).json({ user, token });
        });
    }
}
;
exports.default = SessionController;
