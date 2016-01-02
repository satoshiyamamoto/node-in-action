// datastore/mongoose.js

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/tasks');

// Schema definition
var Schema = mongoose.Schema;
var Tasks = new Schema({
  project: String,
  description: String
});
mongoose.model('Task', Tasks);

// Save
var Task = mongoose.model('Task');
var task = new Task();
task.project = 'Bikeshed';
task.description = 'Paint the bikeshed red.';
task.save(function (err) {
  if (err) throw err;
  console.log('Task saved.');
});

// Find
Task.find({'project': 'Bikeshed'}, function (err, tasks) {
  for (var i = 0; i < tasks.length; i++) {
    console.log('ID:' + tasks[i]._id);
    console.log(tasks[i].description);
  }
});

// Update
Task.update(
  {_id: '5687b01f8e58ea5c46dc901b'},
  {description: 'Paint the bikeshed green.'},
  {multi: false},
  function (err, rows_updated) {
    if (err) throw err;
    console.log('Updated.');
  }
);

// Remove
Task.findById('5687b01f8e58ea5c46dc901b', function (err, task) {
  task.remove();
});
