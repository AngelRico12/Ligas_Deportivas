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
exports.getJugadorByPosicionYEquipo = exports.getIdEquipoByIdUsuario = exports.deleteJugador = exports.updateJugador = exports.createJugador = exports.getJugadores = exports.upload = void 0;
const database_1 = __importDefault(require("../database"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Configuración de Multer para almacenar fotos de jugadores
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const { nombreClub, categoria, posicion } = req.body;
        console.log('Nombre del club:', nombreClub);
        console.log('Categoría:', categoria);
        console.log('Datos recibidos en req.body (Multer):', req.body);
        if (!nombreClub || !categoria || !posicion) {
            cb(new Error('El nombre del club y la categoría son obligatorios.'), '');
            return;
        }
        // Sanear nombres para evitar problemas en el sistema de archivos
        const sanitizedClub = nombreClub.replace(/[^a-zA-Z0-9]/g, '_');
        const sanitizedCategory = categoria.replace(/[^a-zA-Z0-9]/g, '_');
        const baseDir = path_1.default.join(__dirname, '../../uploads', nombreClub, 'fotos', categoria, posicion);
        // Crear la estructura de carpetas si no existe
        if (!fs_1.default.existsSync(baseDir)) {
            fs_1.default.mkdirSync(baseDir, { recursive: true });
        }
        cb(null, baseDir); // Define la carpeta donde se guardarán las fotos
    },
    filename: (req, file, cb) => {
        const sanitizedFileName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, file.originalname); // Guardar con el nombre original, pero saneado
    },
});
// Configuración de Multer
exports.upload = (0, multer_1.default)({ storage });
// Obtener todos los jugadores
const getJugadores = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const jugadores = yield database_1.default.query('SELECT * FROM jugador');
        res.json({ success: true, jugadores });
    }
    catch (error) {
        console.error('Error al obtener jugadores:', error);
        res.status(500).json({ success: false, message: 'Error al obtener jugadores.' });
    }
});
exports.getJugadores = getJugadores;
const createJugador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre_completo, sexo, fecha_nacimiento, id_equipo, nombreClub, categoria, posicion } = req.body;
    const file = req.file; // Cambia a req.file para obtener el archivo
    console.log('Datos recibidos en req.body:', req.body);
    console.log('Archivo recibido:', file);
    if (!nombre_completo || !sexo || !fecha_nacimiento || !id_equipo || !nombreClub || !categoria || !posicion || !file) {
        res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
        return;
    }
    // Generar la ruta del archivo guardado
    const filePath = path_1.default.join('/uploads', nombreClub, 'fotos', categoria, posicion, file.filename);
    try {
        // Inserta el jugador en la base de datos con la ruta de la foto
        const result = yield database_1.default.query('INSERT INTO jugador (nombre_completo, sexo, fecha_nacimiento, id_equipo, posicion, foto) VALUES (?, ?, ?, ?, ?, ?)', [nombre_completo, sexo, fecha_nacimiento, id_equipo, posicion, filePath] // Usa filePath como la ruta de la foto
        );
        res.status(201).json({
            success: true,
            message: 'Jugador creado exitosamente.',
            jugador: { id_jugador: result.insertId, nombre_completo, sexo, fecha_nacimiento, id_equipo },
        });
    }
    catch (error) {
        console.error('Error al crear el jugador:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});
exports.createJugador = createJugador;
// Actualizar un jugador
const updateJugador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { nombre_completo, sexo, fecha_nacimiento, id_equipo } = req.body;
    if (!nombre_completo || !sexo || !fecha_nacimiento || !id_equipo) {
        res.status(400).json({ success: false, message: 'Todos los campos son obligatorios.' });
        return;
    }
    try {
        yield database_1.default.query('UPDATE jugador SET nombre_completo = ?, sexo = ?, fecha_nacimiento = ?, id_equipo = ? WHERE id_jugador = ?', [nombre_completo, sexo, fecha_nacimiento, id_equipo, id]);
        res.json({ success: true, message: 'Jugador actualizado con éxito.' });
    }
    catch (error) {
        console.error('Error al actualizar jugador:', error);
        res.status(500).json({ success: false, message: 'Error al actualizar el jugador.' });
    }
});
exports.updateJugador = updateJugador;
// Eliminar un jugador
const deleteJugador = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield database_1.default.query('DELETE FROM jugador WHERE id_jugador = ?', [id]);
        res.json({ success: true, message: 'Jugador eliminado con éxito.' });
    }
    catch (error) {
        console.error('Error al eliminar jugador:', error);
        res.status(500).json({ success: false, message: 'Error al eliminar el jugador.' });
    }
});
exports.deleteJugador = deleteJugador;
// Obtener id_equipo basado en id_usuario
const getIdEquipoByIdUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id_usuario } = req.params;
    if (!id_usuario) {
        res.status(400).json({ success: false, message: 'El id_usuario es obligatorio.' });
        return;
    }
    try {
        // Consulta para obtener el id_equipo basado en el id_usuario
        const result = yield database_1.default.query(`SELECT e.id_equipo 
       FROM equipo e 
       JOIN usuario u ON e.id_dt = u.id_usuario 
       WHERE u.id_usuario = ?`, [id_usuario]);
        if (result.length > 0) {
            res.json({ success: true, id_equipo: result[0].id_equipo });
        }
        else {
            res.status(404).json({ success: false, message: 'No se encontró el equipo para el usuario proporcionado.' });
        }
    }
    catch (error) {
        console.error('Error al obtener el id_equipo:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});
exports.getIdEquipoByIdUsuario = getIdEquipoByIdUsuario;
const getJugadorByPosicionYEquipo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { posicion, id_equipo } = req.params;
    if (!posicion || !id_equipo) {
        res.status(400).json({ success: false, message: 'La posición y el id_equipo son obligatorios.' });
        return;
    }
    try {
        const result = yield database_1.default.query('SELECT * FROM jugador WHERE posicion = ? AND id_equipo = ?', [posicion, id_equipo]);
        if (result.length > 0) {
            res.json({ success: true, jugador: result });
        }
        else {
            res.status(404).json({ success: false, message: 'No se encontraron jugadores con esa posición y equipo.' });
        }
    }
    catch (error) {
        console.error('Error al obtener el jugador:', error);
        res.status(500).json({ success: false, message: 'Error en el servidor.' });
    }
});
exports.getJugadorByPosicionYEquipo = getJugadorByPosicionYEquipo;
