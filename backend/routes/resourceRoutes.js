const express = require('express');
const {
  getResources,
  createResource,
  uploadResource,
  deleteResource,
} = require('../controllers/resourceController');

const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

// View resources (students)
router.get('/', protect, getResources);

// Add resource with optional file upload (admin)
router.post('/', protect, upload.single('file'), createResource);

// Upload resource file (admin)
router.post('/upload', protect, upload.single('file'), uploadResource);

// Delete resource (admin)
router.delete('/:id', protect, deleteResource);

module.exports = router;
