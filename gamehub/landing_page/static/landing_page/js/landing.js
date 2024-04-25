document.getElementById('loginButton').addEventListener('click', () => {
  
  window.location.href = '/login'
})

const signUpButtons = document.getElementsByClassName('signUpButton'); 
for (let button of signUpButtons) {
  button.addEventListener('click', () => {
    window.location.href = '/register'
  })
}


//Carrusel

const text1_options = [
  "Disfruta de nuestra selección de juegos",
  "Conoce a otros jugadores",
  "¡Espera! ¿Aún no tienes cuenta? ¡Regístrate ya!",
  "¡Desafíos diarios y premios exclusivos!",
  "Próximamente... ¡Más juegos en línea!"
];
const text2_options = [
  "Unos pocos en realidad, pero son muy buenos",
  "¡Conéctate con otros jugadores y haz nuevos amigos!",
  "¡Es gratis y siempre lo será! ¡Únete a la comunidad!",
  "¿Buscas un reto? ¡Pronto tendremos más eventos para ti!",
  "¡Mantente al tanto de las actualizaciones!"
];
const color_options = ["#dd00ff", "#5000ca", "#6b21a8", "#ABDAFC", "#e5fcff"];
const image_options = [
  "/static/landing_page/imgs/1.png",
  "/static/landing_page/imgs/2.png",
  "/static/landing_page/imgs/3.png",
  "/static/landing_page/imgs/4.png",
  "/static/landing_page/imgs/5.png"
];
var i = 0;
const currentOptionText1 = document.getElementById("current-option-text1");
const currentOptionText2 = document.getElementById("current-option-text2");
const currentOptionImage = document.getElementById("image");
const carousel = document.getElementById("carousel-wrapper");
const mainMenu = document.getElementById("menu");
const optionPrevious = document.getElementById("previous-option");
const optionNext = document.getElementById("next-option");

currentOptionText1.innerText = text1_options[i];
currentOptionText2.innerText = text2_options[i];
currentOptionImage.style.backgroundImage = "url(" + image_options[i] + ")";
mainMenu.style.background = color_options[i];

//checks if the first color_options is dark or light to set font color
document.getElementById("current-option-text1").style.color = getContrastYIQ(color_options[0]);
document.getElementById("current-option-text2").style.color = getContrastYIQ(color_options[0]);



optionNext.onclick = function () {
  i = i + 1;
  i = i % text1_options.length;
  currentOptionText1.dataset.nextText = text1_options[i];

  currentOptionText2.dataset.nextText = text2_options[i];

  mainMenu.style.background = color_options[i];
  carousel.classList.add("anim-next");

  document.getElementById("current-option-text1").style.color = getContrastYIQ(color_options[i]);
  document.getElementById("current-option-text2").style.color = getContrastYIQ(color_options[i]);
  
  setTimeout(() => {
    currentOptionImage.style.backgroundImage = "url(" + image_options[i] + ")";
  }, 455);
  
  setTimeout(() => {
    currentOptionText1.innerText = text1_options[i];
    currentOptionText2.innerText = text2_options[i];
    carousel.classList.remove("anim-next");
  }, 650);
};

optionPrevious.onclick = function () {
  if (i === 0) {
    i = text1_options.length;
  }
  i = i - 1;
  currentOptionText1.dataset.previousText = text1_options[i];

  currentOptionText2.dataset.previousText = text2_options[i];

  mainMenu.style.background = color_options[i];
  carousel.classList.add("anim-previous");

  document.getElementById("current-option-text1").style.color = getContrastYIQ(color_options[i]);
  document.getElementById("current-option-text2").style.color = getContrastYIQ(color_options[i]);

  setTimeout(() => {
    currentOptionImage.style.backgroundImage = "url(" + image_options[i] + ")";
  }, 455);
  
  setTimeout(() => {
    currentOptionText1.innerText = text1_options[i];
    currentOptionText2.innerText = text2_options[i];
    carousel.classList.remove("anim-previous");
  }, 650);
};

//checks if color_options is dark or light to set font color
function getContrastYIQ(hexcolor) {
  hexcolor = hexcolor.replace("#", "");
  var r = parseInt(hexcolor.substr(0, 2), 16);
  var g = parseInt(hexcolor.substr(2, 2), 16);
  var b = parseInt(hexcolor.substr(4, 2), 16);
  var yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "black" : "white";
}


// Fin Carrusel