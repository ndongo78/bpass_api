import jwt from 'jsonwebtoken';


const authMildware = (req ,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.json(401, { message: 'Access Denied' });
    };
    jwt.verify(token, process.env.ACCESS_TOKEN , (err, user) => {
        if (err) return res.status(401).json({ message: 'Invalid Token' });
        req.user = user;
        next();
    }
    )
};

export default authMildware;