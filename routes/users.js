const router = require('express').Router();

const {
  getMe,
  getUsers,
  getUser,
  patchAvatar,
  patchProfile,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me/avatar', patchAvatar);
router.patch('/me', patchProfile);
router.get('/me', getMe);
module.exports = router;
