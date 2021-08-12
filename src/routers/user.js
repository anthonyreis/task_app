/* eslint-disable no-unused-vars */
const express = require('express');
const multer = require('multer');
const User = require('../models/user');
const auth = require('../middleware/auth');
const router = new express.Router();

const upload = multer({
	dest: 'avatars',
	limits: {
		fileSize: 1000000
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
			cb(new Error('Please upload an image (jpg, jpeg or png)'));
		}

		cb(undefined, true);
	}
});

router.post('/users', async (req, res) => {
	try {
		const user = new User(req.body);

		await user.save();

		const token = await user.generateAuthToken();

		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send({ err: e.message });
	}
});

router.post('/users/login', async (req, res) => {
	try {
		const user = await User.findByCredentials(req.body.email, req.body.password);

		const token = await user.generateAuthToken();

		res.status(200).send({ user, token });
	} catch (e) {
		res.status(400).send({ err: e.message });
	}
});

router.get('/users/me', auth, async (req, res) => {
	res.send(req.user);
});

router.post('/users/logout', auth, async(req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => token.token != req.token);

		await req.user.save();

		res.status(200).send();
	} catch (e) {
		res.status(500).send({ err: e.message });
	}
});

router.post('/users/logoutAll', auth, async (req, res) => {
	try {
		req.user.tokens = [];

		await req.user.save();

		res.status(200).send();
	} catch (e) {
		res.status(500).send({ err: e.message });
	}
});

router.get('/users/:id', async (req, res) => {
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

router.patch('/users/me', auth, async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['name', 'email', 'password', 'age'];
	const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

	if (!isValidOperation) {
		res.status(400).send({ err: 'Invalid updates' });
	}

	try {
		updates.forEach((update) => req.user[update] = req.body[update]);

		await req.user.save();

		res.status(200).send(req.user);
	} catch (e) {
		res.status(400).send({ err: e.message });
	}
});

router.delete('/users/me', auth, async (req, res) => {
	try {
		await req.user.remove();

		res.status(200).send();
	} catch (e) {
		res.status(500).send({ err: e.message });
	}
});

router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
	res.send();
}, (error, req, res, next) => {
	res.status(400).send(error.message);
});

module.exports = router;