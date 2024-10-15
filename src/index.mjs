import express from "express";

const app = express();

app.use(express.json());

const mockUsers = [
    { id: 1, name: 'vishnu', age: 30 },
    { id: 2, name: 'Neena', age: 28, place: 'kasargod' },
    { id: 3, name: 'Gokul', age: 24, place: 'utharagand' },
    { id: 4, name: 'Sreeja', age: 50, place: 'kannokkara' },
    { id: 5, name: 'shaji', age: 57, place: 'iringal' },
    { id: 5, name: 'sheeba', age: 57, place: 'iringal' },
];

app.get("/", (req, res) => {
    const { query: { filter, value } } = req;
    if (filter && value) {
        const validFilters = ['id', 'name', 'age', 'place'];
        if (validFilters.includes(filter)) {
            const filteredMockUsers = mockUsers.filter((user) => {
                return user[filter]&&user[filter] === value;
            });
            if(filteredMockUsers.length>0){
                return res.send(filteredMockUsers);
            } else {
                return res.send("the entered filter and value is not in the list");
            }
        } else return res.send("the entered filter is not in the list")
    }
    res.send(mockUsers)
});

app.get("/:id", (req, res) => {
    const parseId = parseInt(req.params.id);
    if (parseId) {
        const findId = mockUsers.find((user) => user.id === parseId);
        if (findId) {
            res.send(findId);
        } else {
            res.status(404).send({ message: 'invalid id' })
        }

    } else {
        res.status(404).send({ message: "user not found" });
    }
});

app.post('/', (req, res) => {
    const { body } = req;
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
    mockUsers.push(newUser);
    res.send(mockUsers);
})

app.put("/:id", (req,res) => {
    const {body, params:{id}} = req;
    const parseId = parseInt(id);
    if(isNaN(parseId)) return res.sendStatus(400);
    const findIndex = mockUsers.findIndex((user) => user.id === parseId);
    if(findIndex === -1) return res.sendStatus(404);
    mockUsers[findIndex] = {id:parseId, ...body};
    return res.sendStatus(200);
});

app.patch("/:id", (req,res) => {
    const {body, params:{id}} = req;
    const parseId = parseInt(id);
    if(isNaN(parseId)) return res.sendStatus(404);
    const findIndex = mockUsers.findIndex((user) => user.id === parseId);
    if(findIndex === -1) return res.sendStatus(400);
    mockUsers[findIndex] = {...mockUsers[findIndex], ...body};
    return res.sendStatus(200);
});

app.delete("/:id", (req,res) => {
    const {params:{id}} = req;
    const paraseId = parseInt(id);
    if(isNaN(paraseId)) return res.sendStatus(400);
    const findIndex = mockUsers.findIndex((user) => user.id === paraseId);
    if(findIndex === -1) return res.sendStatus(404);
    mockUsers.splice(findIndex, 1);
    return res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`running on port ${PORT}`)
});