const express = require('express');
const router = express.Router();
const loginBOTService = require('./bot-login.service');
const bot = require('../_helpers/scraper');
const xml = require('../_helpers/generarXML');

// routes
router.get('/', function(req, res, next) {
    res.render('index', {title: 'Express'});
});
router.get('/lista_nuevos_expedientes', getList);
router.get('/descarga_expediente', getExp);

module.exports = router;

// route functions
function getExp(req, res, next) {
    var id_empresa = req.query.id;
    var pass = req.query.pass;
    var user = req.query.user;
    var exp = req.query.exp;

    loginBOTService.getEmpresa( id_empresa )
    .then(paguina => { 
        bot.XMLexp( paguina , user, pass, exp )
        .then( ( arrayExp )=> {
            xml.xml( arrayExp, paguina[0] )
            .then( (respuerta)=> {
                    return res.send(
                        respuerta
                    );
                }
            ).catch(next);
        }).catch(next);
     })
    .catch(next);
}

function getList(req, res, next) {
    //console.log(req.query.id);//query para get y body para posy
    var id_empresa = req.query.id;
    var pass = req.query.pass;
    var user = req.query.user;

    loginBOTService.getEmpresa( id_empresa )
    .then(paguina => { 
        bot.listaExp( paguina , user, pass )
        .then( (listaExp)=> {
            return res.send(
                listaExp
            );
        }).catch(next);
     }).catch(next);
}
