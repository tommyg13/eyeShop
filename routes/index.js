var express = require('express');
var router = express.Router();
var Cart = require('../models/cart');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var Product = require('../models/product');

require("dotenv").config();
var pass=process.env.PASS;
var user=process.env.mUSER;

/* GET home page. */
router.get("/",(req,res)=>{
Product.find(function (err, products) {
  if (err) return console.error(err);
  var prodArr=Math.ceil(products.length/10);
  var pagArr=Array(prodArr).fill().map((e,i)=>i+1);
  var newArr=products.slice(0,10);
  res.render("index",{title:"Home",pagArr,newArr,css:["index.css"],csrfToken: req.csrfToken()});   
});
});

/* implement filter search */
router.post("/search/:type",(req,res)=>{
    var lower;
    var greater;
    var gender=req.body.gender;
    var brand=req.body.brand;
    
    if(req.body.price==="70") {
        greater=71;
        lower=0;
    } else if(req.body.price==="150") {
        greater=150;
        lower=71;
    } else {
        greater=1000;
        lower=151;
    }
if(req.params.type==="all") {        
    if(gender !=="both") {
    Product.find({})
    .where("brand").equals(brand)
    .where("gender").equals(gender)
    .where("price").gt(lower).lt(greater)
    .exec((err,prod)=>{
        if(err) console.log(err);
        else res.send(prod); 
    });
    } else {
    Product.find({})
    .where("brand").equals(brand)
    .where("price").gt(lower).lt(greater)
    .exec((err,prod)=>{
        if(err) console.log(err);
        else res.send(prod);
    });        
    }
}
else {
    if(gender !=="both") {
    Product.find({})
    .where("brand").equals(brand)
    .where("gender").equals(gender)
    .where("type").equals(req.params.type)    
    .where("price").gt(lower).lt(greater)
    .exec((err,prod)=>{
        if(err) console.log(err);
        else res.send(prod); 
    });
    } else {

    Product.find({})
    .where("brand").equals(brand)
    .where("type").equals(req.params.type)
    .where("price").gt(lower).lt(greater)
    .exec((err,prod)=>{
        if(err) console.log(err);
        else res.send(prod);

    });        
    }
    
}
});

/* find man's glasses */
router.get('/query/:type', function(req, res, next) {
    var type;
    if(req.params.type==="all") {
 Product.find()
 .where("type").ne(null)
    .exec((err,prod)=>{
        if(err) console.log(err);
        else {
           var newArr=prod.slice(0,10);
            res.send(newArr);
        }
    });        

    } else {
    if(req.params.type==="οράσεως") type="οράσεως";
    else type="ηλίου";
    Product.find({type},(err,prod)=>{
        if(err) console.log(err);
       else res.send(prod);
    });
    }
});

/*  Add products to the cart */
router.get('/add-to-cart/:id', function(req, res, next) {
    
    var productId = req.params.id;
    Product.findById(productId, function(err, product) {
       if (err) {
           return res.redirect('/');
       }
    var cart = new Cart(req.session.cart ? req.session.cart : {});       
        cart.add(product, product.id);
        req.session.cart = cart;
        res.json(cart.generateArray());
    });
});

/* render  sunglasses page*/
router.get("/sunglasses/:gender",(req,res)=>{
 var gender;
 if(req.params.gender==="man") gender="ανδρικά";
 else gender="γυναικεία";
 Product.find()
 .where("gender").equals(gender)
 .where("type").equals("ηλίου")
    .exec((err,prod)=>{
        if(err) console.log(err);
        else res.render("sunglasses",{title: gender+" γυαλιά",prod,css:["prods.css"]});
    });        
});

/* render  glasses page*/
router.get("/glasses/:gender",(req,res)=>{
 var gender;
  if(req.params.gender==="man") gender="ανδρικά";
 else gender="γυναικεία";
 Product.find()
 .where("gender").equals(gender)
 .where("type").equals("οράσεως")
    .exec((err,prod)=>{
        if(err) console.log(err);
        else res.render("sunglasses",{title: gender+" γυαλιά",prod,css:["prods.css"]});
    });        
});

/* render current's product info */
router.get("/product/:id",(req,res)=>{
    var id=req.params.id;
   Product.findById({_id:id},((err,prod)=>{
    var title=prod.brand + " " +prod.model;
    var img=prod.url,img1=prod.photos[0],img2=prod.photos[1];
    if(err) console.log(err);
    else {
     
        res.render("product",{title,prod,img,img1,img2,css:["prod.css"]});
    }
   }));
});

