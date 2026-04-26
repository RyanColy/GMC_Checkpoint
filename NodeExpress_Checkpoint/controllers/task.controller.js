const Task = require('../models/Task');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// POST /tasks — create a new task owned by the logged-in user
exports.createTask = catchAsync(async (req, res, next) => {
  const { title, description } = req.body;
  if (!title) return next(new AppError('Task title is required.', 400));

  // owner is set to req.user._id so the task is linked to the authenticated user
  const task = await Task.create({ title, description, owner: req.user._id });

  res.status(201).json({ status: 'success', task });
});

// GET /tasks — return only the tasks that belong to the logged-in user
exports.getTasks = catchAsync(async (req, res, next) => {
  const tasks = await Task.find({ owner: req.user._id });

  res.status(200).json({ status: 'success', results: tasks.length, tasks });
});

// DELETE /tasks/:id — delete a task only if the logged-in user is its owner
exports.deleteTask = catchAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) return next(new AppError('Task not found.', 404));

  // both owner and _id are strings (UUIDs), so direct comparison works
  if (task.owner !== req.user._id)
    return next(new AppError('You are not allowed to delete this task.', 403));

  await Task.deleteById(req.params.id);

  // 204 No Content — success with no body
  res.status(204).json({ status: 'success', data: null });
});
