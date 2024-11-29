// Mostrar el pop-up después de 3 segundos
window.onload = function () {
    setTimeout(function () {
        document.querySelector('.overlay').style.display = 'block';
        document.querySelector('.popup').style.display = 'block';
    }, 3000);

    // Cerrar el pop-up al hacer clic en el botón
    document.getElementById('cerrar-popup').addEventListener('click', function () {
        document.querySelector('.overlaypopup').style.display = 'none';
        document.querySelector('.popup').style.display = 'none';
    });
};

// Función para cambiar la imagen destacada en el carrusel
function changeImage(imageSrc) {
    const featuredImage = document.getElementById('featured-image');
    if (featuredImage) {
        featuredImage.src = imageSrc;
    }
}

// Funcionalidad de navegación del menú
document.addEventListener("DOMContentLoaded", () => {
    const menuToggle = document.querySelector(".menu-toggle");
    const navbar = document.querySelector(".navbar");
    const menuLinks = document.querySelectorAll(".navbar ul li a"); // Seleccionamos todos los enlaces del menú

    if (menuToggle && navbar) {
        menuToggle.addEventListener("click", () => {
            navbar.classList.toggle("active");
        });
    }

// Cerrar el menú cuando se haga clic en un enlace
menuLinks.forEach((link) => {
    link.addEventListener("click", () => {
        navbar.classList.remove("active"); // Cierra el menú
    });
});

    // Función para observar la visibilidad de las tarjetas
    const tarjetas = document.querySelectorAll(".tarjeta");
    if (tarjetas.length > 0) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("volteada");
                    } else {
                        entry.target.classList.remove("volteada");
                    }
                });
            },
            { threshold: 1 } // Al menos el 50% de la tarjeta debe ser visible
        );

        tarjetas.forEach((tarjeta) => observer.observe(tarjeta));
    }
// Función para observar la visibilidad de las imágenes
const images = document.querySelectorAll(".image-container");
if (images.length > 0) {
    const imageObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                const overlay = entry.target.querySelector(".overlay");
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible"); // Marca la imagen como visible
                    if (overlay) {
                        overlay.classList.add("visible-text"); // Muestra el texto
                    }
                } else {
                    entry.target.classList.remove("visible"); // Marca la imagen como no visible
                    if (overlay) {
                        overlay.classList.remove("visible-text"); // Oculta el texto
                    }
                }
            });
        },
        { threshold: 0.5 } // Al menos el 50% de la imagen debe ser visible
    );

    // Observamos todas las imágenes
    images.forEach((image) => {
        imageObserver.observe(image);

        // Forzar visibilidad para la primera tarjeta
        if (image === images[0]) {
            const overlay = image.querySelector(".overlay");
            if (overlay) {
                overlay.classList.add("visible-text");
            }
        }
    });
}


    // Función para controlar el carrusel
    const carouselContainer = document.querySelector(".carousel-container");
    const carousel = document.querySelector(".carousel-images");

    if (carousel && carouselContainer) {
        let currentIndex = 0;
        const images = Array.from(carousel.querySelectorAll("img"));
        const totalImages = images.length;

        const updateCarousel = () => {
            const imageWidth = images[0]?.clientWidth || 300; // Usa un ancho predeterminado si no se detecta
            carousel.style.transform = `translateX(-${currentIndex * imageWidth}px)`;
        };

        const moveSlide = (direction) => {
            currentIndex = (currentIndex + direction + totalImages) % totalImages;
            updateCarousel();
        };

        // Estilos iniciales del carrusel
        carousel.style.display = "flex";
        carousel.style.transition = "transform 0.5s ease-in-out";

        // Botones de navegación
        const prevButton = document.querySelector(".prev");
        const nextButton = document.querySelector(".next");

        if (prevButton && nextButton) {
            prevButton.addEventListener("click", () => moveSlide(-1));
            nextButton.addEventListener("click", () => moveSlide(1));
        } else {
            console.error("No se encontraron los botones de navegación del carrusel.");
        }

        // Ajustar el tamaño del carrusel al cargar y al cambiar el tamaño de la ventana
        window.addEventListener("resize", updateCarousel);
        updateCarousel(); // Llamada inicial
    } else {
        console.error("No se encontró el elemento del carrusel o su contenedor.");
    }
});
