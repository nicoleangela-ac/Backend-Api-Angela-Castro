const Grocery = require('../models/grocery');

exports.createGrocery = async (req, res, next) => {
    try {
        const postData = req.body;
        const grocery = {
            "name": postData.name,
            "category": postData.category,
            "price" : postData.price
        }
    
        const newGrocery = new Grocery(grocery);
        await newGrocery.save()
        res.status(200).json(response);

    } catch (error) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.getGrocery = async (req, res, next) => {
    try{

        const grocery = await Grocery.find();
    
      if(!grocery){
        const error = new Error('No Grocery Found!');
        error.statusCode = 404;
        throw error;
      }
    
    res.status(200).json({
        grocery: grocery
    });
  
    }catch(err){
      if(!err.statusCode){
        err.statusCode = 500;
      }
      next(err);
    }
  };

  exports.editGrocery = async (req, res, next) => {
    try{
        const postData = req.body;
        const id = postData.id;
        const company = await Grocery.findByIdAndUpdate({_id: id},
            {
                id : id,
                name: postData.name,
                category: postData.category,
                price: postData.price,
            },{new: true});
    
            if(!company){
                const error = new Error('No Grocery Info Found!');
                error.statusCode = 404;
                throw error;
            }
    
        res.status(200).json({
            message:"Grocery Info Updated!"
    });
  
    }catch(err){
      if(!err.statusCode){
        err.statusCode = 500;
      }
      next(err);
      }
};

exports.deleteGrocery = async (req, res, next) => {
    try{
        const postData = req.body;
        const id = postData.id;
         await Grocery.deleteOne({_id: id})
    
        res.status(200).json({
            message:"Grocery Deleted!"
    });
  
    }catch(err){
      if(!err.statusCode){
        err.statusCode = 500;
      }
      next(err);
      }
};