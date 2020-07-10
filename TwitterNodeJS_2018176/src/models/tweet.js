'use strict'

var mongoose= require('mongoose')
var Schema = mongoose.Schema;

var TweetSchema = Schema({
    publicacion: String,
    usuario: { type: Schema.ObjectId, ref: 'usuario' }

})

module.exports = mongoose.model('tweet', TweetSchema);
