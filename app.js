var express      	=	require('express');
var app          	=	express();
var bodyParser   	=	require('body-parser');
var mongoose     	=	require("mongoose");
var flash			=	require("connect-flash");
var passport	 	=	require("passport");
var expressSanitizer	=require('express-sanitizer');
var LocalStrategy	=	require("passport-local");
var methodOverride	=	require("method-override");
var Contact	 	    = 	require("./models/contact.js");
var Usernew			=	require("./models/user.js");
var BlogNew			=	require("./models/blog.js");

 mongoose.connect("mongodb://localhost/yelp_camp");
 mongoose.connect("mongodb+srv://anuj:anuj12345@cluster0-b0u1b.mongodb.net/test?retryWrites=true&w=majority",{
 	useNewUrlParser: true,
 	useCreateIndex: true
 }).then(() => {
 	console.log("connected to db");
 }).catch(err => {
 	console.log("ERROR:",err.message);
 });








app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.use(expressSanitizer());

// PASSPORT CONGIGURATION

app.use(require("express-session")({
	secret : "this is the secret",
	resave : false,
	saveUninitialized : false
}));


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(Usernew.authenticate()));
passport.serializeUser(Usernew.serializeUser());
passport.deserializeUser(Usernew.deserializeUser());


// Passing current user in every route
app.use(function(req,res,next){
	res.locals.CurrentUser = req.user;
	res.locals.error	=	req.flash("error");
	res.locals.success	=	req.flash("success");
	next();
});

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/contact",(req,res)=>{
    res.render("newcontact");
});
app.post("/contact",(req,res)=>{
    req.body.contact.message = req.sanitize(req.body.contact.message);
    Contact.create(req.body.contact,(err,newcontact)=>{
        if(err){
            console.log(err);
        }
        else{
            req.flash("success","Your contact information has been submitted successfully !!!");
            res.redirect("/");
        }
    })
})

app.get("/blogs",(req,res)=>{
    BlogNew.find({},(err,blog)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("blogs",{blogs:blog});
        }
    })
});

app.get("/blogs/new",isLoggedIn,(req,res)=>{
    res.render("newblog");
});

app.post("/blogs",isLoggedIn,(req,res)=>{
    req.body.blog.body = req.sanitize(req.body.blog.body);

    BlogNew.create(req.body.blog,(err,newblog)=>{
        if(err){
            console.log(err);
        }
        else{
            req.flash("success", "congrats new blog is published !!");
            res.redirect("/blogs");
        }
    })
})
app.post("/blogsort")

app.get("/blogs/:id",(req,res)=>{
    BlogNew.findById(req.params.id,(err,newblog)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{blog: newblog})
        }
    })
})

app.get("/blogs/:id/edit",isLoggedIn,(req,res)=>{
    BlogNew.findById(req.params.id,(err,foundblog)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("edit",{blog: foundblog});
        }
    })
})

app.put("/blogs/:id",isLoggedIn,function(req,res){
	
	req.body.blog.body=req.sanitize(req.body.blog.body);
	BlogNew.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedblog){
		if(err){
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs/"+ updatedblog.id);
		}
	})
	
})

app.delete("/blogs/:id",isLoggedIn,function(req,res){
	
	BlogNew.findByIdAndRemove(req.params.id,function(err){
		if(err){
			console.log(err);
			res.redirect("/blogs");
		}
		else{
			res.redirect("/blogs");
		}
	})
})

app.get("/contactindex",isLoggedIn,(req,res)=>{
    Contact.find({},(err,found)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("contactindex",{contact:found});
        }
    })
})

app.get("/contactindex/:id",isLoggedIn,(req,res)=>{
    Contact.findById(req.params.id,(err,foundcontact)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("contactinfo",{info:foundcontact});
        }
    })
})


app.get("/login",function(req,res){
	res.render("login");
});

app.post("/login",passport.authenticate("local",{
	successRedirect: "/" ,
	failureRedirect: "/login"
	
 }),function(req,res){
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});


function isLoggedIn(req,res,next){
	if(req.isAuthenticated()){
		return next();
		
	}
	req.flash("error","You need to be Logged In");
	res.redirect("/");
}








// app.use(indexRoutes);
// app.use(campgroundRoutes);
// app.use(commentRoutes);


const host = '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, function(){
	console.log("sever is running");
});