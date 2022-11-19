const Friendship = require('../models/friendship');
const User = require('../models/user');
module.exports.friendship = async(req, res) => {
    try{
        let deleted = false;
        let friends = await User.findById(req.query.id).populate('friendships');

        let existFriend = await Friendship.findOne({
            to_user: req.query.id,
            from_user:req.user._id
        });

        if(existFriend){
            friends.friendships.pull(existFriend);
            friends.save();
            existFriend.remove();
            deleted=true;
        }else{
            let newFriend = await Friendship.create({
                to_user: req.query.id,
                from_user:req.user._id
            });
            friends.friendships.push(newFriend._id);
            friends.save();
        }
      
        return res.json(200, {
            message: 'Request Successfull',
            data:{
                deleted:deleted
            }
        });

    }catch(err){
        console.log(err);
        return res.json(500,{
            message:'Internal Server Error'
        });
    }
}