const  express = require ('express');
const  { login, register } =  require ("../controllers/auth.js");

const router = express.Router();

router.post("/register", register)
router.post("/login", login)

// export default router;
module.exports = router;