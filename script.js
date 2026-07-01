// 3.1 Datos: Arreglo de objetos (Criterio 2.1.3)
const experiencias = [
    { id: 1, nombre: "Capillas de Mármol", categoria: "Navegación", lugar: "Puerto Río Tranquilo", precio: 35000, cuposDisponibles: 8, descripcion: "Maravillosa navegación sobre las aguas turquesas del Lago General Carrera para explorar cavernas minerales únicas.", icono: "⛵" },
    { id: 2, nombre: "Trekking Cerro Castillo", categoria: "Trekking", lugar: "Villa Cerro Castillo", precio: 60000, cuposDisponibles: 6, descripcion: "Exigente sendero de montaña que premia con una panorámica espectacular de la laguna glaciar a los pies del imponente cerro.", icono: "🥾" },
    { id: 3, nombre: "Pesca con Mosca", categoria: "Pesca", lugar: "Río Simpson", precio: 50000, cuposDisponibles: 5, descripcion: "Jornada guiada de pesca deportiva sustentable con devolución en uno de los ríos con mayor fama mundial.", icono: "🐟" },
    { id: 4, nombre: "Patrimonio Cultural Tortel", categoria: "Cultura", lugar: "Caleta Tortel", precio: 25000, cuposDisponibles: 10, descripcion: "Recorrido por las icónicas pasarelas de madera de ciprés de las Guaitecas, respirando historia y aislamiento patagónico.", icono: "📸" },
    { id: 5, nombre: "Kayak en Fiordos", categoria: "Navegación", lugar: "Seno Ventisquero", precio: 55000, cuposDisponibles: 4, descripcion: "Exploración en kayak sorteando pequeños témpanos caídos directamente de los glaciares milenarios.", icono: "🛶" },
    { id: 6, nombre: "Laguna San Rafael", categoria: "Navegación", lugar: "Puerto Chacabuco", precio: 85000, cuposDisponibles: 12, descripcion: "Crucero de día completo contemplando los majestuosos desprendimientos de la pared del glaciar San Rafael.", icono: "🚢" }
];

// Nodos del DOM globales
const cardsGrid = document.getElementById('cards-grid');
const categoryFilters = document.getElementById('filters-container');
const experienciaSelect = document.getElementById('experiencia-select');
const bookingForm = document.getElementById('booking-form');
const successMessage = document.getElementById('success-message');

// Inicialización de la Aplicación
document.addEventListener('DOMContentLoaded', () => {
    renderExperiencias(experiencias);
    poblarSelectExperiencias();
    configurarFiltros();
    bookingForm.addEventListener('submit', validarFormulario);
});

// 3.2 Render dinámico al DOM (Criterio 2.1.1)
function renderExperiencias(lista) {
    cardsGrid.innerHTML = ''; // Limpiamos el contenedor antes de renderizar

    if(lista.length === 0) {
        cardsGrid.innerHTML = `<p class="no-results">No hay experiencias disponibles en esta categoría por ahora.</p>`;
        return;
    }

    lista.forEach(exp => {
        // Estructura de tarjeta usando createElement para mayor control
        const card = document.createElement('article');
        card.className = 'card';

        card.innerHTML = `
            <div class="card-icon">${exp.icono}</div>
            <h3>${exp.nombre}</h3>
            <p class="card-location">📍 ${exp.lugar}</p>
            <span class="card-category">${exp.categoria}</span>
            <p class="card-price">$ ${exp.precio.toLocaleString('es-CL')}</p>
            <p class="card-slots">Cupos disponibles: <strong id="cupos-${exp.id}">${exp.cuposDisponibles}</strong></p>
            <p class="card-description hidden" id="desc-${exp.id}"></p>
            <button class="toggle-desc-btn" data-id="${exp.id}">Ver más</button>
        `;

        // Inserción segura de texto para mitigar XSS en datos que puedan ser dinámicos
        card.querySelector(`#desc-${exp.id}`).textContent = exp.descripcion;
        cardsGrid.appendChild(card);
    });

     clockEventosTarjetas();
}

// Eventos de interactividad dentro de las tarjetas individuales (classList.toggle)
function clockEventosTarjetas() {
    const toggleButtons = document.querySelectorAll('.toggle-desc-btn');
    toggleButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const id = e.target.getAttribute('data-id');
            const descParagraph = document.getElementById(`desc-${id}`);
            
            // Alternar visibilidad con classList
            descParagraph.classList.toggle('hidden');
            
            if (descParagraph.classList.contains('hidden')) {
                e.target.textContent = 'Ver más';
            } else {
                e.target.textContent = 'Ver menos';
            }
        });
    });
}

