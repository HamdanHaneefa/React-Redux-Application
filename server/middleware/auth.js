import jwt from 'jsonwebtoken';


export const verifyToken = (req,res,next) =>{
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401); 

    jwt.verify(token, process.env.SECRET_KEY,(err,user) => {
        if (err) return res.status(403).json({ authError: "Authentication failed" });
        req.user = user
        next()
    })
}