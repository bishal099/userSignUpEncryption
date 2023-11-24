import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";

class Controller {
    static testGet = (req, res) => {
        res.send('Hellooooo FROM CONTROLLER');
    };

    static getDashboard = (req, res) => {
        // console.log("HERE");
        // console.log(req.session, 122);
        const validMessage = req.session.validMessage;
        delete req.session.validMesage

        const validName = req.session.validName;
        delete req.session.validName;


        res.render("dashboard.ejs", {
            validName,
            validMessage
        })
    };

    static getSignUp = (req, res) => {
        const signUpMsg = req.session.signUpMsg;
        delete req.session.signUpMsg
        const signUpEmail = req.session.signUpEmail
        delete req.session.signUpEmail

        res.render("signUp.ejs", {
            signUpMsg,
            signUpEmail
        })
    };

    static postSignUp = async (req, res) => {

        try {
            const formData = req.body;

            const userMatched = await userModel.findOne({
                email: formData.email
            });

            if (!userMatched) {

                const hashedPassword = await bcrypt.hash(formData.password, 12);

                const userToSave = new userModel({
                    name: formData.name,
                    email: formData.email,
                    password: hashedPassword
                });

                const savedUser = await userToSave.save();
                req.session.msgNewUser = "Welcome as a new user !!!";
                req.session.newUser = savedUser.name;
                res.redirect("/sign_in");
                // res.send(savedUser);

            } else {
                req.session.existsMessage = "USER ALREADY EXISTS";
                req.session.existsUserName = userMatched.name;

                // This session Variables will be in sign_in get method
                res.redirect("/sign_in");

                // res.send("USER ALREADY EXISTS");
            }

        } catch (error) {
            console.log(`Cannot Save Users,  ${error}`);
        }
    }

    static getSignIn = (req, res) => {

        const existingMessage = req.session.existsMessage;
        delete req.session.existsMessage;

        const existingUserName = req.session.existsUserName;
        delete req.session.existsUserName;


        // Handle New User
        const msgNew = req.session.msgNewUser;
        delete req.session.msgNewUser;

        const userNew = req.session.newUser;
        delete req.session.newUser;

        const passwordMsg = req.session.passwordMsg;
        delete req.session.passwordMsg;

        const nameWrongPassword = req.session.nameWrongPassword;
        delete req.session.nameWrongPassword;

        res.render("login.ejs", {
            existingMessage,
            existingUserName,
            msgNew,
            userNew,
            passwordMsg,
            nameWrongPassword
        })
    };

    static postSignIn = async (req, res) => {

        try {
            const formData = req.body;
            const userMatched = await userModel.findOne({
                email: formData.email
            });

            if (!userMatched) {
                req.session.signUpMsg = "Please SignUp First";
                req.session.signUpEmail = formData.email;

                res.redirect("/sign_up");

                // res.send("No User Found With That Email");
            } else {
                const passwordMatched = await bcrypt.compare(formData.password, userMatched.password);
                if (passwordMatched) {
                    req.session.validMessage = "Congratulations Valid User";
                    req.session.isValidated = true;
                    req.session.validName = userMatched.name;
                    res.redirect("/dashboard");
                    // res.send("User is Validated, Login Successful !!!")
                } else {
                    req.session.passwordMsg = "Please Enter Correct Password";
                    req.session.nameWrongPassword = userMatched.name;
                    res.redirect("/sign_in");

                    // res.send("Please enter correct Password");
                }
            }
        } catch (error) {
            console.log(`Cannot Login,  ${error}`);
        }
    }

    static logout = (req, res) => {
        req.session.destroy((err) => {
            if (err) throw err
            res.redirect("/sign_in");
        })
    }
}

export default Controller;