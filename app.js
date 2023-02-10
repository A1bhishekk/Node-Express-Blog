import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cookieParser from 'cookie-parser';
import {connectDB} from './db/database.js';
import userRoutes from './routes/user.js';
import blogRoutes from './routes/blog.js';
import checkForAuthenticationCookie from './middleware/authentication.js';
import Blog from './models/blog.js';


const app = express();

dotenv.config({ path: './.env' });
const PORT = process.env.PORT || 5000;

// configure database connection
connectDB();

// configure view engine
app.set('view engine', "ejs");
app.set('views', path.resolve("./views"));

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')));

app.get('/', async (req, res) => {
    const allBlogs=await Blog.find({}).populate('createdBy');
    res.render('home',{
        user:req.user,
        blogs:allBlogs
    })
});



// configure routes
app.use('/user', userRoutes);
app.use('/blog', blogRoutes);





app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
}
);