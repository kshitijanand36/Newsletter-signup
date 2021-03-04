const express = require("express");

const body_parser = require("body-parser");

const app = express();

const https = require("https");

app.use(express.static("public"));

app.use(body_parser.urlencoded({extended : true}));

app.get("/" , function(req , res){
  res.sendFile(__dirname + "/signup.html");
  // res.sendFile(__dirname + "/signin.html");
});

app.post("/failure" , function(req , res){

  res.redirect("/");
})

app.post("/" , function(req , res){

  const name = req.body.first_name;
  const second_name = req.body.second_name;
  const email = req.body.email__;

  console.log(name );
  console.log(second_name);
  console.log(email);

  const data_ = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields : {
          FNAME: name,
          LNAME : second_name,

        }
      }
    ]
  } ;

  const json_data = JSON.stringify(data_);

  const url = "https://us7.api.mailchimp.com/3.0/lists/6f8dcca163";
  //the options required to send data to mailchimp server
  const options = {
    //these values are specified in the documentation
    method : "POST",
    //authorization , requires username(which could be any string) and password(api key)
    auth : "kshitij:api" //the api key has been hidden due to security resons
  }

  //using above in our https request
   status = ""
  const request = https.request(url , options , function(response){

    // console.log(response);
    // console.log(response.statusCode);
    status = response.statusCode;
    response.on('data' , function(data){
      var t = JSON.parse(data);
      // console.log(t);
    })
    if(response.statusCode == "200"){
      res.sendFile(__dirname + "/success.html");

    }
    else{

      res.sendFile(__dirname + "/failure.html");
    }
  });

  request.write(json_data);

  request.end();
  // console.log(status);

});

app.listen(process.env.PORT || 3000 , function(){

  console.log("Server started at port 3000");
});

