const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// json-parser (https://expressjs.com/en/api.html) is a so-called middleware (http://expressjs.com/en/guide/using-middleware.html).
// It transforms the JSON data of a request into a JavaScript object;
// the parsed data is accessed via the body property of the request object (i.e., req.body).
app.use(express.json());

// morgan (https://github.com/expressjs/morgan) is an HTTP request logger middleware for node.js
morgan.token("data", (req, res) => JSON.stringify(req.body));

app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :data"
    )
);

// cors (https://github.com/expressjs/cors) is a middleware that enables CORS (Cross-Origin Resource Sharing) mechanism
app.use(cors());

// static (http://expressjs.com/en/starter/static-files.html) is a built-in middleware from express that allows to show static content
app.use(express.static("build"));

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        phoneNumber: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        phoneNumber: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        phoneNumber: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        phoneNumber: "39-23-6423122",
    },
];

const generateId = () => Math.floor(100 + Math.random() * 99901); // generating a random number [100; 100,000]

app.get("/", (req, res) => {
    res.send("<h1>Welcome to the phonebook app!</h1>");
});

app.get("/api/persons", (req, res) => {
    res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find((person) => person.id === id);

    if (person) {
        res.json(person);
    } else {
        res.statusMessage = `No contact found with the specified id (${id})`;
        res.status(404).end();
    }
});

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter((person) => person.id !== id);

    res.status(204).end();
});

app.post("/api/persons", (req, res) => {
    const body = req.body;

    if (!body.name || !body.phoneNumber) {
        return res.status(400).json({
            error: "The name or number is missing",
        });
    }

    let containsPersonWithSameName = persons.some(
        (person) => person.name.toUpperCase() === body.name.toUpperCase()
    );
    if (containsPersonWithSameName) {
        return res.status(400).json({
            error: `The name ${body.name} already exists in the phonebook`,
        });
    }

    const person = { ...req.body, id: generateId() };

    persons = persons.concat(person);

    res.json(person);
});

app.get("/info", (req, res) => {
    res.send(
        `<p>Phonebook has info for ${
            persons.length
        } people</p><p>${new Date()}</p>`
    );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
