const router = require("express").Router();

const {
  createUser,
  getUsers,
  getUser,
} = require("../controllers/users");

router.post("/", createUser);
router.get("/", getUsers);
router.get("/:userId", getUser);

module.exports = router;
