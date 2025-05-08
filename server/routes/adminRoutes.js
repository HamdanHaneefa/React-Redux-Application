import express from 'express'
const router = express.Router()
import { getUsers,updateUser,addUser, deleteUser } from '../controllers/adminController.js'
import { verifyToken } from '../middleware/auth.js'



router.get('/users',verifyToken, getUsers)
router.post('/adduser',verifyToken, addUser)
router.delete('/users/:id',verifyToken, deleteUser)
router.put('/update/:id',verifyToken, updateUser)




export default router