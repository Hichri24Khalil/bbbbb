import { Router } from "express";
import { sample_users } from "../data";
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { User, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST } from "../constants/http_status";
import bcrypt from 'bcryptjs';

const router = Router();
  

router.get("/seed", asyncHandler(
  async (req, res) => {
     const usersCount = await UserModel.countDocuments();
     if(usersCount> 0){
       res.send("Seed is already done!");
       return;
     }
 
     await UserModel.create(sample_users);
     res.send("Seed Is Done!");
 }
 ))

 router.post("/login", asyncHandler(
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        res.status(404).json({ message: 'User not found!' });
      }else{
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({ message: 'Invalid credentials!' });
      }else{
  
      // Create a JWT token
      const payload = {
        id: user._id,
        email: user.email,
        name: user.name,
      };
      const secretKey = '123456';
      const token = jwt.sign({ userId: payload }, secretKey, { expiresIn: '8h' });
  
      res.status(200).json({ message: 'Login successful!', token, data: user });
    }}} catch (err) {
      res.status(500).json({ message: 'Login failed!', error: err });
    }}
));
router.delete('/remove/:id', asyncHandler(
  async (req , res) => {
    try {
      const userId = req.params.id;

      // Find the user by their ID and remove them
      const removedUser = await UserModel.findByIdAndRemove(userId);

      if (!removedUser) {
        res.status(404).send({ message: 'User not found' });
      }else{
        res.send({ message: 'User removed successfully' });
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
      const userId = req.params.id;
      const { name, email, password, address } = req.body;

      // Find the user by their ID
      const user = await UserModel.findById(userId);

      if (!user) {
        res.status(404).send({ message: 'User not found' });
      }else{
        user.name = name;
      user.email = email.toLowerCase();
      user.address = address;

      // If a new password is provided, update the password
      if (password) {
        const encryptedPassword = await bcrypt.hash(password, 10);
        user.password = encryptedPassword;
      }

      // Save the updated user
      const updatedUser = await user.save();

      res.send(updatedUser);
      }

      // Update the user properties
      
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Internal Server Error' });
    }
  }
));

router.get("/", asyncHandler(
  async (req, res) => {
    const users = await UserModel.find();
    res.send(users);
  }
))

router.post('/register', asyncHandler(
  async (req, res) => {
    try {
      const { email, name, phoneNumber, password,isAdmin,address } = req.body;
  
      // Check if the user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: 'User already exists!' });
      }else{
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user
      const user = new UserModel({ email, name, phoneNumber, password: hashedPassword,isAdmin,address });
      await user.save();
      res.status(201).json({ message: 'Registration successful!' });}
    } catch (err) {
      res.status(500).json({ message: 'Registration failed!', error: err });
    }
  }
))


const generateTokenResponse = (user: any) => {
  const token = jwt.sign(
    {
      email: user.email,
      isAdmin: user.isAdmin
    },
    "SomeRandomText",
    {
      expiresIn: "30d"
    }
  );

  return token;
};

export default router ;