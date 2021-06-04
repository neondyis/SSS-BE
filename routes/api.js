const express = require('express');
const authRouter = require('./auth');
const brandRouter = require('./brand');
const seriesRouter = require('./series');
const vacuumRouter = require('./vacuum');
const serviceRouter = require('./service');
const knowledgeBaseRouter = require('./knowledgeBase');
const diagnoseRouter = require('./diagnose');
const disassembleRouter = require('./disassemble');
const repairRouter = require('./repair');
const repairStepRouter = require('./repairStep.js');
const testRouter = require('./testing');
const issueRouter = require('./issue');
const passportRouter = require('./passport');
const historyRouter = require('./history');
const labelRouter = require('./label');
const statusRouter = require('./status');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'SSS API with Swagger',
			version: '0.1.0',
			description:
				'This is a simple CRUD API application made with Express and documented with Swagger',
			license: {
				name: 'MIT',
				url: 'https://spdx.org/licenses/MIT.html',
			},
			contact: {
				name: 'Kyle Cunnison',
				email: '452711@student.saxion.nl',
			},
		},
		servers: [
			{
				url: 'http://localhost:3000/api/',
			},
		],
	},
	apis: ['./routes/*.js'],
	security: [{
		bearerAuth: []
	}]
};
const specs = swaggerJsdoc(options);

app.use(
	'/api-docs',
	swaggerUi.serve,
	swaggerUi.setup(specs,{ explorer: true })
);
app.use('/auth/', authRouter);
app.use('/brand/', brandRouter);
app.use('/series/', seriesRouter);
app.use('/vacuum/', vacuumRouter);
app.use('/service/', serviceRouter);
app.use('/knowledgeBase/', knowledgeBaseRouter);
app.use('/diagnose/', diagnoseRouter);
app.use('/issue/',issueRouter);
app.use('/disassemble/', disassembleRouter);
app.use('/repair/', repairRouter);
app.use('/label/',labelRouter);
app.use('/status/',statusRouter);
app.use('/repair/step',repairStepRouter);
app.use('/test/', testRouter);
app.use('/passport/', passportRouter);
app.use('/history/', historyRouter);


module.exports = app;
