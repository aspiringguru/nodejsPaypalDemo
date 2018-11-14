//based on https://www.nodejsera.com/paypal-payment-integration-using-nodejs-part1.html
// import the required packages

var express = require('express');
var path = require('path');
var app = express();
var paypal = require('paypal-rest-sdk');

const fs = require('fs');
const contents = fs.readFileSync('paypal_config.json');
var jsonContent = JSON.parse(contents);
console.log("client_id:", jsonContent.paypalClientID);
console.log("client_secret:", jsonContent.paypalSecret);

// configure paypal with the credentials you got when you created your paypal app
paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': jsonContent.paypalClientID, // please provide your client id here
  'client_secret': jsonContent.paypalSecret  // provide your client secret here
});


// set public directory to serve static html files
//app.use('/', express.static(path.join(__dirname, 'public')));


// redirect to store when user hits http://localhost:3000
//app.get('/' , (req , res) => {
//    res.redirect('/index.html');
//})

app.get('/',function(req,res){
  console.log("route /")
  res.sendFile(path.join(__dirname+'/index.html'));
  //__dirname : It will resolve to your project folder.
});


// start payment process
app.get('/buy' , ( req , res ) => {
	// create payment object
    var payment = {
            "intent": "authorize",
	"payer": {
		"payment_method": "paypal"
	},
	"redirect_urls": {
		"return_url": "http://127.0.0.1:"+port+"/success",
		"cancel_url": "http://127.0.0.1:"+port+"/err"
	},
	"transactions": [{
		"amount": {
			"total": 39.00,
			"currency": "USD"
		},
		"description": " a book on mean stack "
	}]
    }


	// call the create Pay method
    createPay( payment )
        .then( ( transaction ) => {
            var id = transaction.id;
            var links = transaction.links;
            var counter = links.length;
            while( counter -- ) {
                if ( links[counter].method == 'REDIRECT') {
					// redirect to paypal where user approves the transaction
                    return res.redirect( links[counter].href )
                }
            }
        })
        .catch( ( err ) => {
            console.log( err );
            res.redirect('/err');
        });
});


// success page
//app.get('/success' , (req ,res ) => {
//    console.log(req.query);
//    res.redirect('/success.html');
//})
app.get('/success',function(req,res){
  console.log("route success");
  console.log(req.query);
  res.sendFile(path.join(__dirname+'/success.html'));
});



// error page
//app.get('/err' , (req , res) => {
//    console.log(req.query);
//    res.redirect('/err.html');
//})
app.get('/err',function(req,res){
  console.log("route err");
  res.sendFile(path.join(__dirname+'/err.html'));
});



let port = 3500
// app listens on port #
app.listen( port , () => {
    console.log(' app listening on ', port);
})



// helper functions
var createPay = ( payment ) => {
    console.log("createPay heper function.")
    return new Promise( ( resolve , reject ) => {
        paypal.payment.create( payment , function( err , payment ) {
         if ( err ) {
             reject(err);
         }
        else {
            resolve(payment);
        }
        });
    });
}
