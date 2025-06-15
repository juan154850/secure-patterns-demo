import { Router } from 'express';
import { getUserInsecure } from '../examples/insecure/sql-injection.controller.js';
import { getUserSecure } from '../examples/secure/sql-injection.controller.js';
import { validateQuery } from '../middlewares/validate-query.middleware.js';
import { z } from 'zod';

//esquema para validar los datos de entrada, como es solo un ejemplo se define acá pero lo
// ideal es que todos los esquemas de validación estén en un archivo separado
// y se importen acá

// Este esquema valida que el parámetro id sea un número entero positivo
// y lo convierte a número si es necesario
const schema = z.object({
  id: z.coerce.number().int().positive()
  //necesito que esto devuelva error personalizado diciendo ID Invalido.
});

const router = Router();
router.get('/insecure', getUserInsecure);
router.get('/secure', validateQuery(schema), getUserSecure);
export default router;
