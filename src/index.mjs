import express from "express";
import { query, validationResult, body, matchedData, checkSchema } from 'express-validator';

const app = express();

app.use(express.json());

const resolveIndexByUserId = (req, res, next) => {
    const { params: { id } } = req;
    const parseId = parseInt(id);
    if (isNaN(parseId)) return res.sendStatus(400);
    const findIndex = mockUsers.findIndex((user) => user.id === parseId);
    if (findIndex === -1) return res.sendStatus(404);
    req.findIndex = findIndex;
    next();
};

const processUpdate = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next()
};

app.get('/', query("filter")
    .isString().withMessage("query must be a string")
    .notEmpty().withMessage("query cannot be empty")
    .isLength({ min: 3, max: 10 }).withMessage("query must be in the range"),
    (req, res, next) => {
        const result = validationResult(req);
        console.log(result);
        console.log('base url')
        next();
    }, (req, res) => {
        res.send(mockUsers);
    });

const mockUsers = [
    { id: 1, name: 'vishnu', age: 30 },
    { id: 2, name: 'Neena', age: 28, place: 'kasargod' },
    { id: 3, name: 'Gokul', age: 24, place: 'utharagand' },
    { id: 4, name: 'Sreeja', age: 50, place: 'kannokkara' },
    { id: 5, name: 'shaji', age: 57, place: 'iringal' },
    { id: 5, name: 'sheeba', age: 57, place: 'iringal' },
];

app.get("/api/users", query("filter").isString().notEmpty().withMessage("query cannot be empty").isLength({ min: 3, max: 10 }).withMessage("must be in the range"), (req, res) => {
    // console.log(req["express-validator#contexts"])
    const result = validationResult(req);
    console.log(result);
    const { query: { filter, value } } = req;
    if (filter && value) {
        const validFilters = ['id', 'name', 'age', 'place'];
        if (validFilters.includes(filter)) {
            const filteredMockUsers = mockUsers.filter((user) => {
                return user[filter] && user[filter] === value;
            });
            if (filteredMockUsers.length > 0) {
                return res.send(filteredMockUsers);
            } else {
                return res.send("the entered filter and value is not in the list");
            }
        } else return res.send("the entered filter is not in the list")
    }
    res.send(mockUsers)
});

app.use(processUpdate);

app.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { findIndex } = req;
    const findElement = mockUsers[findIndex];
    return res.send(findElement);
});

import { bodyValidator } from './utils/scemaValidation.mjs'

app.post('/api/users', checkSchema(bodyValidator),

    (req, res) => {
        const result = validationResult(req);
        console.log(result);
        if (!result.isEmpty()) {
            return res.status(404).send({ errors: result.array() });
        }
        const data = matchedData(req);
        console.log(data)
        const { body } = req;
        const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
        mockUsers.push(newUser);
        res.send(mockUsers);
    })

app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { body, findIndex } = req;
    mockUsers[findIndex] = { id: mockUsers[findIndex].id, ...body };
    return res.sendStatus(200);
});

app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { body, findIndex } = req;
    mockUsers[findIndex] = { ...mockUsers[findIndex], ...body };
    return res.sendStatus(200);
});

app.delete("/api/users/:id", (req, res) => {
    const { findIndex } = req;
    mockUsers.splice(findIndex, 1);
    return res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
});