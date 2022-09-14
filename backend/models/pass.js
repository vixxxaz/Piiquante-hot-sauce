//import password validator
const passwordValid = require('password-validator');

//creation du schema

var passSchema = new passwordValid();

//Propriétées du mot de passe 
passSchema
    .is().min(8) // Minimum  8 caractère
    .is().max(25) // Maximum 25 caractère
    .has().uppercase() // au moins 1 majuscule
    .has().lowercase() // au moins une minuscule
    .has().digits() // au moins un chiffre
    .has().not().spaces() // pas d'espace


module.exports = passSchema;