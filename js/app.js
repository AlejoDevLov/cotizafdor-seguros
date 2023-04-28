
// variables globales
const selectYear = document.querySelector('#year');
const formulario = document.querySelector('#cotizar-seguro');

// Constructores
function Seguro( marca, year, tipo ){
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

// prototipo mostrar cotizacion
Seguro.prototype.mostrarCotizacion = function(){
    //    1 = americano = 1.15
    //    2 = asiatico = 1.05
    //    3 = europeo = 1.35
    let cantidad;
    const base = 2000;

    switch(this.marca){

        case '1' :  cantidad = base * 1.15;
            break;

        case '2' :  cantidad = base * 1.05;
            break;

        case '3' :  cantidad = base * 1.35;
            break;

        default:
            break;
    }
    
    // calcular diferencia entre año mas reciente y el seleccionado para el seguro
    const diferencia = new Date().getFullYear() - this.year;
    // por cada año de diferencia, debe descontar el 3%
    cantidad = cantidad -(cantidad *(diferencia*0.03));

    /*
        si el seguro es basico, aumenta cantidad en un 30%
        si el seguro es completo aumenta cantidad en un 50%
    */
    if(this.tipo === 'basico'){
        cantidad *= 1.30;
    } else{
        cantidad *= 1.50;
    }

    return cantidad;
}

// constructor UI sin parametros ni cuerpo
function UI(){};

// funcion prototipo llenar las opciones de los años
UI.prototype.llenarOpciones = () => {
    const max = new Date().getFullYear();
    const min = max - 20;

    for( let i = max; i > min; i-- ){
        const year = document.createElement('option');
        year.value = i;
        year.textContent = i;
        selectYear.appendChild(year);
    }
}

// crear mensaje
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
    const div = document.createElement('div');
    if( tipo === 'error' ){
        div.classList.add('error');
    } else{
        div.classList.add('correcto');
    }
    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;
    // insertar en el html
    formulario.insertBefore(div, document.querySelector('#resultado'));
    // eliminar mensaje despues de 3s
    setTimeout( () => {
        div.remove();
    }, 3000 );
}

// prototype de mostrar resultado
UI.prototype.mostrarResultado = (total, seguro) => {
    const { marca, year, tipo } = seguro;
    let marcaTexto;

    switch(marca){
        case '1': marcaTexto = 'Americano';
            break;
        
        case '2': marcaTexto = 'Asiatico';
            break;

        case '3': marcaTexto = 'Europeo';
            break;

        default:
            break;
    }

    const div = document.createElement('div');
    div.classList.add('mt-10');
    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Marca: <span class="font-normal"> ${marcaTexto} </span></p>
        <p class="font-bold">Año: <span class="font-normal"> ${year} </span></p>
        <p class="font-bold">Cobertura: <span class="font-normal capitalize"> ${tipo} </span></p>
        <p class="font-bold">Total: <span class="font-normal"> $${total} </span></p>
    `;
    const resultadoDiv = document.querySelector('#resultado');

    // mostrar Spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';
    // eliminar spinner despues de 3s
    setTimeout( () => {
        spinner.style.display = 'none';
        resultadoDiv.appendChild(div);
    }, 3000 )
}

// instanciar UI
const ui = new UI();

document.addEventListener('DOMContentLoaded', () => {
    ui.llenarOpciones(); // llenar con los años
});


// eventListeners
eventListeners();
function eventListeners(){
    formulario.addEventListener('submit', cotizarSeguro);
}


// funciones
function cotizarSeguro(e){
    e.preventDefault();

    const marca = document.querySelector('#marca').value;
    const year = document.querySelector('#year').value;
    const cobertura = document.querySelector('input[name="tipo"]:checked').value;

    if( marca === '' || year === '' || cobertura === '' ){
        return ui.mostrarMensaje('Todos los campos son obligarotios', 'error');
    } 
    ui.mostrarMensaje('Cotizando...', 'correcto');

    // limpiar cotizaciones anteriores
    const divResultado = document.querySelector('#resultado div');
    if(divResultado) divResultado.remove();

    // instanciar seguro
    const seguro = new Seguro( marca, year, cobertura );
    
    // llamar funcion de cotizacion
    const total = seguro.mostrarCotizacion();
    ui.mostrarResultado(total, seguro);
}