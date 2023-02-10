import express from 'express';
import multer from 'multer';
import path from 'path';

import Blog from '../models/blog.js';

const router = express.Router();


// configuring multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`));
    },

    filename: function (req, file, cb) {
        const filename=`${Date.now()}-${file.originalname}`;
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });




router.get('/add-new',(req, res) =>{
    return res.render('addBlog',{
        user:req.user,
    });
});


router.post('/',upload.single('coverImage'),async (req,res)=>{
    const {title, body} = req.body;
    const blog=await Blog.create({
        title,
        body,
        coverImageURL:`/uploads/${req.file.filename}`,
        createdBy:req.user._id
    });
    return res.redirect('/');
})




export default router;