const mostrarPeliculasFavoritas = () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDgwMDgyYmI1Mzc2MTJmOTNlN2FmMjYwYzBkZTc1MCIsInN1YiI6IjY0YTlhNTJiZDFhODkzMDExYzMyNWNhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qSfYv81lQnLgQFmcWnKcNZUHQVpNNE5sUJ3luH4r3bE",
      },
    };
  
    fetch(
      "https://api.themoviedb.org/3/account/20122146/favorite/movies?language=en-US&page=1&sort_by=created_at.asc",
      options
    )
      .then((response) => response.json())
      .then((response) => {
        const peliculas = response.results;
        const contenedorPeliculas = document.getElementById("contenedorPeliculasFavoritas");
        const noFavoritesContainer = document.getElementById("no-favorites");
  
        const storedFavorites = localStorage.getItem("favoritos");
        let favoritos = [];
  
        if (storedFavorites) {
          favoritos = JSON.parse(storedFavorites);
        }
  
        const peliculasFavoritas = peliculas.filter((pelicula) => favoritos.includes(pelicula.id));
  
        if (peliculasFavoritas.length === 0) {
          noFavoritesContainer.style.display = "flex";
          contenedorPeliculas.style.display = "none";
        } else {
          noFavoritesContainer.style.display = "none";
          contenedorPeliculas.style.display = "grid";
          contenedorPeliculas.innerHTML = ""; // Limpiar el contenedor de películas antes de mostrar las nuevas
  
          peliculasFavoritas.forEach((pelicula) => {
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

            const pResumen = document.createElement("p");
            pResumen.innerHTML = "<b>Resumen:</b> " + pelicula.overview;
  
            const btnFavorites = document.createElement("button");
  
            if (favoritos.includes(pelicula.id)) {
              btnFavorites.textContent = "Eliminar de Favoritos";
              btnFavorites.addEventListener("click", () => {
                eliminarFavorito(pelicula.id);
              });
            } else {
              btnFavorites.textContent = "Agregar a Favoritos";
              btnFavorites.addEventListener("click", () => {
                agregarFavorito(pelicula.id);
              });
            }
  
            divPelicula.appendChild(imgPelicula);
            divPelicula.appendChild(h3Pelicula);
            divPelicula.appendChild(pCodigo);
            divPelicula.appendChild(pTituloOriginal);
            divPelicula.appendChild(pIdiomaOriginal);
            divPelicula.appendChild(pFechaEstreno);
            divPelicula.appendChild(pResumen);
            divPelicula.appendChild(btnFavorites);
  
            contenedorPeliculas.appendChild(divPelicula);
          });
        }
      })
      .catch((err) => console.error(err));
  };
  
  mostrarPeliculasFavoritas();
  
  const agregarFavorito = (codigoPelicula) => {
    console.log("Codigo de la pelicula", codigoPelicula);
    const storedFavorites = localStorage.getItem("favoritos");
    let favoritos = [];
  
    if (storedFavorites) {
      favoritos = JSON.parse(storedFavorites);
    }
  
    if (favoritos.includes(codigoPelicula)) {
      const duplicateMovieMessage = document.getElementById("duplicate-movie-message");
      duplicateMovieMessage.style.display = "block";
    } else {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDgwMDgyYmI1Mzc2MTJmOTNlN2FmMjYwYzBkZTc1MCIsInN1YiI6IjY0YTlhNTJiZDFhODkzMDExYzMyNWNhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qSfYv81lQnLgQFmcWnKcNZUHQVpNNE5sUJ3luH4r3bE",
        },
        body: JSON.stringify({ media_type: "movie", media_id: codigoPelicula, favorite: true }),
      };
  
      fetch("https://api.themoviedb.org/3/account/{20122146}/favorite", options)
        .then((response) => {
          if (response.ok) {
            if (response.status === 201 || response.status === 202) {
              const successMessage = document.getElementById("success-message");
              successMessage.style.display = "block";
            }
          } else if (response.status === 404 && response.status === 409) {
            const apiErrorMessage = document.getElementById("api-error-message");
            apiErrorMessage.style.display = "block";
          } else {
            console.log("Error al agregar la película a favoritos. Código de estado:", response.status);
          }
          return response.json();
        })
        .then((data) => {
          console.log("Datos de lapelícula agregada:", data);
          favoritos.push(codigoPelicula);
          localStorage.setItem("favoritos", JSON.stringify(favoritos));
          mostrarPeliculasFavoritas(); // Actualizar la lista de películas favoritas en la interfaz
        })
        .catch((error) => {
          console.error("Error al agregar la película a favoritos:", error);
        });
    }
  };
  
  const eliminarFavorito = (codigoPelicula) => {
    console.log("Código de la película a eliminar:", codigoPelicula);
    const storedFavorites = localStorage.getItem("favoritos");
    let favoritos = [];
  
    if (storedFavorites) {
      favoritos = JSON.parse(storedFavorites);
    }
  
    const index = favoritos.indexOf(codigoPelicula);
    if (index > -1) {
      favoritos.splice(index, 1); // Eliminar el elemento del array
      localStorage.setItem("favoritos", JSON.stringify(favoritos)); // Actualizar el valor en localStorage
      mostrarPeliculasFavoritas(); // Actualizar la lista de películas favoritas en la interfaz
    }
  };