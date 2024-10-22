import express from "express";
import router from './routes/index.mjs';
import cookieParser from "cookie-parser";

const app = express();

app.use(express.json());

app.use(cookieParser());
app.use(router);


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.cookie("hello", "world", { maxAge: 60000 * 60 * 24 * 7 });
    res.status(201).send("Hello world");
});
