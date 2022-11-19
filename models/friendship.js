const mongoose = require('mongoose');
const frienshipSchema = new mongoose.Schema({
    //the user who sent this request 
    from_user:{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    // the user who accepted this request, the naming is just to understand, otherwise, the users won't see a difference 
    to_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }, 
},{
    timestamps:true
});

const Frienship = mongoose.model('Friendship', frienshipSchema);
module.exports = Frienship;