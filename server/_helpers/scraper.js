
const { chromium } = require('playwright');

// loguea y lista nuevos espedientes
async function listaExp( dato, user, pass ){
    return (  async () => {

        // funcion tiempos de espera
        const sleep = time => new Promise(resolve => {
            setTimeout(resolve, time);
        });

        // inicio navegador
        //const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: false } );    //abre el navegador con las propiedades descritas 
        const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: true } );    //abre el navegador con las propiedades descritas 
        const context = await browser.newContext(); // usa el modo incognito
        const page = await context.newPage();   //abre una nueva paguina del navegado
        // logueo completo
        try {
            await page.goto(dato.ruta_loguin);  //voy a la ruta indicada
            if( dato.boton_acepto_cookies ){  // si la paguna tiene un modal de uso de cookies
                await page.click('text='+ dato.boton_acepto_cookies ); // doy clic en el boton con las propiedades indicadas
                await sleep(1000);  //demora de 3000ms
            } 
            await page.fill('input[id="' + dato.id_user + '"]', user); // busco los campos indicados y los lleno con la informacion suministrada
            await page.fill('input[id="' + dato.id_pass + '"]', pass); // busco los campos indicados y los lleno con la informacion suministrada
            await page.click('text='+ dato.boton_login );    // doy clic en el boton con las propiedades indicadas
        } catch (error) {
            await browser.close();      //cierro navegador
            //if (error instanceof playwright.errors.TimeoutError) {
                console.log( " Error: Tiempo de ejecución, algun parametro no ha sido encontrado");
                return { status: 400, message: "Error: Tiempo de ejecución, algun parametro no ha sido encontrado", data: []}
            //}
        }
        await sleep(2000);  //demora de 3000ms
        let url = await page.url();
        if( url != dato.link_exps){
            await browser.close();      //cierro navegador
            return { status: 400, message: "Error: Ha ocurrido un error en el login revise el Usuario y el Password", data: [] }
        }

        // mapeo la lista de expedientes nuevos
        let mapeo = dato.mapeo_lista;
        let array_mapeo = mapeo.split('||');
        let wait = array_mapeo[0];
        let map = array_mapeo[1];
        try{
            await page.waitForSelector(wait);
            const lista = await page.$$eval(map, (spans) =>
                spans.map((span) => span.textContent)
            );
            console.log(lista);
            if( lista.length == 0 ){
                await browser.close();      //cierro navegador
                return { status: 200,  message: "No hay expedientes nuevos", data: [] }
            }
            await browser.close();      //cierro navegador
            return { status: 200, message: "La consulta ha sido exitosa", data: lista  }
        }catch (error) {
            await browser.close();      //cierro navegador
            //if (error instanceof playwright.errors.TimeoutError) {
                console.log( " Error: ocurrio un error al intentar mapear la lista de expedientes");
                return { status: 400, message: "Error: ocurrio un error al intentar mapear la lista de expedientes", data: []  }
            //}
        }
    })();
}

//loguea y mapea data de un expediente para formar una XML
async function XMLexp( dato, user, pass, exp ){
    return (  async () => {

        // funcion tiempos de espera
        const sleep = time => new Promise(resolve => {
            setTimeout(resolve, time);
        });

        // inicia navegador
        const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: true } );    //abre el navegador con las propiedades descritas 
        //const browser = await chromium.launch( { ignoreHTTPSErrors: true, headless: false } );    //abre el navegador con las propiedades descritas 
        const context = await browser.newContext(); // usa el modo incognito
        const page = await context.newPage();   //abre una nueva paguina del navegado

        //loguin completo
        try {
            await page.goto(dato.ruta_loguin);  //voy a la ruta indicada
            if( dato.boton_acepto_cookies ){  // si la paguna tiene un modal de uso de cookies
                await page.click('text='+ dato.boton_acepto_cookies ); // doy clic en el boton con las propiedades indicadas
                await sleep(1000);  //demora de 3000ms
            }
            await page.fill('input[id="' + dato.id_user + '"]', user); // busco los campos indicados y los lleno con la informacion suministrada
            await page.fill('input[id="' + dato.id_pass + '"]', pass); // busco los campos indicados y los lleno con la informacion suministrada
            await page.click('text='+ dato.boton_login );    // doy clic en el boton con las propiedades indicadas
        } catch (error) {
            await browser.close();      //cierro navegador
            //if (error instanceof playwright.errors.TimeoutError) {
                console.log( " Error: Tiempo de ejecución, algun parametro no ha sido encontrado");
                return { status: 400, message: "Error: Tiempo de ejecución, algun parametro no ha sido encontrado",data: []  }
            //}
        }
        await sleep(3000);  //demora de 3000ms
        let url = await page.url();
        if( url != dato.link_exps){
            await browser.close();      //cierro navegador
            return { status: 400, message: "Error: Ha ocurrido un error en el login revise el Usuario y el Password", data: []  }
        }

        //clic en el expedinete a consultar
        try {
            await page.click('text='+ exp );
        } catch (error) {
            await browser.close();      //cierro navegador
            //if (error instanceof playwright.errors.TimeoutError) {
                console.log( " Error : No se pudo mapear el expediente");
                return { status: 400, message: "No se pudo mapear el expediente", data: []  }
            //}
        }

        //mapeo de la data del expediente
        var mapeo = dato.mapeo_exp;
        var excepcion = dato.data_excluida;
        var array_mapeo = mapeo.split('||');        
        var array_excepcion = excepcion.split('||');
        var hash = {};
        var salto = 0;
        var get = "";
        try {
            for ( var  arraydoble of array_mapeo ) {
                var array = arraydoble.split('::');
                var data = array[0].replaceAll("\\n\\r", "").trim();
                var link = array[1];
                var cadena = 'boton';
    
                if( data.includes(cadena) ){
                    await page.click(link);
                }else{
                    salto = 1
                    array_excepcion.forEach(element => {
                        if( element.includes(data) ){ salto = 0;}
                    });

                    if( salto == 1 ){
                        get = await page.innerText(link);
                        hash[data] =  get;
                    }else{
                        get = "";
                        hash[data] = "";
                    }
                }
                await sleep(500);
                console.log(data + "   " + get);
            }
            console.log(hash);
            await browser.close();      //cierro navegador
            return hash;
            //return { status: 200, message: "La consulta ha sido exitosa", data: hash  }
        } catch (error) {
            await browser.close();      //cierro navegador
            //if (error instanceof playwright.errors.TimeoutError) {
                console.log( " Error : No se pudo mapear el expediente");
                return { status: 400, message: "No se pudo mapear el expediente", data: []  }
            //}
        }
    })();
}

module.exports = { listaExp, XMLexp };

