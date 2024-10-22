import { Router } from 'express';

const router = Router();

const products = [
    { name: 'apple', price: 200, place: "kozhikode" },
    { name: 'orange', price: 100, place: "vadakara" },
    { name: 'banana', price: 110, place: "kochi" },
    { name: 'grape', price: 300, place: "kannur" }
]

router.get("/api/products", (req, res) => {
    console.log(req.headers.cookie)
    console.log(req.cookies); 
    if (req.cookies.hello && req.cookies.hello === "world")
        return res.status(201).send(products);
    return res.send({ message: "sorry you need cookies" })

});

export default router