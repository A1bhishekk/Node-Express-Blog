import express from 'express';
import multer from 'multer';
import path from 'path';

import Blog from '../models/blog.js';
import Comment from '../models/comment.js';

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


// get single blog 

router.get('/:id',async (req,res)=>{
    const blog=await Blog.findById(req.params.id).populate('createdBy');
    const comments=await Comment.find({blogId:req.params.id}).populate('createdBy');
    // console.log(comments)
    return res.render('blog',{
        user:req.user,
        blog,
        comments
    });
})

// comments 

router.post('/comment/:blogId',async (req,res)=>{
    await Comment.create({
        content:req.body.content,
        blogId:req.params.blogId,
        createdBy:req.user._id
    })

    return res.redirect(`/blog/${req.params.blogId}`);
})


// delete blog 

router.delete('/:id',async (req,res)=>{
    console.log(req.params.id)
    await Blog.findByIdAndDelete(req.params.id); 
    return res.redirect('/');
})


export default router;