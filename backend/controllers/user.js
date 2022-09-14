//importer le package de decryptage
const bcrypt = require('bcrypt');

//importer le model user
const User = require('../models/User')

//importer le gestionnaire de token
const jwt = require('jsonwebtoken');

//creer des nouveau utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10) //crypt le mot de pass
        .then(hash => {
            const user = new User({
                email: req.body.email, //prend le mot de passe crypteer et crée un nouvel user avec le mail et le passe crypter
                password: hash
            });
            user.save() //enregistre utilisateur dans la base de données
                .then(() => res.status(201).json({ message: 'utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};

//creer le login
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id },
                            'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};