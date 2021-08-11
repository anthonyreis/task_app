const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

router.post('/tasks', async (req, res) => {
	try {
		const task = new Task(req.body);

		await task.save();

		res.status(201).send(task);
	} catch (e) {
		res.status(400).send({ err: e.message });
	}
});

router.get('/tasks', async (req, res) => {
	try {
		const tasks = await Task.find({});

		res.status(200).send(tasks);
	} catch (e) {
		res.status(500).send({ err: e.message });
	}
});

router.get('/tasks/:id', async (req, res) => {
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

router.patch('/tasks/:id', async (req, res) => {
	const update = Object.keys(req.body);
	const allowedUpdates = ['description', 'completed'];
	const isValidOperation = update.every((update) => allowedUpdates.includes(update));

	if (!isValidOperation) {
		res.status(400).send({ err: 'Invalid Updates' });
	}

	try {
		const task = await Task.findById(req.params.id);

		update.forEach((update) => task[update] = req.body[update]);
        
		await task.save();
        
		if (!task) {
			res.status(404).send({ msg: 'Task not found' });
		}

		res.status(200).send(task);
	} catch (e) {
		res.status(500).send({ err: e.message });
	}
});

router.delete('/tasks/:id', async (req, res) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);

		if (!task) {
			res.status(404).send({ msg : 'Task not found'});
		}

		res.status(200).send(task);
	} catch (e) {
		res.status(500).send({ err: e.message });
	}
});

module.exports = router;