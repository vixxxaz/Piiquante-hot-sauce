//importe express
const express = require('express');

//importe le fichier route
const router = express.Router();

//importe la verification de token
const auth = require('../middleware/auth');

//gestion image
const multer = require('../middleware/multer-config');

//utiliser notre model
const routeCtrl = require('../controllers/sauce');

//envois les requete de creation d'objet
router.post('/', auth, multer, routeCtrl.createSauce);

//post like et dislike
router.post('/:id/like', auth, multer, routeCtrl.rateSauce);

// creer un nouvel objet a vendre
router.get('/', auth, routeCtrl.getAllSauces);

// recuperer l objet 
router.get('/:id', auth, routeCtrl.getOneSauce);

// ajout d'une route pour modifier
router.put('/:id', auth, multer, routeCtrl.modifySauce);

// supprimer un produit
router.delete('/:id', auth, multer, routeCtrl.deleteSauce);

module.exports = router;