/* render contact page */
router.get("/contact",(req,res)=>{
   res.render("contact",{title:"Επικοινωνία",css:["contact.css"],csrfToken: req.csrfToken()}); 
});

router.post("/contact",(req,res)=>{
var options = {
    auth: {
        api_user: user,
        api_key: pass
    }
};
    
var mailer = nodemailer.createTransport(sgTransport(options));
var email = {
    to: 'iron_tommy13@hotmail.com',
    from: req.body.email,
    subject: req.body.subject,
    text: req.body.message,
    html: '<p>'+req.body.message+'</p>'
};
           var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
         if(!reg.test(req.body.email)) {
             res.send({message:"Email is not valid!"});
         }
         else {
mailer.sendMail(email, function(err) {
    var message="";
    if (err) { 
        message=err.message;
       res.send({message});
    } else {
        message="all goood";
        res.send({message:message});
    }
}); 
}
});

/* create pagination */
router.get("/pagination/:number",(req,res)=>{
   var number=req.params.number *10;
   var start=number-10;
Product.find(function (err, doc) {
        if(err) { res.status(500).json(err); return; }
        var newArr=doc.slice(start,number);
        res.send(newArr);
    });
});


/* render the cart with products */
router.get("/cart",(req,res)=>{
        var carts = new Cart(req.session.cart ? req.session.cart : {});

   res.render("cart",{title:"Καλάθι",products:carts.generateArray(),total:carts.totalPrice,css:["cart.css"]}); 
});

/* decrease item qty */
router.get("/decrease/:id",(req,res)=>{
    var id=req.params.id;
       var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.reduce(id);
    req.session.cart = cart;
    res.send(req.session.cart);
});

/* increase item qty */
router.get("/increase/:id",(req,res)=>{
    var id=req.params.id;
       var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.increase(id);
    req.session.cart = cart;
    res.send(req.session.cart);
});

/* remove item from cart */
router.get("/delete/:id",(req,res)=>{
    var id=req.params.id;
       var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(id);
    req.session.cart = cart;
    res.send(req.session.cart);
});

/* render checkout page */
router.get("/checkout",(req,res)=>{
    if(!req.session.cart) {
        res.redirect("/");
    } else {
    res.render("checkout",{title:"checkout",css:["checkout.css"],total:req.session.cart.totalPrice,csrfToken: req.csrfToken()});
    }
});

/* handle submission of checkout */
router.post("/checkout",(req,res)=>{

       if(!req.session.cart) {
        res.redirect("/");
    } else {

       var total=req.session.cart.totalPrice;
           var stripe = require("stripe")(
        "sk_test_wBJtSCfircSBzfaqCWEvuqEt"
    );

    stripe.charges.create({
        amount: total *100,
        currency: "eur",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Test Charge"
    }, function(err, charge) {
        if (err) {
            return res.redirect('/checkout');
        }
        else {
                var prod=req.session.cart.items;
                var prods=[];
                for (var key in prod) {
  if (prod.hasOwnProperty(key)) {
      var newArr=[];
      newArr.push(prod[key]);

        for(var i=0; i<newArr.length; i++){
            prods.push(newArr[i].item.brand + " " + newArr[i].item.model );
        }
  }
}     
var options = {
    auth: {
        api_user: user,
        api_key: pass
    }
};
    
var mailer = nodemailer.createTransport(sgTransport(options));
var email = {
    to: req.body.name,
    from: "iron_tommy13@hotmail.com",
    subject: "Επιβεβαίωση αγοράς",
    text: "H αγορά των " + prods + " ολοκληθώκε επιτυχώς! με συνολικό κόστος "+ total + "€",
    html: '<p>"H αγορά των "' + prods + ' ολοκληθώκε επιτυχώς! με συνολικό κόστος '+ total + '€</p>'
};


mailer.sendMail(email, function(err) {
    if (err) { 
        console.log(err);
    } else {
        req.session.destroy();
        res.redirect("/");
    }
}); 
        }
    }); 
    }
});


/* clear the cart */
router.get("/clearCart",(req,res)=>{
         req.session.destroy();
        res.redirect("back");   
});

/* remove from cart */
router.get("/clear/:id",(req,res)=>{
    var id=req.params.id;
       var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(id);
    req.session.cart = cart;
    res.send(cart.generateArray());
});


module.exports = router;
