var db = require('../config/db');
var Comment = require('../config/schema').Comment;


Comment.add = function(commentData, callback) {
  new Comment(commentData)
  .save()
  .then(function(comment) {
    db.knex.raw(' \
      SELECT \
        comments.text AS text, \
        CONCAT(users.first_name, \' \', users.last_name) AS name, \
        comments.created_at AS date, \
        comments.id AS comment_id, \
        talent.id AS talent_id \
      FROM comments, talent, users \
      WHERE comments.talent_id = talent.id \
      AND comments.user_id = users.id \
      AND comments.id = ' + comment.get('id').toString())
    .then(function(results) {
       callback(results[0][0]);
    });
  });
};

Comment.remove = function(commentId, callback) {
  new Comment({id: commentId})
  .fetch()
  .then(function(comment) {
    comment.set('deleted', true);
    comment.save();
    callback();
  });
};

module.exports = Comment;