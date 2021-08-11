const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();
// eslint-disable-next-line no-undef
const port = process.env.PORT || 8081;

app.use(express.json());

app.post('/users', (req, res) => {
	const user = new User(req.body);

	user.save().then(() => {
		res.status(201).send(user);
	}).catch((err) => {
		res.status(400).send({ err: err.message });
	});
});

app.get('/users', (req, res) => {
	User.find({}).then((users) => {
		res.status(200).send(users);
	}).catch((err) => {
		res.status(500).send({ err: err.message });
	});
});

app.get('/users/:id', (req, res) => {
	User.findById(req.params.id).then((user) => {
		if (!user) {
			res.status(404).send({ msg: 'User not found' });
		}
		res.status(200).send(user);
	}).catch((err) => {
		res.status(500).send({ err: err.message });
	});
});

app.post('/tasks', (req, res) => {
	const task = new Task(req.body);

	task.save().then(() => {
		res.status(201).send(task);
	}).catch((err) => {
		res.status(400).send({ err: err.message });
	});
});

app.get('/tasks', (req, res) => {
	Task.find({}).then((tasks) => {
		res.status(200).send(tasks);
	}).catch((err) => {
		res.status(500).send({ err: err.message });
	});
});

app.get('/tasks/:id', (req, res) => {
	Task.findById(req.params.id).then((task) => {
		if (!task) {
			res.status(404).send({ msg: 'Task not found' });
		}
		res.status(200).send(task);
	}).catch((err) => {
		res.status(500).send({ err: err.message });
	});
});

app.listen(port, () => {
	console.log('Server is up on port ' + port);
});