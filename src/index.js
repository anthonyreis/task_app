const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
// eslint-disable-next-line no-undef
const port = process.env.PORT || 8081;

app.use(express.json());

app.post('/users', async (req, res) => {
	try {
		const user = new User(req.body);

		await user.save();

		res.status(201).send(user);
	} catch (e) {
		res.status(400).send({ err: e.message });
	}
});

app.get('/users', async (req, res) => {
	try {
		const users = await User.find({});

		res.status(200).send(users);
	} catch (e) {
		res.status(500).send({ err: e.message });
	}
});

app.get('/users/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);

		if (!user) {
			res.status(404).send({ msg: 'User not found' });
		}

		res.status(200).send(user);
	} catch (e) {
		res.status(500).send({ err: e.message });
	}
});

app.post('/tasks', async (req, res) => {
	try {
		const task = new Task(req.body);

		await task.save();

		res.status(201).send(task);
	} catch (e) {
		res.status(400).send({ err: e.message });
	}
});

app.get('/tasks', async (req, res) => {
	try {
		const tasks = await Task.find({});

		res.status(200).send(tasks);
	} catch (e) {
		res.status(500).send({ err: e.message });
	}
});

app.get('/tasks/:id', async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);

		if (!task) {
			res.status(404).send({ msg: 'Task not found' });
		}

		res.status(200).send(task);
	} catch (e) {
		res.status(500).send({ err: e.message });
	}
});

app.listen(port, () => {
	console.log('Server is up on port ' + port);
});