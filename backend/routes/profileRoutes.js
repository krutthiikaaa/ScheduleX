const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProfile, updateProfile, changePassword, resetPassword, exportUserData } = require('../controllers/profileController');

router.get('/', auth, getProfile);
router.put('/', auth, updateProfile);
router.put('/password', auth, changePassword);
router.post('/reset-password', auth, resetPassword);
router.get('/export', auth, exportUserData);

module.exports = router;
