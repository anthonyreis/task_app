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

// Get /tasks?completed=true
// Get /tasks?limit=10&skip=10
// Get /tasks?sortBy=createdAt:asc
router.get('/tasks', auth, async (req, res) => {
    const match = {};
    const sort = {};

    if (req.query.completed) {
        match.completed = req.query.completed === 'true';
    }

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate();

        res.status(200).send(req.user.tasks);
    } catch (e) {
        res.status(500).send({ err: e.message });
    }
});

router.get('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send({ msg: 'Task not found' });
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
            return res.status(404).send({ msg: 'Task not found' });
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
            return res.status(404).send({ msg : 'Task not found'});
        }

        res.status(200).send(task);
    } catch (e) {
        res.status(500).send({ err: e.message });
    }
});

module.exports = router;