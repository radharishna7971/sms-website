var Talent = require('../models/talent.model');
var TalentCreditJoin = require('../models/talentCreditJoin.model');
var jwt = require('jwt-simple');
var jwtSecret = process.env.jwtSecret;

exports.getAll = function (req, res) {
  var page_number = req.body.page_number;
  var page_size = req.body.page_size;
  var filer_data_inputs = req.body.filer_data_inputs;
  var array_lenths = req.body.array_lenths;
  Talent.getAll(page_number, page_size, filer_data_inputs, array_lenths, function (result) {
    res.json(result);
  });
};

exports.getTalentRowsNumber = function (req, res) {
  Talent.getRowCout(function (result) {
    res.json(result);
  });
};
exports.getProfile = function (req, res) {
  var talentId = req.query.talent_id;
  Talent.getProfile(talentId, function (result) {
    res.json(result);
  });
};


exports.removeTalentAgent = function (req, res) {
  var talentId = req.query.talentID;
  var associateId = req.query.asdid;
  var associateTypeId = req.query.atypeid;
  Talent.removeTalentAgentJoin(talentId,associateId,associateTypeId, function (result) {
    res.json(result);
  });
};

exports.talentPartnerName = function (req, res) {
  var talentId = req.query.talent_id;
  var partnerName = req.query.partner_name;
  Talent.talentPartnerName(talentId, partnerName, function (result) {
    res.json(result);
  });
};

exports.getNames = function (req, res) {
  Talent.getNames(req.query.nameChars, function (result) {
    res.json(result);
  });
};

exports.getAllCreatedByname = function (req, res) {
  Talent.getAllCreatedByname(function (result) {
    res.json(result);
  });
};

exports.getAgentDetails = function (req, res) {
  var checkTypeVal = req.query.checkType;
  console.log(checkTypeVal);
  Talent.getAgentDetails(checkTypeVal,function (result) {
    res.json(result);
  });
};

exports.addAgentDetails = function (req, res) {
  var dataList = req.body.addAgentArray;
  var isNewrow = req.body.isNewRow;
  Talent.addNewTalentAgentJoin(isNewrow, dataList, function (err, result) {
    if (!err) {
      res.json(result);
    } else {
      res.json(err);
    }
  });
};

exports.getAgentDetailsById = function (req, res) {
  var idListData = req.body.id_data_list;
  Talent.getAgentDetailsById(idListData, function (err, result) {
    if (!err) {
      res.json(result);
    } else {
      res.json(err);
    }
  });
};

exports.updateAgentRowDetails = function (req, res) {
  var dataRowDetails = req.body.dataList;
  Talent.updateAgentRowDetails(dataRowDetails, function (err, result) {
    if (!err) {
      res.json(result);
    } else {
      res.json(err);
    }
  });
};

exports.allAwards = function (req, res) {
  Talent.allAwards(function (result) {
    res.json(result);
  });
};

exports.getAllCountryNames = function (req, res) {
  Talent.getAllCountryNames(function (result) {
    res.json(result);
  });
};

exports.getTalent = function (req, res) {
  Talent.get(req.query.id, function (result) {
    res.json(result);
  });
};

exports.addOrEdit = function (req, res) {
  req.body.last_edited = new Date().toMysqlFormat();
  Talent.addOrEdit(req.body, function (err, result) {
    if (!err) {
      res.json(result);
    } else {
      res.json(err);
    }
  });
};

exports.remove = function (req, res) {
  var data = {
    talentId: req.query.id,
    userId: req.query.user_id,
    deletedAt: new Date().toMysqlFormat()
  };

  Talent.remove(data, function (success) {
    if (success) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
};

exports.addTalentCreditJoin = function (req, res) {
  TalentCreditJoin.add(req.body.talent_id, req.body.credit_ids, req.body.role_id, function (result) {
    res.json(result);
  });
};

exports.deleteTalentCreditJoin = function (req, res) {
  TalentCreditJoin.remove(req.query.join_id, function (result) {
    res.json(result);
  })
}

// JS to SQL date conversion
/**
 * You first need to create a formatting function to pad numbers to two digits…
 **/
function twoDigits(d) {
  if (0 <= d && d < 10) return "0" + d.toString();
  if (-10 < d && d < 0) return "-0" + (-1 * d).toString();
  return d.toString();
}

/**
 * …and then create the method to output the date string as desired.
 * Some people hate using prototypes this way, but if you are going
 * to apply this to more than one Date object, having it as a prototype
 * makes sense.
 **/
Date.prototype.toMysqlFormat = function () {
  return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};