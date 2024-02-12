import{Router} from 'express'
import { sample_products, sample_tags } from '../data';
import asyncHandler from 'express-async-handler';
import { ProductdModel } from '../models/product.model';


const router =Router();

const multer = require('multer');
let filename: string;
const storage = multer.diskStorage({
  destination:  "./uploads",
  filename:  (req: any,file: any,redirect: any) =>{
    let date = Date.now();
    let f1 = date + "."+ file.mimetype.split('/')[1];
    redirect(null,f1);
     filename= f1;
  }
});

const upload = multer({ storage: storage });


router.get("/seed", asyncHandler(
    async (req, res) => {
        const productsCount = await ProductdModel.countDocuments();

        if(productsCount> 0){

        res.send("Seed is already done!");
        return;
        }
        await ProductdModel.create(sample_products);
        res.send("Seed Is Done");

    }
));

router.delete('/remove/:id', asyncHandler(
  async (req , res) => {
    try {
      const productId = req.params.id;

      // Find the product by its ID and remove it
      const removedProduct = await ProductdModel.findByIdAndRemove(productId);

      if (!removedProduct) {
        res.status(404).send({ message: 'Product not found' });
      }else{
        res.send({ message: 'Product removed successfully' });
      }

      
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  }
));


router.put('/edit/:id', asyncHandler(
  async (req , res) => {
    try {
      const productId = req.params.id;
      const {
        name,
        price,
        tags,
        favorite,
        stars,
        imageUrl,
        origins,
        cookTime,
      } = req.body;

      // Find the product by its ID
      const product = await ProductdModel.findById(productId);

      if (!product) {
        res.status(404).send({ message: 'Product not found' });
      }else{
        product.name = name;
      product.price = price;
      product.tags = tags;
      product.favorite = favorite;
      product.stars = stars;
      product.imageUrl = imageUrl;
      product.origins = origins;
      product.cookTime = cookTime;

      // Save the updated product
      const updatedProduct = await product.save();

      res.status(200).send(updatedProduct);
      }

      // Update the product properties
      
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  }
));


router.post('/create',upload.any('image'), asyncHandler(
  async (req , res) => {
  try {
    const {
      name,
      price,
      tags,
      favorite,
      stars,
      imageUrl,
      origins,
      cookTime,
    } = req.body;
     
    const existingProduct = await ProductdModel.findOne({ name });
    
    if (existingProduct) {
      // If a product with the same name exists, send an error response
      res.status(400).send({ message: 'Product with this name already exists' });
    }else{
      
    const newProduct = new ProductdModel({
      name,
      price,
      tags,
      favorite,
      stars,
      imageUrl,
      origins,
      cookTime,
    });
    newProduct.imageUrl=filename;
    
    filename="";

    const savedProduct = await newProduct.save();

    res.status(200).send(savedProduct);
  }} catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
}));



router.get("/", asyncHandler(
    async (req, res) => {
      const products = await ProductdModel.find();
      res.send(products);
    }
  ))
  

router.get("/search/:searchTerm",asyncHandler(
    async (req, res)=>{
        const searchRegex = new RegExp(req.params.searchTerm,'i');
        const products= await ProductdModel.find({name:{$regex:searchRegex}})
        res.send(products);
    }
))

router.get("/tags", asyncHandler(
    async (req, res) => {
      const tags = await ProductdModel.aggregate([
        {
          $unwind:'$tags'
        },
        {
          $group:{
            _id: '$tags',
            count: {$sum: 1}
          }
        },
        {
          $project:{
            _id: 0,
            name:'$_id',
            count: '$count'
          }
        }
      ]).sort({count: -1});
  
      const all = {
        name : 'All',
        count: await ProductdModel.countDocuments()
      }
  
      tags.unshift(all);
      res.send(tags);
    }
  ))

  router.get("/tag/:tagName",asyncHandler(
    async (req, res) => {
      const products = await ProductdModel.find({tags: req.params.tagName})
      res.send(products);
    }
  ))

  router.get("/:productId", asyncHandler(
    async (req, res) => {
      const product = await ProductdModel.findById(req.params.productId);
      res.send(product);
    }
  ))
  
export default router;