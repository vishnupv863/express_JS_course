import {Router} from 'express';
import { query, validationResult, body, matchedData, checkSchema } from 'express-validator';
import { bodyValidator } from '../utils/scemaValidation.mjs'
const router = Router();

const resolveIndexByUserId = (req, res, next) => {
    const { params: { id } } = req;
    const parseId = parseInt(id);
    if (isNaN(parseId)) return res.sendStatus(400);
    const findIndex = mockUsers.findIndex((user) => user.id === parseId);
    if (findIndex === -1) return res.sendStatus(404);
    req.findIndex = findIndex;
    next();
};

const mockUsers = [
    { id: 1, name: 'vishnu', age: 30 },
    { id: 2, name: 'Neena', age: 28, place: 'kasargod' },
    { id: 3, name: 'Gokul', age: 24, place: 'utharagand' },
    { id: 4, name: 'Sreeja', age: 50, place: 'kannokkara' },
    { id: 5, name: 'shaji', age: 57, place: 'iringal' },
    { id: 5, name: 'sheeba', age: 57, place: 'iringal' },
];

router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { findIndex } = req;
    const findElement = mockUsers[findIndex];
    return res.send(findElement);
});

router.get("/api/users", query("filter").isString().notEmpty().withMessage("query cannot be empty").isLength({ min: 3, max: 10 }).withMessage("must be in the range"), (req, res) => {
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

router.post('/api/users', checkSchema(bodyValidator),

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

router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { body, findIndex } = req;
    mockUsers[findIndex] = { id: mockUsers[findIndex].id, ...body };
    return res.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { body, findIndex } = req;
    mockUsers[findIndex] = { ...mockUsers[findIndex], ...body };
    return res.sendStatus(200);
});

router.delete("/api/users/:id", (req, res) => {
    const { findIndex } = req;
    mockUsers.splice(findIndex, 1);
    return res.sendStatus(200);
});

export default router
