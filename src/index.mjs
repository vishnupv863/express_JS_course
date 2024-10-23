import express from "express";
import router from './routes/index.mjs';
import cookieParser from "cookie-parser";
import session from "express-session";

const app = express();

app.use(express.json());
app.use(cookieParser("entha_mone"));
app.use(session(
    {
        secret:"vishnu",
        saveUninitialized:false,
        resave:false,
        cookie:{
            maxAge:60000 * 60
        }
    }
));
app.use(router);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

app.get("/", (req, res) => {
    req.session.visited = true;
    res.cookie("hello", "world", { maxAge: 60000 * 60 * 24 * 7, signed:true });
    res.status(201).send("Hello world");
    console.log(req.session);
    console.log(req.sessionID)
});
