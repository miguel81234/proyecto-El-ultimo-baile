const API_KEY = "2dab6da841ca7abbd5ab6db496e1088a";
const URL = "https://api.themoviedb.org/3";

const resultados = document.getElementById("resultados");

function mostrarSeries(series){

resultados.innerHTML="";

series.forEach(serie => {

const imagen = serie.poster_path
? "https://image.tmdb.org/t/p/w500"+serie.poster_path
: "";

const card = document.createElement("div");
card.classList.add("card");

card.innerHTML = `
<img src="${imagen}">
<h3>${serie.name}</h3>
<p>${serie.overview ? serie.overview.substring(0,100)+"..." : ""}</p>
`;

resultados.appendChild(card);

});

}