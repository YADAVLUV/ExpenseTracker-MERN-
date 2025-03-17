import User from "../models/UserSchema.js";
import bcrypt from "bcrypt";
import jwt  from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;
import nodemailer from "nodemailer";

export const registerControllers = async (req, res, next) => {
    try{
        const {name, email, password} = req.body;

        // console.log(name, email, password);

        if(!name || !email || !password){
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            }) 
        }

        let user = await User.findOne({email});

        if(user){
            return res.status(409).json({
                success: false,
                message: "User already Exists",
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        // console.log(hashedPassword);

        let newUser = await User.create({
            name, 
            email, 
            password: hashedPassword, 
        });

        return res.status(200).json({
            success: true,
            message: "User Created Successfully",
            user: newUser
        });
    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }

}
export const loginControllers = async (req, res, next) => {
    try{
        const { email, password } = req.body;

        // console.log(email, password);
  
        if (!email || !password){
            return res.status(400).json({
                success: false,
                message: "Please enter All Fields",
            }); 
        }
    
        const user = await User.findOne({ email });
    
        if (!user){
            return res.status(401).json({
                success: false,
                message: "User not found",
            }); 
        }
    
        const isMatch = await bcrypt.compare(password, user.password);
    
        if (!isMatch){
            return res.status(401).json({
                success: false,
                message: "Incorrect Email or Password",
            }); 
        }

        delete user.password;

        return res.status(200).json({
            success: true,
            message: `Welcome back, ${user.name}`,
            user,
        });

    }
    catch(err){
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const setAvatarController = async (req, res, next)=> {
    try{

        const userId = req.params.id;
       
        const imageData = req.body.image;
      
        const userData = await User.findByIdAndUpdate(userId, {
            isAvatarImageSet: true,
            avatarImage: imageData,
        },
        { new: true });

        return res.status(200).json({
            isSet: userData.isAvatarImageSet,
            image: userData.avatarImage,
          });


    }catch(err){
        next(err);
    }
}

export const allUsers = async (req, res, next) => {
    try{
        const user = await User.find({_id: {$ne: req.params.id}}).select([
            "email",
            "username",
            "avatarImage",
            "_id",
        ]);

        return res.json(user);
    }
    catch(err){
        next(err);
    }
}
export const forgetpassword  = async (req, res, next) => {
        try {
          const { email } = req.body;
      
          // Check if user exists
          const user = await User.findOne({ email });
          if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
          }
      
          // Generate a secure token
          const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      
          // Save the token to the user model
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
          await user.save();
      
          // Create reset link
          const resetLink = `https://expense-tracker-mern-loks-6dkzmmng0-love-yadavs-projects.vercel.app/resetpassword/${token}`;
      
          // Send email
          const mailOptions = {
            from: process.env.EMAIL,
            to: user.email,
            subject: "Password Reset Request",
            html: `<h3>Password Reset</h3>
                  <p>Click the link below to reset your password:</p>
                  <a href="${resetLink}">${resetLink}</a>
                  <p>This link will expire in 1 hour.</p>`,
          };
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL,
              pass: "scbanbcobfnfrylc" 
            }
          });
      
      
          await transporter.sendMail(mailOptions);
      
          res.json({ success: true, message: "Password reset link sent to your email" });
      
        } catch (error) {
          console.error("Error in forgot-password:", error);
          res.status(500).json({ success: false, message: "Internal Server Error" });
        }
      }

      export const resetpassword = async (req, res) => {
        try {
            const { token } = req.params;
            const { newPassword } = req.body;
    
            if (!token || !newPassword) {
                return res.status(400).json({ success: false, message: "Invalid request" });
            }
    
            // Verify the token
            const decoded = jwt.verify(token, JWT_SECRET);
            if (!decoded) {
                return res.status(400).json({ success: false, message: "Invalid or expired token" });
            }
    
            // Find user by ID
            const user = await User.findById(decoded.id);
            if (!user || user.resetPasswordToken !== token || user.resetPasswordExpires < Date.now()) {
                return res.status(400).json({ success: false, message: "Invalid or expired token" });
            }
    
            // Hash new password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            
            // Clear reset token fields
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
    
            // Save the updated user
            await user.save();
    
            res.json({ success: true, message: "Password reset successful!" });
        } catch (error) {
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    };
    