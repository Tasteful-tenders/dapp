import mongoose, {Schema, Document} from 'mongoose'
const bcrypt = require('bcrypt');

export interface IUser extends Document {
    _id: string,
    address: string,
    pseudo: string,
    bio: string,
    profilePic: string,
    twitter: string,
    instagram: string
}

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    address: { type: String , required: true, unique: true },
    pseudo: { type: String },
    bio: { type: String },
    profilePic: { type: String },
    twitter: {type: String },
    instagram: {type: String },
});

userSchema.pre<IUser>('save', async function(next: any) {

    try {
        return next()
    } catch (error) {
        return next(error)
    }

});

const User = mongoose.model<IUser>('User', userSchema)

export { User }