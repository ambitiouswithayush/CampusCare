const express = require('express');
const { generateMyReport, getMyReports } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate', protect, generateMyReport);
router.get('/', protect, getMyReports);

module.exports = router;
