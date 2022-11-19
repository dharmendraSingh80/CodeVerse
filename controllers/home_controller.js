const Frienship = require('../models/friendship');
const Post = require('../models/post');
const { findById } = require('../models/user');

const User = require('../models/user');

module.exports.home = async function(req, res){
    // console.log(req.cookies);
    // res.cookie('user_id', 25);

    // Post.find({}, function(err, posts){
    //     return res.render('home', {
    //         title:'Codeial | Home',
    //         posts: posts
    //     });
    // });

    try{
        //populate the user of each post
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate:{
                path: 'user'
            },
            populate:{
                path:'likes'
            }
        }).populate('comments')
        .populate('likes');
        let users = await User.find({});

        let friends = await Frienship.find({}).populate('to_user');

        return res.render('home', {
            title:'Codeial | Home',
            posts: posts,
            all_users: users,
            all_friends:friends
        });

    }catch(err){
        console.log('Error', err);
        return;
    } 
}

// module.exports.actionName = function(req, res){}

//using then
//Post.find({}).populate('comments').then(function());

//using promise
// let posts = Post.find({}).populate('comments').exec();
// posts.then();

