const mongooes = require('mongoose');


const connectionRequestSchema = new mongooes.Schema({

    fromUserId: {
        type: mongooes.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId: {
        type: mongooes.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} is incorrect type`
        }
    }
},
{
    timestamps: true
});

connectionRequestSchema.index({fromUserId: 1, toUserId: 1}); // Compound Index Asending Order.

// connectionRequestSchema.pre('save', function(next){
//     const connectionRequest = this;

//     // check if the fromUserId is same as toUserId
//     if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
//         throw new Error('Cannot send connection request to yourself!!')
//     }
//     next()
// })

const ConnectionRequestModel = new mongooes.model('ConnectionModel', connectionRequestSchema);

module.exports = ConnectionRequestModel;
