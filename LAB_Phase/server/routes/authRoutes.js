const router = require("express").Router();
const { body } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const { register, login, getMe } = require("../controllers/authController");

const registerValidation = [
  body("displayName").trim().notEmpty().withMessage("Display name is required"),
  body("handle")
    .trim()
    .matches(/^[a-z0-9_.]{3,30}$/i)
    .withMessage("Handle must be 3-30 chars: letters, digits, _ or ."),
  body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/me", protect, getMe);

module.exports = router;
