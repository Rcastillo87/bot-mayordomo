const fs = require('fs');

async function xml( arrayExp, dato ) {

    var data_array_exp =    [ 'exp','dir', 'compania', 'fecha_encargo', 'obsevaciones', 'tipo_siniestro', 'poliza', 'ramo',
                            'causa_siniestro', 'version', 'fecha_ocurrencia', 'fecha_efecto', 'nif', 'nombre' ];//fecha_efecto,causa_siniestroS

    // dando forma al xml con la data entregada

    var DatosPoliza = 
    '<DatosPoliza>'+
        '<IdPoliza>'+arrayExp.poliza+'</IdPoliza>'+
        '<CodigoEntidad>'+
            '<CodigoInterno>'+arrayExp.compania+'</CodigoInterno>'+
            '<CodigoDGS>C0133</CodigoDGS>'+
        '</CodigoEntidad>'+
        '<DatosRamo>'+
            '<DescripcionRamo>' + arrayExp.ramo + '</DescripcionRamo>'+
        '</DatosRamo>'+
    '</DatosPoliza>';

    var IdSiniestroEntidad = '<IdSiniestroEntidad>'+arrayExp.exp+'</IdSiniestroEntidad>';
    var FechaDeclaracion = '<FechaDeclaracion>'+arrayExp.fecha_encargo+'</FechaDeclaracion>';
    var FechaOcurrencia = '<FechaOcurrencia>'+arrayExp.fecha_ocurrencia+'</FechaOcurrencia>';
    var PosicionSiniestro = '<PosicionSiniestro></PosicionSiniestro>';
    var SituacionesSiniestro =
        '<SituacionesSiniestro>'+
            '<Situacion>'+
                '<NumeroOrden></NumeroOrden>'+
                '<SituacionSiniestro></SituacionSiniestro>'+
                '<FechaSituacion></FechaSituacion>'+
            '</Situacion>'+
        '</SituacionesSiniestro>';
    var DescripcionSiniestro = '<DescripcionSiniestro>'+arrayExp.version+'</DescripcionSiniestro>';

    var AccionesSiniestro = 
        '<AccionesSiniestro>'+
        '<Accion>'+
            '<AccionSiniestro></AccionSiniestro>'+
            '<FechaAccion></FechaAccion>'+
            '<DescripcionAccion></DescripcionAccion>'+
        '</Accion>'+
        '</AccionesSiniestro>';

    var  LugarSiniestro =
        '<LugarSiniestro>'+
          '<NombreVia>'+ arrayExp.dir+'</NombreVia>'+
          '<CodigoPostal>'+ arrayExp.dir.split(' ').pop()+'</CodigoPostal>'+
          '<Poblacion></Poblacion>'+
          '<Provincia></Provincia>'+
        '</LugarSiniestro>';

    var RiesgosSiniestro =
      '<RiesgosSiniestro>'+
        '<RiesgoRecSin>'+
          '<DescripcionRiesgo>'+arrayExp.tipo_siniestro+'</DescripcionRiesgo>'+
          //'<Version>'+arrayExp.version+'</Version>'+
        '</RiesgoRecSin>'+
      '</RiesgosSiniestro>';

    var tomador =
        '<tomador>'+
            '<nif>'+arrayExp.nif+'</nif>'+
            '<razonSocial>'+arrayExp.nombre+'</razonSocial>'+
            '<telefono></telefono>'+
        '</tomador>';

    var riesgosPoliza = 
        '<riesgosPoliza>'+
            '<riesgo>'+
                '<direccion></direccion>'+
            '</riesgo>'+
        '</riesgosPoliza>';

    var DatosSiniestro = 
    '<DatosSiniestro>'+
        IdSiniestroEntidad+
        FechaDeclaracion+
        FechaOcurrencia+
        PosicionSiniestro+
        SituacionesSiniestro+
        DescripcionSiniestro+
        AccionesSiniestro+
        LugarSiniestro+
        RiesgosSiniestro+
        tomador+
        riesgosPoliza+
    '</DatosSiniestro>';

    var xml = 
    '<?xml version="1.0" encoding="iso8859-1"?>'+
    '<ProcesosEIAC xsi:schemaLocation="http://www.tirea.es/EIAC/ProcesosEIAC ProcesosEIAC.xsd" xmlns="http://www.tirea.es/EIAC/ProcesosEIAC" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
      '<Objetos>'+
        '<Siniestro>'+
            DatosPoliza+
            DatosSiniestro+
        '</Siniestro>'+
      '</Objetos>'+
    '</ProcesosEIAC>';

    /*console.log(xml);
    var filepath = "Expedientes/"+ arrayExp.exp + ' ' + arrayExp.compania + ".xml";
    fs.writeFile(filepath, xml, (err) => {
        if (err) throw err;
        console.log("The file was succesfully saved!");
    });*/
    return { status: 200, message: "Se ha generado el archivo con exito", data: xml  }
    //return { status: 200, message: "Se ha generado el archivo con exito", data: filepath  }
}

module.exports = { xml };
