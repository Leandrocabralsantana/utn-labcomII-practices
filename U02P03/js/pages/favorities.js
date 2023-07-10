setTimeout(() => {
  const spinnerModal = document.getElementById("spinner-modal");
  spinnerModal.style.opacity = 0;

  setTimeout(() => {
    spinnerModal.style.display = "none";
  }, 1000); // Damos un tiempo adicional para que la transición se complete
}, 1500);


const eliminarFavorito = async (codigoPelicula) => {
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

  // Eliminar el div de la película correspondiente
  const divPelicula = document.getElementById(`pelicula-${codigo}`);
  if (divPelicula) {
    divPelicula.classList.add("fade-out");
    setTimeout(() => {
      divPelicula.remove();
    }, 300); // Esperar 0.3 segundos antes de eliminar el elemento
  }

  // Mostrar el mensaje de éxito
  document.getElementById("success-message").style.display = "block";
  document.getElementById("success-message").textContent =
    "Película eliminada de favoritos";
  document.getElementById("duplicate-movie-message").style.display = "none";
  document.getElementById("api-error-message").style.display = "none";
};

const mostrarPeliculasFavoritas = async () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDgwMDgyYmI1Mzc2MTJmOTNlN2FmMjYwYzBkZTc1MCIsInN1YiI6IjY0YTlhNTJiZDFhODkzMDExYzMyNWNhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qSfYv81lQnLgQFmcWnKcNZUHQVpNNE5sUJ3luH4r3bE",
    },
  };

  const storedFavorites = localStorage.getItem("favoritos");
  if (storedFavorites) {
    const favoritos = JSON.parse(storedFavorites);
    const contenedorPeliculas = document.getElementById("contenedorPeliculas");

    contenedorPeliculas.innerHTML = ""; // Limpiar el contenedor de películas

    for (const codigoPelicula of favoritos) {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${codigoPelicula}?language=es`,
          options
        );
        if (!response.ok) {
          throw new Error("Película no encontrada");
        }
        const pelicula = await response.json();

        const divPelicula = document.createElement("div");
        divPelicula.id = `pelicula-${pelicula.id}`;
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

        const pResumen = document.createElement("p");
        pResumen.innerHTML = "<b>Resumen:</b> " + pelicula.overview;

        const btnFavorites = document.createElement("button");

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

        const divVideo = document.createElement("div");
        divVideo.classList.add("video-container");
        divPelicula.appendChild(imgPelicula);
        divPelicula.appendChild(h3Pelicula);
        divPelicula.appendChild(pCodigo);
        divPelicula.appendChild(pTituloOriginal);
        divPelicula.appendChild(pIdiomaOriginal);
        divPelicula.appendChild(pFechaEstreno);
        divPelicula.appendChild(pResumen);
        divPelicula.appendChild(divVideo);
        divPelicula.appendChild(btnFavorites);

        contenedorPeliculas.appendChild(divPelicula);

        contenedorPeliculas.appendChild(divPelicula);

        const responseVideo = await fetch(
          `https://api.themoviedb.org/3/movie/${codigoPelicula}/videos`,
          options
        );
        if (responseVideo.ok) {
          const videoData = await responseVideo.json();
          if (videoData.results.length > 0) {
            const videoKey = videoData.results[0].key;
            const videoUrl = `https://www.youtube.com/embed/${videoKey}`;

            const iframeVideo = document.createElement("iframe");
            iframeVideo.src = videoUrl;
            iframeVideo.title = "Trailer de la película";
            iframeVideo.allowFullscreen = true;

            divVideo.appendChild(iframeVideo);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
};

const mostrarNoFavoritesMessage = () => {
  const storedFavorites = localStorage.getItem("favoritos");
  const noFavoritesMessage = document.getElementById("no-favorites");
  if (!storedFavorites || JSON.parse(storedFavorites).length === 0) {
    noFavoritesMessage.style.display = "block";
  } else {
    noFavoritesMessage.style.display = "none";
  }
};
mostrarNoFavoritesMessage();
mostrarPeliculasFavoritas();
