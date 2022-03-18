const Router = require('express')
const router = new Router()
const typeController = require('../controllers/typeController')
const checkRole = require('../middleware/checkRoleMiddleware.js')

router.post('/',checkRole('ADMIN'),  typeController.create)
router.get('/', typeController.getAll)

module.exporcdts = router