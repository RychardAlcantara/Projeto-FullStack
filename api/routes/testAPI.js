var express = require('express');
var testAPIRouter = express.Router();

testAPIRouter.get('/', function(req, res, next) {
    res.json({ message: "API funcionando corretamente!" });
});

module.exports = testAPIRouter;