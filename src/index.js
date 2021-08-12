const express = require('express');
const env = process.argv[2].split(':')[1];
require('dotenv').config({ path: `src/config/${env}.env` });
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
// eslint-disable-next-line no-undef
const port = process.env.PORT;

/*app.use((req, res, next) => {
	res.status(503).send(`${req.method} requests are disabled, the server is under maintenance.`);
});*/

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log('Server is up on port ' + port);
});