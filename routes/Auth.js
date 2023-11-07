const router = require('express').Router()
const User = require('../model/User')
const { registerValidation, loginValidation } = require('../validation')
const bycrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


router.post('/register', async (req, res) => {

    // LETS VALIDATE THE DATA BEFORE WE A USER
    // const Validation = Joi.validate(req.body,schema);
    // const {error} = schema.validate(req.body);
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)


    // Checking if the user is already in the database

    const emailExist = await User.findOne({ email: req.body.email })
    if (emailExist) return res.status(400).send('Email Already Exist')

    // Hash Passwords
    const salt = await bycrypt.genSalt(10);
    const hashPassword = await bycrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    try {
        const savedUser = await user.save()
        res.send({ user: user._id })
    }
    catch (err) {
        res.status(400).send(err)
        console.log(err);
    }
});

// LOGIN

router.post('/login', async (req, res) => {
    // LETS VALIDATE THE DATA BEFORE WE A USER
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message)

    // Checking if the email exist
    const user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Email is not found");

    // PASSWORD IS CORRECT
    const validPass = await bycrypt.compare(req.body.password, user.password)
    if (!validPass) return res.status(400).send("Invalid Password")

    // Create and assign a token
    const token =jwt.sign({_id:user._id},process.env.TOKEN_SECRET)
    res.header('auth-token',token).send(token)
    res.send("Logged In")
})

module.exports = router