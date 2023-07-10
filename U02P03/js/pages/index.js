let currentPage = 1;
const moviesPerPage = 20;
const totalPages = 1000;

setTimeout(() => {
  const spinnerModal = document.getElementById("spinner-modal");
  spinnerModal.style.opacity = 0;

  setTimeout(() => {
    spinnerModal.style.display = "none";
  }, 1000);
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
      const contenedorPeliculas = document.getElementById(
        "contenedorPeliculas"
      );

      contenedorPeliculas.innerHTML = "";

      peliculas.forEach((pelicula) => {
        const divPelicula = document.createElement("div");
        divPelicula.classList.add("contenedorPeliculas");

        const imgPelicula = document.createElement("img");
        imgPelicula.src =
          "https://image.tmdb.org/t/p/w500" + pelicula.poster_path;
        imgPelicula.alt = "Poster de la película";

        const h3Pelicula = document.createElement("h3");
        h3Pelicula.textContent = pelicula.title;

        const pCodigo = document.createElement("p");
        pCodigo.innerHTML = "<b>Código:</b> " + pelicula.id;

        const pTituloOriginal = document.createElement("p");
        pTituloOriginal.innerHTML =
          "<b>Título Original:</b> " + pelicula.original_title;

        const pIdiomaOriginal = document.createElement("p");
        pIdiomaOriginal.innerHTML =
          "<b>Idioma Original:</b> " + pelicula.original_language;

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
            btnFavorites.textContent = "Agregar a Favoritos";
          });
        } else {
          btnFavorites.textContent = "Agregar a Favoritos";
          btnFavorites.addEventListener("click", () => {
            const codigoPelicula = pelicula.id;
            agregarFavorito(codigoPelicula);
            btnFavorites.textContent = "Eliminar de Favoritos";
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

const agregarFavorito = (codigoPelicula) => {
  const codigo = parseInt(codigoPelicula);
  if (isNaN(codigo)) {
    document.getElementById("api-error-message").style.display = "block";
    return;
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

        document.getElementById("success-message").style.display = "block";
        document.getElementById("duplicate-movie-message").style.display =
          "none";
        document.getElementById("api-error-message").style.display = "none";
      } else {
        document.getElementById("success-message").style.display = "none";
        document.getElementById("duplicate-movie-message").style.display =
          "block";
        document.getElementById("api-error-message").style.display = "none";
      }
    })
    .catch((error) => {
      console.error(error);

      document.getElementById("success-message").style.display = "none";
      document.getElementById("duplicate-movie-message").style.display = "none";
      document.getElementById("api-error-message").style.display = "block";
    });
};

eliminarFavorito = (codigoPelicula) => {
  window.scrollTo({ top: 0, behavior: "smooth" });

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

  document.getElementById("success-message").style.display = "block";
  document.getElementById("success-message").textContent =
    "Película eliminada de favoritos";
  document.getElementById("duplicate-movie-message").style.display = "none";
  document.getElementById("api-error-message").style.display = "none";
};
