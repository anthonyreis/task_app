const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
// eslint-disable-next-line no-undef
const port = process.env.PORT || 8081;

/*app.use((req, res, next) => {
	res.status(503).send(`${req.method} requests are disabled, the server is under maintenance.`);
});*/

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
	console.log('Server is up on port ' + port);
});