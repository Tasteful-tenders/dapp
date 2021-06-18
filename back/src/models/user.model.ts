import mongoose, {Schema, Document} from 'mongoose'
const bcrypt = require('bcrypt');

export interface IUser extends Document {
    _id: string,
    pseudo: string,
    bio: string,
    useful_links: Array<string>
}

const userSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    pseudo: { type: String, required: true, unique: true },
    bio: { type: String },
    useful_links:  [
        { type : String }
    ]
});

userSchema.pre<IUser>('save', async function(next: any) {

    if (this.isModified('pseudo')) {
        const pseudoExists: boolean = await User.exists({ pseudo: this.pseudo })
        if (pseudoExists) return next(new Error('Pseudo already exists !'))
    }

    try {
        return next()
    } catch (error) {
        return next(error)
    }

})

const User = mongoose.model<IUser>('User', userSchema)

export { User }