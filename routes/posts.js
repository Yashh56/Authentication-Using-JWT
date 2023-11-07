const router = require('express').Router()
const verify = require('./verifyToken')

router.get('/',verify,(req, res) => {
    res.json({
        posts:{
            title: "My First Post",
            description: "Random data you should not access"
        }
    })
})

module.exports = router