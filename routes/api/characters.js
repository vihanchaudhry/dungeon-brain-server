const express = require('express');
const CharactersController = require('../../controllers/characters');
const authorization = require('../../middleware/authorization');
const file = require('../../middleware/file');
const portrait = require('../../middleware/portrait');

const router = express.Router();

// @desc    Get all characters
// @route   GET /api/characters
router.get('/', CharactersController.getAll);

// @desc    Get a character
// @route   GET /api/characters/:id
router.get('/:id', CharactersController.get);

// @desc    Create a character
// @route   character /api/characters
router.post('/', authorization, file, portrait, CharactersController.create);

// @desc    Update a character
// @route   PUT /api/characters/:id
router.put('/:id', authorization, file, portrait, CharactersController.update);

// @desc    Delete a character
// @route   DELETE /api/characters/:id
router.delete('/:id', authorization, CharactersController.delete);

module.exports = router;
