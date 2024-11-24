// Mostrar el pop-up después de 3 segundos
window.onload = function () {
    setTimeout(function () {
        document.querySelector('.overlay').style.display = 'block';
        document.querySelector('.popup').style.display = 'block';
    }, 3000);
};

  // Cerrar el pop-up al hacer clic en el botón
    document.getElementById('cerrar-popup').addEventListener('click', function () {
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.popup').style.display = 'none';
});
    