// 3.3 Filtros e interacción con classList
function configurarFiltros() {
    categoryFilters.addEventListener('click', (e) => {
        if (!e.target.classList.contains('filter-btn')) return;

        // Cambiar la clase activa visualmente
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        // Filtrar la lógica de datos
        const categoriaSeleccionada = e.target.getAttribute('data-category');
        filtrarPorCategoria(categoriaSeleccionada);
    });
}

function filtrarPorCategoria(categoria) {
    if (categoria === 'Todos') {
        renderExperiencias(experiencias);
    } else {
        const filtradas = experiencias.filter(exp => exp.categoria === categoria);
        renderExperiencias(filtradas);
    }
}

// Poblado dinámico del <select> del formulario
function poblarSelectExperiencias() {
    // Mantener sólo la opción por defecto
    experienciaSelect.innerHTML = '<option value="">Selecciona una experiencia</option>';
    
    experiencias.forEach(exp => {
        const option = document.createElement('option');
        option.value = exp.id;
        option.textContent = `${exp.nombre} (${exp.lugar})`;
        experienciaSelect.appendChild(option);
    });
}

// 3.4 Formulario de reserva validado con JavaScript (Criterio 2.1.2)
function validarFormulario(event) {
    event.preventDefault(); // Evitamos envío nativo por seguridad y control

    // Captura de Inputs
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const expId = experienciaSelect.value;
    const personas = parseInt(document.getElementById('personas').value, 10);
    const fecha = document.getElementById('fecha').value;

    let formValido = true;

    // Limpiar errores previos
    limpiarErrores();

    // 1. Validación Nombre
    if (nombre === "") {
        mostrarError('nombre', "El nombre completo es obligatorio.");
        formValido = false;
    }

    // 2. Validación Email con Expresión Regular
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === "") {
        mostrarError('email', "El correo electrónico es requerido.");
        formValido = false;
    } else if (!emailRegex.test(email)) {
        mostrarError('email', "El formato de correo electrónico no es válido.");
        formValido = false;
    }

    // 3. Validación de selección de Experiencia
    if (expId === "") {
        mostrarError('experiencia', "Debes seleccionar una experiencia.");
        formValido = false;
    }

    // 4. Validación de Personas y contraste de Cupos Disponibles
    const experienciaSeleccionada = experiencias.find(exp => exp.id === parseInt(expId, 10));

    if (isNaN(personas) || personas <= 0) {
        mostrarError('personas', "Ingresa un número válido de personas.");
        formValido = false;
    } else if (experienciaSeleccionada && personas > experienciaSeleccionada.cuposDisponibles) {
        mostrarError('personas', `Lo sentimos, sólo quedan ${experienciaSeleccionada.cuposDisponibles} cupos.`);
        formValido = false;
    }

    // 5. Validación de Fecha
    if (fecha === "") {
        mostrarError('fecha', "Debes seleccionar una fecha para tu viaje.");
        formValido = false;
    }

    // Procesamiento en caso de Éxito total
    if (formValido) {
        descontarCupo(parseInt(expId, 10), personas);
        
        // Mostrar mensaje de éxito
        successMessage.classList.remove('hidden');
        bookingForm.reset(); // Resetea campos visuales

        // Ocultar mensaje de éxito tras unos segundos
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 5000);
    }
}

// Funciones Auxiliares (Criterio 2.1.4)
function mostrarError(campo, mensaje) {
    const errorSpan = document.getElementById(`error-${campo}`);
    if (errorSpan) {
        errorSpan.textContent = mensaje; // Uso seguro contra inyecciones HTML
    }
}

function limpiarErrores() {
    const errores = document.querySelectorAll('.error-msg');
    errores.forEach(err => err.textContent = '');
}

function descontarCupo(id, cantidadPersonas) {
    const exp = experiencias.find(e => e.id === id);
    if (exp) {
        exp.cuposDisponibles -= cantidadPersonas;
        
        // Re-renderizamos para reflejar el cambio en tiempo real en las tarjetas y la UI
        const filtroActivo = document.querySelector('.filter-btn.active').getAttribute('data-category');
        filtrarPorCategoria(filtroActivo);
    }
}