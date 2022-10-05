//importe le module filesystem
const fs = require('fs');

const mongoose = require('mongoose')

const jwt = require('jsonwebtoken');

//importe le model d'objet
const Sauce = require('../models/Sauce');

// recuperer tte les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//recuperer une sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};

//creer nouvelle sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;

    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
        .then(() => { res.status(201).json({ message: 'sauce enregistré !' }) })
        .catch(error => { res.status(400).json({ error }) })
};

//modifier une sauce
exports.modifySauce = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;


    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId !== userId) {

                res.status(401).json({ message: 'Impossible de modifié cette sauce !' });

            } else {

                const sauceObject = req.file ? {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,

                } : {...req.body };

                Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée' }))
                    .catch(error => res.status(400).json({ error }));

            }
        })
        .catch(error => res.status(500).json({ error }));
};


//supprimer une sauce
exports.deleteSauce = (req, res, next) => {

    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;

    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            if (sauce.userId !== userId) {
                const filename = Sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {

                    Sauce.deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: 'Sauce supprimée' }))
                        .catch(error => res.status(400).json({ error }));
                });

            } else {
                res.status(401).json({ message: 'Impossible de supprimé cette sauce !' })
            }
        })
        .catch(error => res.status(500).json({ error }));
};


// Middleware pour like ou dislike une sauce
exports.rateSauce = (req, res, next) => {

    let like = req.body.like
    let userId = req.body.userId
    let sauceId = req.params.id

    // Si j'aime une sauce 
    if (like === 1) {
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                if (!sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne(
                            //trouve l id de la sauce
                            { _id: sauceId }, {
                                // on ajoute un like
                                $inc: { likes: 1 },
                                // on lie a l id de l user
                                $push: { usersLiked: userId }
                            }
                        )
                        // message de confirmation
                        .then(() => res.status(201).json({ message: 'J\'aime' }))
                        // Sinon on retourne une erreur 400
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    };

    // si on n aime pas la sauce
    if (like === -1) {
        //recupere l'id de la sauce
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                if (!sauce.usersDisliked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId }, {
                            //ajout du dislike
                            $inc: { dislikes: 1 },
                            $push: { usersDisliked: userId }
                        })
                        //envois un message
                        .then(() => res.status(201).json({ message: 'Je n\'aime pas' }))
                        .catch((error) => res.status(400).json({ error }));
                }
            })
            .catch((error) => res.status(400).json({ error }));
    };

    // remettre a zero
    if (like === 0) {
        // On recupere l'id de la sauce
        Sauce.findOne({ _id: sauceId })
            .then((sauce) => {
                // Si on a deja liker
                if (sauce.usersLiked.includes(userId)) {
                    Sauce.updateOne({ _id: sauceId }, {
                            //on retire le like
                            $inc: { likes: -1 },
                            // On lie avec l'utilisateur
                            $pull: { usersLiked: userId }
                        })
                        //on envois un message
                        .then(() => res.status(201).json({ message: 'Annulation' }))
                        // Sinon on retourne une erreur 400
                        .catch((error) => res.status(400).json({ error }));
                }

                // si la sauce est deja disliké
                if (sauce.usersDisliked.includes(userId)) {
                    //on met à jour lié avec l'utilisateur
                    Sauce.updateOne({ _id: sauceId }, {
                            //on retire le dislike
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: userId }
                        })
                        //on envois un message
                        .then(() => res.status(201).json({ message: 'Annulation' }))
                        .catch((error) => res.status(400).json({ error }));
                };
            })
            .catch((error) => res.status(400).json({ error }));
    };
};