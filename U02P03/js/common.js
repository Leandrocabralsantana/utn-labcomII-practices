console.log("Se ha cargado common.js exitosamente");

const autentificar = () => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZDgwMDgyYmI1Mzc2MTJmOTNlN2FmMjYwYzBkZTc1MCIsInN1YiI6IjY0YTlhNTJiZDFhODkzMDExYzMyNWNhYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qSfYv81lQnLgQFmcWnKcNZUHQVpNNE5sUJ3luH4r3bE",
    },
  };

  fetch("https://api.themoviedb.org/3/authentication", options)
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((err) => console.error(err));
};


autentificar();


const obtenerFavoritos = () => {
  const favoritosJSON = localStorage.getItem("FAVORITOS");
  return favoritosJSON ? JSON.parse(favoritosJSON) : [];
};

const isDuplicate = (codigoPelicula, favoritos) => {
  return favoritos.includes(codigoPelicula);
};

const almacenarFavoritos = (favoritos) => {
  localStorage.setItem("FAVORITOS", JSON.stringify(favoritos));
};

const isNumeric = (value) => {
  return /^\d+$/.test(value);}

const agregarPeliculaFavorita = (codigoPelicula) => {
  const favoritos = obtenerFavoritos();

  if (!isDuplicate(codigoPelicula, favoritos)) {
    favoritos.push(codigoPelicula);
    almacenarFavoritos(favoritos);
    console.log("Película agregada a favoritos:", codigoPelicula);
  } else {
    console.error("La película ya ha sido ingresada");
  }
};
