import { Router } from 'express';
import { 
  getDocumentInsecure,
  getDocumentsInsecure,
  createDocumentInsecure,
  updateDocumentInsecure,
  deleteDocumentInsecure
} from '../examples/insecure/broken-access-control.controller.js';
import { 
  getDocumentSecure,
  getDocumentsSecure,
  createDocumentSecure,
  updateDocumentSecure,
  deleteDocumentSecure
} from '../examples/secure/broken-access-control.controller.js';
import { 
  validateDocumentBody,
  validateDocumentParams,
  documentSchema,
  documentIdSchema
} from '../middlewares/document-validation.middleware.js';

const router = Router();

// ────── Rutas inseguras (IDOR vulnerable) ──────
router.get('/documents/insecure', getDocumentsInsecure);
router.get('/documents/insecure/:id', getDocumentInsecure);
router.post('/documents/insecure', createDocumentInsecure);
router.put('/documents/insecure/:id', updateDocumentInsecure);
router.delete('/documents/insecure/:id', deleteDocumentInsecure);

// ────── Rutas seguras (con validación de acceso) ──────
router.get('/documents/secure', getDocumentsSecure);
router.get('/documents/secure/:id', 
  validateDocumentParams(documentIdSchema), 
  getDocumentSecure
);
router.post('/documents/secure', 
  validateDocumentBody(documentSchema), 
  createDocumentSecure
);
router.put('/documents/secure/:id', 
  validateDocumentParams(documentIdSchema),
  validateDocumentBody(documentSchema), 
  updateDocumentSecure
);
router.delete('/documents/secure/:id', 
  validateDocumentParams(documentIdSchema), 
  deleteDocumentSecure
);

export default router;
