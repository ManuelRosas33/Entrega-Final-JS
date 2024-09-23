// Array para almacenar los artistas
let artistas = [];

// Función para obtener los artistas almacenados en localStorage
function obtenerArtistas() {
     fetch('artistas.json')
          .then(response => response.json())
          .then(data => {
               artistas = data; // Asignar los datos al array de artistas
               mostrarArtistas(); // Mostrar los artistas en el DOM
          })
          .catch(error => console.error('Error al cargar los artistas:', error));
}

// Guardar artistas en localStorage
function guardarArtistas() {
     localStorage.setItem('artistas', JSON.stringify(artistas));
}

// Cargar artistas desde localStorage
function cargarArtistasDeLocalStorage() {
     const artistasGuardados = localStorage.getItem('artistas');
     if (artistasGuardados) {
          artistas = JSON.parse(artistasGuardados);
          mostrarArtistas();
     }
}

// Llama a esta función al iniciar
cargarArtistasDeLocalStorage();

// Función para crear tarjetas de artistas en el DOM
function mostrarArtistas() {
     const contenedorArtistas = document.getElementById('lista-artistas');
     contenedorArtistas.innerHTML = '';

     artistas.forEach((artista, index) => {
          const artistaCard = document.createElement('div');
          artistaCard.classList.add('artista-card');
          artistaCard.innerHTML = `
            <h3>${artista.nombre}</h3>
            <p>Género: ${artista.genero}</p>
            <p>Email: ${artista.email}</p>
            <p>Disponibilidad: ${artista.disponibilidad}</p>
            <button class="btn-contratar" data-index="${index}">Contratar</button>
        `;

          contenedorArtistas.appendChild(artistaCard);
     });

     // Agregamos el evento para contratar a cada artista
     document.querySelectorAll('.btn-contratar').forEach(boton => {
          boton.addEventListener('click', contratarArtista);
     });
}

// Función para contratar a un artista (muestra un alert y luego lo quita de la lista)
function contratarArtista(event) {
     const index = event.target.dataset.index;
     const artista = artistas[index];

     // Usamos SweetAlert para una alerta personalizada
     Swal.fire({
          title: `¿Quieres contratar a ${artista.nombre}?`,
          text: "Una vez contratado, no podrás deshacer la acción.",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Sí, contratar'
     }).then((result) => {
          if (result.isConfirmed) {
               // Eliminar al artista del array y actualizar localStorage
               artistas.splice(index, 1);
               guardarArtistas();
               mostrarArtistas();
               Swal.fire('Contratado', `Has contratado a ${artista.nombre}`, 'success');
          }
     });
}

// Agregar un nuevo artista
function agregarArtista(event) {
     event.preventDefault(); // Evitar el envío del formulario
     const nombre = document.getElementById('nombre').value;
     const genero = document.getElementById('genero').value;
     const disponibilidad = document.getElementById('disponibilidad').value;
     const email = document.getElementById('email').value; // Corregido aquí

     const nuevoArtista = { nombre, genero, disponibilidad, email };
     artistas.push(nuevoArtista);
     guardarArtistas(); // Guardar en localStorage
     mostrarArtistas(); // Mostrar en la lista
     document.getElementById('form-artista').reset(); // Reiniciar formulario

     Swal.fire('Registro exitoso', `${nombre} ha sido registrado como artista`, 'success');
}

// Agregar el evento submit al formulario
document.getElementById('form-artista').addEventListener('submit', agregarArtista);

// Cargar los artistas al iniciar la página
obtenerArtistas();