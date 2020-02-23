var mongoose    =   require("mongoose");
var passportLocalMongoose   =   require("passport-local-mongoose");

var BlogSchema = new mongoose.Schema({
	title: String,
    image: String,
    author: String,
	body: String,
	created: {type: Date, default: Date.now}
});

BlogSchema.plugin(passportLocalMongoose);

module.exports  =   mongoose.model("BlogNew",BlogSchema);