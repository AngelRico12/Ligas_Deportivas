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
exports.obtenerCategoriaYClub = exports.obtenerCategoriaPorDT = void 0;
const database_1 = __importDefault(require("../database"));
const obtenerCategoriaPorDT = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_dt } = req.params;
    console.log('ID recibido:', id_dt);
    try {
        // Ejecutar consulta a la base de datos
        const rows = yield database_1.default.query('SELECT categoria FROM equipo WHERE id_dt = ? LIMIT 1', [id_dt]);
        console.log('Resultados de la consulta:', rows);
        // Verificar si hay resultados
        if (rows.length > 0) {
            res.status(200).json({ categoria: rows[0].categoria });
        }
        else {
            console.log('No se encontró la categoría para el ID proporcionado.');
            res.status(404).json({ message: 'Categoría no encontrada.' });
        }
    }
    catch (error) {
        console.error('Error al obtener categoría:', error);
        res.status(500).json({ message: 'Error del servidor.' });
    }
});
exports.obtenerCategoriaPorDT = obtenerCategoriaPorDT;
// Controlador para obtener la categoría y nombre del club basado en el DT
const obtenerCategoriaYClub = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_usuario } = req.params;
    try {
        // Verificar si el usuario existe y es un DT
        const usuario = yield database_1.default.query('SELECT id_club FROM usuario WHERE id_usuario = ? AND rol = "dt"', [id_usuario]);
        if (usuario.length === 0) {
            res.status(404).json({ success: false, message: 'Usuario no encontrado o no es un DT.' });
            return;
        }
        const idClub = usuario[0].id_club;
        // Obtener el nombre del club y la categoría del equipo asociado al DT
        const result = yield database_1.default.query(`SELECT c.nombre AS nombre_club, e.categoria 
       FROM club c 
       INNER JOIN equipo e ON c.id_club = e.id_club 
       WHERE e.id_dt = ?`, [id_usuario]);
        if (result.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No se encontró equipo asociado al DT.',
            });
            return;
        }
        const { nombre_club, categoria } = result[0];
        res.status(200).json({
            success: true,
            nombre_club,
            categoria,
        });
    }
    catch (error) {
        console.error('Error al obtener categoría y club:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});
exports.obtenerCategoriaYClub = obtenerCategoriaYClub;
