import express from 'express'
const router = express.Router()
import {register, login, dashboard, editProfile} from '../controllers/userController.js'
import { verifyToken } from '../middleware/auth.js'
import multer from 'multer'; 
const upload = multer({ dest: 'uploads/' });


router.post('/signup',register)
router.post('/login',login)
router.get('/dashboard/:id',verifyToken, dashboard);
router.post('/api/verify-token' , verifyToken,(req,res) =>  res.json({ message: 'You are authorized' }))
router.post('/edit',verifyToken,upload.single('profileImage'),editProfile)


export default router 