const router = require('express').Router();
const {

} = require('../../controllers/userController');

// /api/users
router.route('/').get().post();

// /api/users/:userId
router.route('/:userId').get().put().delete()

// api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post().delete();

module.exports = router;