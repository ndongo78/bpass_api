import jwt from 'jsonwebtoken';

const generatorToken=async(user)=>{
    return jwt.sign({user},process.env.ACCESS_TOKEN,{expiresIn: "1h"})
}

export default generatorToken;





