import { Router } from 'express';
import { obtenerCategoriaPorDT, obtenerCategoriaYClub } from '../controllers/categoriaController';

const router = Router();

// Ruta para obtener la categoría del equipo basado en el id_dt
router.get('/:id_dt', obtenerCategoriaPorDT);
router.get('/categoria-club/:id_usuario', obtenerCategoriaYClub);

export default router;
