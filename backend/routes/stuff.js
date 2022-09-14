//importe express
const express = require('express');

//importe le fichier route
const router = express.Router();


//importe la verification de token
const auth = require('../middleware/auth');

//gestion image
const multer = require('../middleware/multer-config');

//utiliser notre model
const stuffCtrl = require('../controllers/stuff');

//envois les requete de creation d'objet
router.post('/', auth, multer, stuffCtrl.createSauce);

//post like et dislike
router.post('/:id/like', auth, multer, stuffCtrl.rateSauce);

// creer un nouvel objet a vendre
router.get('/', auth, stuffCtrl.getAllSauces);

// recuperer l objet 
router.get('/:id', auth, stuffCtrl.getOneSauce);

// ajout d'une route pour modifier
router.put('/:id', auth, multer, stuffCtrl.modifySauce);

// supprimer un produit
router.delete('/:id', auth, multer, stuffCtrl.deleteSauce);

module.exports = router;