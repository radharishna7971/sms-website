 var talent = require('../controllers/talent.controller.js');
 module.exports = function(app) {

  app.get('/api/talent/all', talent.getAll);
  app.get('/api/talent/all/names', talent.getNames);
  app.get('/api/talent/allCreatedBy', talent.getAllCreatedByname);
  app.get('/api/talent/allAwards', talent.allAwards);
  app.get('/api/talent/allCountryNames', talent.getAllCountryNames);
  app.get('/api/talent/profile', talent.getProfile);
  app.get('/api/talent/talentPartnerName', talent.talentPartnerName);
  app.get('/api/talent', talent.getTalent);
  app.post('/api/talent/add-edit', talent.addOrEdit);
  app.delete('/api/talent/delete', talent.remove);
  app.post('/api/talent/talent-credit-join/add', talent.addTalentCreditJoin);
  app.delete('/api/talent/talent-credit-join/delete', talent.deleteTalentCreditJoin);
 };