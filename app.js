const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies and serve static files
app.use(express.json());
app.use(express.static("public"));

// File path for JSON data
const dataFilePath = path.join(__dirname, "data", "tasks.json");

// Helper function to read tasks from the JSON file
function readTasks() {
    const data = fs.readFileSync(dataFilePath);
    return JSON.parse(data);
}

// Helper function to write tasks to the JSON file
function writeTasks(tasks) {
    fs.writeFileSync(dataFilePath, JSON.stringify(tasks, null, 2));
}

// Routes

// Get all tasks
app.get("/api/tasks", (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// Add a new task
app.post("/api/tasks", (req, res) => {
    const tasks = readTasks();
    const newTask = {
        id: Date.now(),
        text: req.body.text,
        completed: false,
    };
    tasks.push(newTask);
    writeTasks(tasks);
    res.json(newTask);
});

// Update a task (mark as complete/incomplete)
app.put("/api/tasks/:id", (req, res) => {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex((task) => task.id == req.params.id);
    if (taskIndex !== -1) {
        tasks[taskIndex].completed = req.body.completed;
        writeTasks(tasks);
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ error: "Task not found" });
    }
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    let tasks = readTasks();
    tasks = tasks.filter((task) => task.id != req.params.id);
    writeTasks(tasks);
    res.json({ message: "Task deleted" });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
