import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from '../lib/prisma.js'
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
})

export const register = async (req, res) => {
    // db operations
    try {
        const {username, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10) // 10 is basically salt rounds 
        // console.log(hashedPassword);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            },
        });
        console.log(newUser);
        res.status(201).json({message: "User Created"})
    } catch (err) {
        console.log("DB Auth Error (Register) :: ", err)
        res.status(500).json({message: "Failed to register!"})
    }
}

export const login = async (req, res) => {
    
    try {
        const {username, password} = req.body

        // user exists
        const user = await prisma.user.findUnique({
            where: {username : username}
        })

        if(!user) res.status(404).json({message: "User with this username not found!"})

        // check if the password is correct
        // console.log(password, user.password);
        const isPasswordValid = await bcrypt.compare(password, user.password)

        // console.log("checker", isPasswordValid);
        if(!isPasswordValid) res.status(401).json({message: "Password does not match!"})
        
        // generate cookie token and send it to the user
        // res.setHeader("Set-Cookie", "test=" + "myValue").json("success") --> instead of this we can directly use below method by just using cookie-parser
        
        const age = 1000 * 60 * 60 * 24 * 7

        const token = jwt.sign({
            id: user.id,
            isAdmin: true,
        }, process.env.JWT_SECRET_KEY, {expiresIn: age}) // now if a user requests to delete a post i can verify whether that post belong to that user by using jwt verify(encrypting id from cookie)
        
        const {password: userPassword, ...userInfo} = user

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: age
        }).status(200).json(userInfo)

    } catch (error) { 
        console.log("DB Auth Error (Login) :: ", error)
        res.status(500).json({message: "Failed to login!"})
    }
}

export const logout = (req, res) => {
    res.clearCookie("token").status(200).json({message: "Logout Successful"})
} 