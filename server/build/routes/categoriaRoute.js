"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoriaController_1 = require("../controllers/categoriaController");
const router = (0, express_1.Router)();
// Ruta para obtener la categoría del equipo basado en el id_dt
router.get('/:id_dt', categoriaController_1.obtenerCategoriaPorDT);
router.get('/categoria-club/:id_usuario', categoriaController_1.obtenerCategoriaYClub);
exports.default = router;
