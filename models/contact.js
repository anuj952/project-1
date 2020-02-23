var mongoose    =   require("mongoose");
var passportLocalMongoose   =   require("passport-local-mongoose");

var ContactSchema = new mongoose.Schema({
	name: String,
    email: String,
    subject: String,
	message: String
});

ContactSchema.plugin(passportLocalMongoose);

module.exports  =   mongoose.model("Contact",ContactSchema);