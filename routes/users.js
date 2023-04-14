var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.get('/employee_list', function (req, res, next) {
  showEmployeeList([]);
});

router.get('/manager_list', function (req, res, next) {
  showManagerList([]);
});

function showEmployeeList(employees) {
  employees.forEach((employee) => {
    const salaries = employees.salaries();
    const tasks = employees.tasks();
    const data = {
      salaries,
      tasks,
    };
    display(res, data);
  });
}

function showManagerList(managers) {
  managers.forEach((manager) => {
    const salaries = manager.salaries();
    const tasks = manager.tasks();
    const data = {
      salaries,
      tasks,
    };
    display(data);
  });
}
/**
 * send data to clients
 * @param {HTTPResponse} res
 * @param {*} data
 */
function display(res, data) {
  res.send(JSON.stringify(data));
}
module.exports = router;
