export default function adminMiddleware(req, res, next) {
    if(req.user && req.user.role === 'admin'){
        next();
    }else{
        return res.status(401).json({message:'Access denied. Admin only.'});
    }
}