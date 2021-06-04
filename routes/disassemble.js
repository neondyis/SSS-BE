const express = require('express');
const DisassembleController = require('../controllers/KnowledgeBase/Disassemble/DisassembleController.js');

const router = express.Router();

router.get('/', DisassembleController.disassembleList);
router.get('/:id', DisassembleController.disassembleDetail);
router.post('/', DisassembleController.disassembleStore);
router.put('/:id', DisassembleController.disassembleUpdate);
router.delete('/:id', DisassembleController.disassembleDelete);

module.exports = router;
