const express = require('express')
const app = express()
const port = 3000
const bodyParser = require('body-parser');
var cors = require('cors')

const BurnDownChartController = require('./controllers/burndown_chart.controller');
const ScrumReportController = require('./controllers/scrum_report.controller');
const RequirementController = require('./controllers/requirement.controller');
const TaskController = require('./controllers/task.controller');
const SprintController = require('./controllers/sprint.controller');
const UserController = require('./controllers/user.controller');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', express.static('public'))

app.use(cors())


app.get('/generate_burndown_chart/:userId', (req, res) => {
  BurnDownChartController.handleForBurndownChart(req, res);
})

app.get('/generate_report/:userId', (req, res) => {
  ScrumReportController.handleForScrumReport(req, res);
})

//Get all requirements (OK)
app.get('/api/requirements', (req, res) => {
  RequirementController.handleForRequirement(req, res);
})

//Get tasks by requirement id (OK)
app.get('/api/tasks/requirement/:requirementId', (req, res) => {
  TaskController.handleForTask(req, res);
})

//Get tasks by sprint id (OK)
app.get('/api/tasks/sprint/:sprintId', (req, res) => {
  TaskController.handleForTask(req, res);
})

//Get all tasks (OK)
app.get('/api/tasks', (req,res) =>{
  TaskController.handleForTask(req, res);
})

//Get all sprints (OK)
app.get('/api/sprints', (req, res) => {
  SprintController.handleForSprint(req, res);
})

//Get all users (OK)
app.get('/api/users', (req, res) => {
  UserController.handleForUsers(req,res);
})

// Post - Create a new task (OK)
app.post('/api/tasks', (req, res) => {
  TaskController.handleForTask(req, res);
})

//Post - Confirm requirement (OK)
app.post('/api/requirements', (req, res) => {
  RequirementController.handleForRequirement(req,res);
})

//Post - Create new sprint (OK)
app.post('/api/sprints/', (req, res) => {
  SprintController.handleForSprint(req, res);
})

//Put - add a task in a sprint (OK)
app.put('/api/sprints/:sprintId', (req, res) => {
  SprintController.handleForSprint(req, res);
})

//Put - Add/remove users in project - set isProjectUser (OK)
app.put('/api/users/:userId', (req, res) => {
  UserController.handleForUsers(req,res);
})

////Put - update task - Add comment (OK)
app.put('/api/tasks/:taskId', (req, res) => {
  TaskController.handleForTask(req,res);
})

//Delete - Delete task (OK)
app.delete('/api/tasks/:deleteTaskId', (req, res) => {
  TaskController.handleForTask(req, res);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})