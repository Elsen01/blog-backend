import PostModel from '../models/Post.js';

export const getAll = async (req,res) => {
   try {
       const post = await PostModel.find().populate('user').exec()

       res.json(post)
   }catch (err){
       console.log(err);
       res.status(500).json({
           message: 'failed',
       })
   }
}
export const create = async (req,res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            tags: req.body.tags,
            imageUrl: req.body.imageUrl,
            user: req.userId,

        });
        const post = await doc.save();

        res.json(post)

    }catch (err){
        console.log(err);
        res.status(500).json({
            message: 'Could Not Create Post'
        })
    }
}