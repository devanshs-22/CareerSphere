import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js"
import { profile } from "console";

export const getCurrentUser=async (req,res)=>{
    try {
        let id=req.userId
        const user=await User.findById(id).select("-password")
        if(!user){
            return res.status(400).json({message:"user does not found"})
        }

        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        
        return res.status(400).json({message:"get current user error"})
    }
}

export const updateProfile=async(req,res)=>{
    try{
        let {firstName,lastName,userName,headline,location,gender,skills,education,experience} =req.body
         if (typeof skills === "string") skills = JSON.parse(skills);
        if (typeof education === "string") education = JSON.parse(education);
        if (typeof experience === "string") experience = JSON.parse(experience);
    let profileImage;
    let coverImage
    console.log(req.files)
        if(req.files.profileImage){
        profileImage=await uploadOnCloudinary(req.files.profileImage[0].path)
       }
        if(req.files.coverImage){
        coverImage=await uploadOnCloudinary(req.files.coverImage[0].path)
       }

       let user=await User.findByIdAndUpdate(req.userId,{
        firstName,lastName,userName,headline,location,gender,skills,education,experience,profileImage,coverImage
       },{new:true}).select("-password")
       return res.status(200).json(user)
    } catch(error){
        console.log(error)
        return res.status(500).json({message:`update profile error ${error}`})
    }
}