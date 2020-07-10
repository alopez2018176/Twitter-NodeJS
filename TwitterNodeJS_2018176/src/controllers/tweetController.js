'use strict'

var Usuario = require("../models/user")
var Tweet = require("../models/tweet");
const tweet = require("../models/tweet");
const user = require("../models/user");

function postearTweet(req, res) {
    var tweet = new Tweet()
    var params = req.body.command.substring(10);

    if (params.length >= 1 && req.user.sub) {
        tweet.publicacion = params
        tweet.usuario = req.user.sub

        tweet.save((err, tweetPosteado) => {
            if (err) return res.status(500).send({ message: 'Error al publicar el tweet' })
            if (tweetPosteado) {
                res.status(200).send({ Tweet: tweetPosteado })
            } else {
                res.status(404).send({ message: 'No se ha podido publicar el tweet' })
            }
        })
    }
}

function eliminarTweet(req, res) {
    var tweetId = req.body.command.split(" ")

    Tweet.findByIdAndDelete(tweetId[1], (err, tweetEliminado) => {
        if (err) return res.status(500).send({ message: 'Error en la actualizacion de tweets' })
        if (!tweetEliminado) return res.status(404).send({ message: 'No se ha podido eliminar el tweet posteado' })
        return res.status(200).send({ message: 'Tweet eliminado', Tweet: tweetEliminado })
    })
}

function editarTweetPosteado(req, res) {
    var tweetId = req.body.command.split(" ")
    var params = req.body.command.substring(35);

    Tweet.findByIdAndUpdate(tweetId[1], { publicacion: params }, { new: true }, (err, tweetActualizado) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion de actualizar tweets posteados' } + err)
        if (!tweetActualizado) return res.status(404).send({ message: 'No se ha podido actualizar el tweet posteado' })
        return res.status(200).send({ Tweet: tweetActualizado })
    })
}

function viewtweets(req, res) {
    var params = req.body.command.split(" ")

    Usuario.findOne({ usuario: params[1] }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ message: 'Error en la peticion de encontrar perfil de usuario' })
        if (!usuarioEncontrado) return res.status(404).send({ message: 'No se ha podido encontrar el usuario' })
        if (req.user.sub != usuarioEncontrado._id){
            
            Usuario.findOne({ _id: req.user.sub, 'seguidos.username': params[1] }, (err, usuarioSeguido) => {
                if (err) return res.status(500).send({ message: "Error en la peticion de visualizar tweets" })
                if (!usuarioSeguido) return res.status(404).send({ message: "Usted no puede ver los tweets de este usuario porque aun no lo sigue" })
            })
        }
            Tweet.find({ usuario: usuarioEncontrado._id }, (err, tweetPosteados) => {
                if (err) return res.status(500).send({ message: 'Error en la peticion de visualizar tweets' })
                if (!tweetPosteados) return res.status(404).send({ message: 'No se ha podido encontrar los tweets posteados por los usuarios' })
                return res.status(200).send({ Tweets: tweetPosteados })
            })
        
    })
}

module.exports = {
    postearTweet,
    eliminarTweet,
    editarTweetPosteado,
    viewtweets
}