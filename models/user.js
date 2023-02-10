import mongoose from 'mongoose';
import {createHmac,randomBytes} from 'crypto';
import { createTokenForUser } from '../services/authentication.js';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Please enter your full name"],
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
    },
    profileImageURL: {
        type: String,
        default: "/images/default.png"

    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }

},
    { timestamps: true }
)

userSchema.pre("save", async function (next) {
    const user = this;
    if (!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword=createHmac('sha256',salt).update(user.password).digest('hex');

    this.password = hashedPassword;
    this.salt = salt;
    next();
});

userSchema.static('matchPasswordAndGenrateToken', async function (email,password){
    const user =await this.findOne({email});
    if(!user)  throw new Error("User not found");

    const salt = user.salt;
    const hashedPassword=user.password;

    const userProvidedHash=createHmac("sha256",salt).update(password).digest("hex");
    if(userProvidedHash!==hashedPassword) throw new Error("Password is incorrect");

    const token=createTokenForUser(user);
    return token;

})

const User = mongoose.model("User", userSchema);

export default User;