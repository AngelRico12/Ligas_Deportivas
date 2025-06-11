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
exports.getClubById = void 0;
const database_1 = __importDefault(require("../database"));
// Obtener información de un club por su ID
const getClubById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const club = yield database_1.default.query('SELECT * FROM club WHERE id_club = ?', [id]);
        if (club.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Club no encontrado',
            });
            return;
        }
        const { id_club, nombre, correo, certificado, estado, logotipo } = club[0];
        res.json({
            success: true,
            club: {
                id_club,
                nombre,
                correo,
                certificado,
                estado,
                logotipo,
            },
        });
    }
    catch (error) {
        console.error('Error al obtener el club:', error);
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al obtener el club',
        });
    }
});
exports.getClubById = getClubById;
