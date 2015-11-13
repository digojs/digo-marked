var digo = require("digo");

exports.default = function () {
	digo.src("fixtures/*.md").pipe("../").dest("_build");
};
