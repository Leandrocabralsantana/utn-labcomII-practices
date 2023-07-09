console.log("Se ha cargado index.js");

const mostrarPeliculas = () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDgwMDgyYmI1Mzc2MTJmOTNlN2FmMjYwYzBkZTc1MCIsInN1YiI6IjY0YTlhNTJiZDFhODkzMDExYzMyNWNhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qSfYv81lQnLgQFmcWnKcNZUHQVpNNE5sUJ3luH4r3bE",
    },
  };

  fetch("https://api.themoviedb.org/3/movie/popular", options)
    .then((response) => response.json())
    .then((response) => {
      const peliculas = response.results;
      const contenedorPeliculas = document.getElementById("contenedorPeliculas");

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
          });
        } else {
          btnFavorites.textContent = "Agregar a Favoritos";
          btnFavorites.addEventListener("click", () => {
            const codigoPelicula = pelicula.id;
            agregarFavorito(codigoPelicula);
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
    })
    .catch((err) => console.error(err));
};

mostrarPeliculas();

agregarFavorito = (codigoPelicula) => {
  console.log("Agregar a favoritos");
  console.log(codigoPelicula);

  const codigo = parseInt(codigoPelicula);

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