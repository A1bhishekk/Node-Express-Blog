import express from 'express';
import User from '../models/user.js';

const router = express.Router();

router.get('/signin', (req, res) =>{
    res.render('signin');
});

router.get('/signup', (req, res) =>{
    res.render('signup');
});

// logout route 
router.get('/logout', (req, res) =>{
    res.clearCookie('token').redirect('/');
});


// signin route 

router.post('/signin',async (req,res)=>{
    const {email, password} = req.body;
    try {
        const token= await User.matchPasswordAndGenrateToken(email,password);
        res.cookie('token',token).redirect('/');
        
    } catch (error) {
       return res.render('signin',{"error":"incorrect email or password"});
    }
    
})

// signup route

router.post('/signup',async (req,res)=>{
    const {fullName, email, password} = req.body;
    await User.create({
        fullName,
        email,
        password
    });
    res.redirect('/');
})


// blog route 


export default router;