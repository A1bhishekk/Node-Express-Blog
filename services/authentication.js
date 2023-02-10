import JWT from 'jsonwebtoken';
const secret='mysecret'

function createTokenForUser(user){
    const payload={
        _id:user._id,
        email:user.email,
        role:user.role,
        profileImageURL:user.profileImageURL
    }

    const token=JWT.sign(payload,secret,{expiresIn:'1d'});
    return token;

}


function validateToken(token){
    const payload=JWT.verify(token,secret);
    return payload;
}

export {createTokenForUser,validateToken}