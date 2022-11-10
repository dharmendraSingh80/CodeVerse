const User = require('../models/user');
const fs = require('fs');
const path = require('path');
 const crypto = require('crypto');
const forgetPasswordMailer = require('../mailers/forget_password_mailer');
const { resolveSoa } = require('dns');

//let's keep it same as before
module.exports.profile = function(req, res){
     User.findById(req.params.id,function(err, user){
          return res.render('user_profile', {
               title:'User Profile',
               profile_user:user
          });
     });
     
}

module.exports.update = async function(req, res){
     // if(req.user.id == req.params.id){
     //      User.findByIdAndUpdate(req.params.id, req.body, function(err, user){
     //           req.flash('success', 'User details updated Successfully!');
     //           return res.redirect('back');
     //      });
     // }else{
     //      req.flash('error', 'Unauthorized!');
     //      return res.status(401).send('Unauthorized');
     // }

     if(req.user.id == req.params.id){
          try{
               let user = await User.findById(req.params.id);
               User.uploadAvatar(req, res, function(err){
                    if(err){console.log('*****Multer Error:', err);}
                    
                    user.name = req.body.name;
                    user.email = req.body.email;

                    if(req.file){

                         if(user.avatar){
                              if(fs.existsSync(path.join(__dirname, '..', user.avatar))){
                                   fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                              }
                         }

                         //this is saving the path of the uploaded file into the avatar field in the user
                         user.avatar = User.avatarPath + '/' + req.file.filename
                    }
                    user.save();
                    return res.redirect('back');
               });

          }catch(err){
               req.flash('error', err);
               return res.redirect('back');
          }
     
     }else{
          req.flash('error', 'Unauthorized!');
          return res.status(401).send('Unauthorized');
     }
}

//render the sign up page
module.exports.signUp = function(req, res){

     if(req.isAuthenticated()){
          return res.redirect('/users/profile');
     }

     return res.render('user_sign_up', {
          title:'Codeial | Sign Up'
     })
};


// render the sign in page
module.exports.signIn = function(req, res){

     if(req.isAuthenticated()){
         return res.redirect('/users/profile');
     }

     return res.render('user_sign_In', {
          title:'Codeial | Sign In'
     })
};

//get the sign up data
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
     req.flash('error', 'Passwords do not match');
     return res.redirect('back');
    }

     User.findOne({email: req.body.email}, function(err, user) {
          if(err){
               req.flash('error', err);
               return res.redirect('back');  
          }

          if(!user){
               User.create(req.body, function(err, user){
                    if(err){
                         req.flash('error', err);
                         return res.redirect('back');  
                      }
                      
                      return res.redirect('/users/sign-in');
               })
          }else{
               req.flash('success', 'You have signed up, login to continue!');
               return res.redirect('back');
          }
     });
}

//sign in create the session for the user
module.exports.createSession = function(req, res){
     req.flash('success', 'Logged in Successfully');
     return res.redirect('/');
}

module.exports.destroySession =  function(req, res){
     req.logout(function(err) {
          if (err) {
            return next(err);
          }
          req.flash('success', 'You have logged out !');
          res.redirect("/");
      });
}

//forget password start

module.exports.forgetPassword =  (req, res) => {
      try{
          res.render('mailers/forget',{
               title: 'forget'
          })
     }catch(error){
          console.log(error);
     }
}

module.exports.forgetVerify = async(req, res) => {
     try{
          const email = req.body.email;
          const userData = await User.findOne({email:email});
          if(userData){
               const randomString = crypto.randomBytes(20).toString('hex');
               const  updatedData = await User.updateOne({email:email}, {$set:{token:randomString}});
               forgetPasswordMailer.sendResetPasswordMail(userData.name, userData.email, randomString);
               res.render('mailers/forget', {message: "Please check your mail to reset your password.",title: 'forget'});
          }else{
               res.render('mailers/forget', {message: 'User email is incorrect.',title: 'forget'});
          }

     }catch(error){
          console.log(error.message);
     }
}


module.exports.forgetPasswordLoad = async(req, res) => {
     try{
          const token = req.query.token;
          const tokenData = await User.findOne({token:token});
          if(tokenData){
               res.render('mailers/forgetMailer/forgetP', {user_id: tokenData._id, title:'forget_password'});
          }else{
               res.render('mailers/forgetMailer/404', {message:'Token is Invalid.'});
          }
     }catch(error){
          console.log(error.message);
     }
}

module.exports.resetPassword = async (req, res) => {
     try{
          const password = req.body.password;
          const user_id = req.body.user_id;
          if(password != req.body.confirm_password){
               req.flash('error', 'Passwords do not match');
               return res.redirect('back');
          }
          const updatedData = await User.findByIdAndUpdate({_id:user_id}, {$set:{
               password:password, token:''
          }});
          req.flash('success', 'Password Successfully changed');
          res.redirect('/');
     }catch(error){
          console.log(error.message);
     }
}