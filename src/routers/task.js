const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (req, res) => {
	try {
		const task = new Task({
			...req.body,
			owner: req.user._id
		});

		await task.save();

		res.status(201).send(task);
	} catch (e) {
		res.status(400).send({ err: e.message });
	}
});

router.get('/tasks', auth, async (req, res) => {
	try {
		const tasks = await Task.find({ owner: req.user._id });

		res.status(200).send(tasks);
	} catch (e) {
		res.status(500).send({ err: e.message });
	}
});

router.get('/tasks/:id', auth, async (req, res) => {
	try {
		const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

		if (!task) {
			res.status(404).send({ msg: 'Task not found' });
		}

		res.status(200).send(task);
	} catch (e) {
		res.status(500).send({ err: e.message });
	}
});

router.patch('/tasks/:id', auth, async (req, res) => {
	const update = Object.keys(req.body);
	const allowedUpdates = ['description', 'completed'];
	const isValidOperation = update.every((update) => allowedUpdates.includes(update));

	if (!isValidOperation) {
		res.status(400).send({ err: 'Invalid Updates' });
	}

	try {
		const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });
        
		if (!task) {
			res.status(404).send({ msg: 'Task not found' });
		}

		update.forEach((update) => task[update] = req.body[update]);

		await task.save();

		res.status(200).send(task);
	} catch (e) {
		res.status(500).send({ err: e.message });
	}
});

router.delete('/tasks/:id', auth, async (req, res) => {
	try {
		const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

		if (!task) {
			res.status(404).send({ msg : 'Task not found'});
		}

		res.status(200).send(task);
	} catch (e) {
		res.status(500).send({ err: e.message });
	}
});

module.exports = router;