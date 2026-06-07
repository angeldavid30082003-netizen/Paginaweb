document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. CONTROL DE TEMA (OSCURO / CLARO) CON PERSISTENCIA
    // ==========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Verificar si el usuario ya tenía una preferencia guardada, si no, usar 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        // Aplicar el nuevo tema al HTML
        document.documentElement.setAttribute('data-theme', newTheme);
        // Guardar la elección para la próxima visita
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.setAttribute('name', 'moon-outline');
        } else {
            themeIcon.setAttribute('name', 'sunny-outline');
        }
    }

    // ==========================================================================
    // 2. MENÚ MÓVIL INTERACTIVO
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            // Cambiar el icono de menú a cerrar según el estado
            const icon = mobileToggle.querySelector('ion-icon');
            if (navMenu.classList.contains('active')) {
                icon.setAttribute('name', 'close-outline');
            } else {
                icon.setAttribute('name', 'menu-outline');
            }
        });

        // Cerrar el menú automáticamente al hacer clic en cualquier enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('ion-icon').setAttribute('name', 'menu-outline');
            });
        });
    }

    // ==========================================================================
    // 3. ANIMACIÓN DE LAS BARRAS DE HABILIDADES (SKILLS)
    // ==========================================================================
    const skillProgressBars = document.querySelectorAll('.skill-progress');

    // Usamos un IntersectionObserver para que se animen solo cuando el usuario baje hasta ellas
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.getAttribute('data-width');
                bar.style.width = width;
                skillsObserver.unobserve(bar); // Dejar de observar una vez animada
            }
        });
    }, { threshold: 0.5 });

    skillProgressBars.forEach(bar => skillsObserver.observe(bar));

    // ==========================================================================
    // 4. ENVÍO DEL FORMULARIO A WHATSAPP Y CORREO ELECTRÓNICO
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); // Evitar que la página se recargue

        // Capturar los valores de los inputs
        const name = document.getElementById('contact-name').value.trim();
        const email = document.getElementById('contact-email').value.trim();
        const subject = document.getElementById('contact-subject').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        // Validación básica interna
        if (!name || !email || !subject || !message) {
            showFeedback('Por favor, rellena todos los campos antes de enviar.', 'error');
            return;
        }

        // --- EFECTO INTERACTIVO DE CARGA (CRYSTAL LOADER) ---
        btnText.style.display = 'none';
        btnLoader.style.display = 'block';
        submitBtn.disabled = true;

        setTimeout(() => {
            // 1. PREPARAR ENVÍO A WHATSAPP
            // Formateamos el texto usando la sintaxis de negritas de WhatsApp (*)
            const whatsappMessage = `*¡Hola Ángel! Un usuario te ha contactado desde tu Portafolio Web* 🚀\n\n` +
                `👤 *Nombre:* ${name}\n` +
                `📧 *Email:* ${email}\n` +
                `📌 *Asunto:* ${subject}\n\n` +
                `💬 *Mensaje:*\n${message}`;

            const phoneNumber = "573202501045"; // Tu número telefónico configurado en el HTML
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(whatsappMessage)}`;

            // 2. PREPARAR ENVÍO A CORREO (VÍA CORREO NATIVO O REDIRECT)
            // Esto abrirá su gestor de correo predeterminado (Outlook, Gmail, etc.) listo para enviar
            const mailtoUrl = `mailto:angeldavid9@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("De: " + name + " <" + email + ">\n\n" + message)}`;

            // --- EJECUCIÓN DE LOS ENVÍOS ---
            // Abrimos WhatsApp en una pestaña nueva para no cerrar tu portafolio
            window.open(whatsappUrl, '_blank');

            // Abrimos el correo en la misma ventana o app secundaria
            window.location.href = mailtoUrl;

            // Restablecer el botón de carga del cristal
            btnText.style.display = 'flex';
            btnLoader.style.display = 'none';
            submitBtn.disabled = false;

            // Mostrar mensaje de éxito en pantalla
            showFeedback('¡Canales de contacto abiertos con éxito! Revisa tus pestañas.', 'success');

            // Limpiar los campos del formulario
            contactForm.reset();

        }, 1200); // Pequeña simulación de carga de 1.2 segundos para darle más interactividad
    });

    function showFeedback(msg, type) {
        formFeedback.textContent = msg;
        formFeedback.style.color = type === 'success' ? '#10b981' : '#ef4444';

        // Desaparecer el aviso después de 5 segundos
        setTimeout(() => {
            formFeedback.textContent = '';
        }, 5000);
    }
});