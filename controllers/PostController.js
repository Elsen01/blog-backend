import PostModel from '../models/Post.js';

export const getAll = async (req,res) => {
   try {
       const post = await PostModel.find().populate('user').exec()

       res.json(post)
   }catch (err){
       console.log(err);
       res.status(500).json({
           message: 'failed',
       });
   }
};

export const findOne = async (req,res) => {
    try {
        const PostId = req.params.id;

        PostModel.findByIdAndUpdate(
            {
                _id: PostId,
            },
            {
                $inc: { viewsCount: 1 },
            },
            {
                returnDocument: 'after',
            },
            (err,doc) =>{
                if (err){
                    console.log(err);
                     return  res.status(500).json({
                        message: 'failed to return article',
                    })
                }
                if (!doc){
                    return  res.status(404).json({
                        message: 'Post Not Found'
                    })
                }
                res.json(doc)
            }
        )
    }catch (err){
        console.log(err);
        res.status(500).json({
            message: 'failed',
        })
    }
}

export const remove = async (req,res) => {
   try {
       const postId = req.params.id;

       PostModel.findByIdAndDelete(
           {
               _id: postId,
           },(err,doc) => {
               if (err){
                   console.log(err);
                  return  res.status(500).json({
                       message: 'Failed'
                   })
               }
               if (!doc){
                   return res.status(404).json({
                       message: 'Post Not Found'
                   })
               }
               res.json({
                   success: true,
               })
           })
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