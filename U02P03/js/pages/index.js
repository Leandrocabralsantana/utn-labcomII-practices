
let currentPage = 1;
const moviesPerPage = 20;
const totalPages = 1000;

setTimeout(() => {
  const spinnerModal = document.getElementById("spinner-modal");
  spinnerModal.style.opacity = 0;

  setTimeout(() => {
    spinnerModal.style.display = "none";
  }, 1000); // Damos un tiempo adicional para que la transición se complete
}, 500);

const mostrarPeliculas = () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDgwMDgyYmI1Mzc2MTJmOTNlN2FmMjYwYzBkZTc1MCIsInN1YiI6IjY0YTlhNTJiZDFhODkzMDExYzMyNWNhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qSfYv81lQnLgQFmcWnKcNZUHQVpNNE5sUJ3luH4r3bE",
    },
  };

  const offset = (currentPage - 1) * moviesPerPage;
  const url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${currentPage}&region=US`;

  fetch(url, options)
    .then((response) => response.json())
    .then((response) => {
      const peliculas = response.results;
      const contenedorPeliculas = document.getElementById("contenedorPeliculas");

      contenedorPeliculas.innerHTML = ""; // Limpiar el contenedor de películas

      peliculas.forEach((pelicula) => {
        const divPelicula = document.createElement("div");
        divPelicula.classList.add("contenedorPeliculas");

        const imgPelicula = document.createElement("img");
        imgPelicula.src = "https://image.tmdb.org/t/p/w500" + pelicula.poster_path;
        imgPelicula.alt = "Poster de la película";

        const h3Pelicula = document.createElement("h3");
        h3Pelicula.textContent = pelicula.title;

        const pCodigo = document.createElement("p");
        pCodigo.innerHTML = "<b>Código:</b> " + pelicula.id;

        const pTituloOriginal = document.createElement("p");
        pTituloOriginal.innerHTML = "<b>Título Original:</b> " + pelicula.original_title;

        const pIdiomaOriginal = document.createElement("p");
        pIdiomaOriginal.innerHTML = "<b>Idioma Original:</b> " + pelicula.original_language;

        const pFechaEstreno = document.createElement("p");
        pFechaEstreno.innerHTML = "<b>Año:</b> " + pelicula.release_date;

        const btnFavorites = document.createElement("button");
        const storedFavorites = localStorage.getItem("favoritos");
        let favoritos = [];

        if (storedFavorites) {
          favoritos = JSON.parse(storedFavorites);
        }

        if (favoritos.includes(pelicula.id)) {
          btnFavorites.textContent = "Eliminar de Favoritos";
          btnFavorites.addEventListener("click", () => {
            const codigoPelicula = pelicula.id;
            eliminarFavorito(codigoPelicula);
            btnFavorites.textContent = "Agregar a Favoritos"; // Cambiar el texto del botón
          });
        } else {
          btnFavorites.textContent = "Agregar a Favoritos";
          btnFavorites.addEventListener("click", () => {
            const codigoPelicula = pelicula.id;
            agregarFavorito(codigoPelicula);
            btnFavorites.textContent = "Eliminar de Favoritos"; // Cambiar el texto del botón
          });
        }

        divPelicula.appendChild(imgPelicula);
        divPelicula.appendChild(h3Pelicula);
        divPelicula.appendChild(pCodigo);
        divPelicula.appendChild(pTituloOriginal);
        divPelicula.appendChild(pIdiomaOriginal);
        divPelicula.appendChild(pFechaEstreno);
        divPelicula.appendChild(btnFavorites);

        contenedorPeliculas.appendChild(divPelicula);
      });

      // Actualizar la visibilidad de los botones de paginación
      const btnAnterior = document.getElementById("btn-anterior");
      const btnSiguiente = document.getElementById("btn-siguiente");

      if (currentPage === 1) {
        btnAnterior.style.display = "none";
      } else {
        btnAnterior.style.display = "block";
      }

      if (currentPage === totalPages) {
        btnSiguiente.style.display = "none";
      } else {
        btnSiguiente.style.display = "block";
      }
    })
    .catch((err) => console.error(err));
};

const irPaginaAnterior = () => {
  if (currentPage > 1) {
    currentPage--;
    mostrarPeliculas();
  }
};

const irPaginaSiguiente = () => {
  if (currentPage < totalPages) {
    currentPage++;
    mostrarPeliculas();
  }
};

mostrarPeliculas();

mostrarPeliculas();

const agregarFavorito = (codigoPelicula) => {
  const codigo = parseInt(codigoPelicula);
  if (isNaN(codigo)) {
    const errorMessage = document.getElementById("api-error-message");
    errorMessage.style.display = "block";
    errorMessage.textContent = "El código sólo puede estar compuesto por números, refresque e ingrese un código correcto";
    errorMessage.style.textAlign = "center";



    return; // Detener la ejecución si no es un número
  }
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDgwMDgyYmI1Mzc2MTJmOTNlN2FmMjYwYzBkZTc1MCIsInN1YiI6IjY0YTlhNTJiZDFhODkzMDExYzMyNWNhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qSfYv81lQnLgQFmcWnKcNZUHQVpNNE5sUJ3luH4r3bE",
    },
  };

  fetch(`https://api.themoviedb.org/3/movie/${codigo}`, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Película no encontrada");
      }
      return response.json();
    })
    .then((data) => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      let favoritos = localStorage.getItem("favoritos");
      if (favoritos) {
        favoritos = JSON.parse(favoritos);
      } else {
        favoritos = [];
      }

      if (!favoritos.includes(codigo)) {
        favoritos.push(codigo);
        localStorage.setItem("favoritos", JSON.stringify(favoritos));

        // Mostrar el mensaje de éxito
        document.getElementById("success-message").style.display = "block";
        document.getElementById("duplicate-movie-message").style.display = "none";
        document.getElementById("api-error-message").style.display = "none";
      } else {
        // Mostrar el mensaje de película duplicada
        document.getElementById("success-message").style.display = "none";
        document.getElementById("duplicate-movie-message").style.display = "block";
        document.getElementById("api-error-message").style.display = "none";
      }
    })
    .catch((error) => {
      console.error(error);

      // Mostrar el mensaje de error de la API
      document.getElementById("success-message").style.display = "none";
      document.getElementById("duplicate-movie-message").style.display = "none";
      document.getElementById("api-error-message").style.display = "block";
    });
};

eliminarFavorito = (codigoPelicula) => {
  window.scrollTo({ top: 0, behavior: "smooth" });
  console.log("Eliminar de favoritos");
  console.log(codigoPelicula);

  const codigo = parseInt(codigoPelicula);

  let favoritos = localStorage.getItem("favoritos");
  if (favoritos) {
    favoritos = JSON.parse(favoritos);
  }

  const index = favoritos.indexOf(codigo);
  if (index > -1) {
    favoritos.splice(index, 1);
  }

  localStorage.setItem("favoritos", JSON.stringify(favoritos));

  // Mostrar el mensaje de éxito
  document.getElementById("success-message").style.display = "block";
  document.getElementById("success-message").textContent = "Película eliminada de favoritos";
  document.getElementById("duplicate-movie-message").style.display = "none";
  document.getElementById("api-error-message").style.display = "none";
};