const passSchema = require('../models/pass');

//verif du password    
module.exports = (req, res, next) => {

    if (!passSchema.validate(req.body.password)) {

        return res.status(400).json({ error: 'le mot de pass et trop faible ! Il doit contenir minimum 1 chiffre et une majuscule et minimum 8 caractères !' })

    }
    next();
}