var User = require('../models/user.model');
var Credit = require('../models/credit.model');
var jwt = require('jwt-simple');
var jwtSecret = process.env.jwtSecret;
var XLSX = require('xlsx');
var fs = require('file-system');
exports.login = function(req, res) {
  var userData = req.body;
  User.authenticate(userData, function(error, user) {
    if (error) {
      res.status(422);
      res.send("Invalid credentials");
    } else {
      var token = jwt.encode(user.get('id'), jwtSecret);
      res.json({
        token: token,
        name: user.get('first_name') + ' ' + user.get('last_name'),
        id: user.get('id'),
        permission: user.get('permission')
      });
    }
  });
};

exports.create = function(req, res) {
  var userData = req.body;
  User.create(userData, function(error, user) {
    if (error) {
      res.json({error: "User already exists"});
    } else {
      res.json(user);
    }
  });
};

exports.update = function(req, res) {
  var userData = req.body;
  User.update(userData, function(error, user) {
    if (error) {
      res.json({error: "User's update record failed."});
    } else {
      res.json(user);
    }
  });
};

exports.xlsxFileUpload = function(req, res) {
  var workbook = XLSX.readFile(__dirname + '/uploads/testXlsFiles.xlsx');
  var result = {};
  try {
    workbook.SheetNames.forEach(function(sheetName) {
        var xlsRow = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if(xlsRow.length > 0){
            result['callBackObject'] = xlsRow;
        }
    });
     res.send(result);
  }catch(err) {
    res.send(false);
  }
 
};

exports.addRows = function(req, res) {
  var rowDatas = req.body;
  //console.log(rowDatas);
   Credit.insertExcelData(rowDatas, function(error, user) {
    if (error) {
      res.json({error: "User's update record failed."});
    } else {
      res.json(user);
    }
  });
};

exports.validate = function(req, res) {
  var token = req.body.token;
  try {
    var userId = jwt.decode(token, jwtSecret);
    User.validate(userId, function(valid) {
      res.send(valid);
    });
  }
  catch(err) {
    res.send(false);
  }
};

exports.getUsers = function(req, res) {
  // Make sure that user accessing data has proper access
  var token = req.query.token;
  var userId = jwt.decode(token, jwtSecret);
  User.validate(userId, function(valid) {
    if (valid) {
      User.getAll(function(users) {
        res.json(users);
      });
    } else {
      res.send("Invalid credentials");
    }
  });

};

exports.getUserDetails = function(req, res) {
  // Make sure that user accessing data has proper access
  var token = req.query.token;
  var userId = jwt.decode(token, jwtSecret);
  User.validate(userId, function(valid) {
    if (valid) {
      User.getUserDetailsById(req.query.id,function(result) {
          res.json(result);
      });
    } else {
      res.send("Invalid credentials");
    }
  });

};