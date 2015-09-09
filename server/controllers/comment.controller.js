var Comment = require('../models/comment.model');
var jwt = require('jwt-simple');
var jwtSecret = process.env.jwtSecret;

exports.add = function(req, res) {
  var commentData = req.body;
  commentData.user_id = jwt.decode(commentData.user_id, jwtSecret);
  Comment.add(req.body, function(result) {
    res.json(result);
  });
};

exports.remove = function(req, res) {
  Comment.remove(req.query.comment_id, function() {
    res.json(true);
  });
};
