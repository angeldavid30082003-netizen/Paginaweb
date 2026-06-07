document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. CONTROL DE TEMA (OSCURO / CLARO) CON PERSISTENCIA
    // ==========================================================================
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
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
    // 2. TERMINAL INTERACTIVA (MOTOR DE COMANDOS)
    // ==========================================================================
    const terminalInput = document.getElementById('terminal-input');
    const terminalBody = document.getElementById('terminal-body');
    const quickCmdBtns = document.querySelectorAll('.quick-cmd-btn');

    // Base de datos de comandos y respuestas para la consola
    const terminalCommands = {
        help: "Comandos disponibles: <span class='cmd-highlight'>about</span>, <span class='cmd-highlight'>skills</span>, <span class='cmd-highlight'>experience</span>, <span class='cmd-highlight'>certifications</span>, <span class='cmd-highlight'>contact</span>, <span class='cmd-highlight'>clear</span>",
        about: "Ángel David Garzón Prieto — Junior Software Engineer en Bogotá. Especializado en Full-Stack, soporte TI y automatización con agentes de IA.",
        skills: "Habilidades principales: Python, JavaScript, TypeScript, Node.js, Spring Boot, MySQL, Active Directory, CCNA.",
        experience: "Pasante de Soporte TI & Desarrollador Full-Stack en Grupo Eulen Colombia (2026). Estudiante de Ingeniería de Software en la UMB.",
        certifications: "7 certificaciones obtenidas incluyendo Claude 101, CCNAv7, Scrum SFC, Oracle Cloud, y Ciberseguridad.",
        contact: "Email: angeldavid9@outlook.com | Teléfono: +57 320 2501045",
        clear: "clear"
    };

    // Escuchar la tecla Enter en la consola
    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const inputVal = terminalInput.value.trim().toLowerCase();
                processCommand(inputVal);
                terminalInput.value = ''; // Limpiar la caja de texto
            }
        });
    }

    // Conectar los botones de comandos rápidos debajo de la consola
    quickCmdBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            processCommand(cmd);
        });
    });

    function processCommand(cmd) {
        if (!cmd) return;

        // Imprimir el prompt con el comando que el usuario digitó
        const userLine = document.createElement('div');
        userLine.className = 'terminal-line';
        userLine.innerHTML = `<span class="terminal-prompt">guest@angel-dev:~$</span> <span>${cmd}</span>`;
        terminalBody.appendChild(userLine);

        // Validar acción del comando
        if (cmd === 'clear') {
            terminalBody.innerHTML = ''; // Limpia el historial
        } else if (terminalCommands[cmd]) {
            const responseLine = document.createElement('div');
            responseLine.className = 'terminal-line';
            responseLine.innerHTML = `<span class="output-text system">${terminalCommands[cmd]}</span>`;
            terminalBody.appendChild(responseLine);
        } else {
            // Error si escribe algo que no existe
            const errorLine = document.createElement('div');
            errorLine.className = 'terminal-line';
            errorLine.innerHTML = `<span class="output-text error" style="color: #ef4444;">Comando inválido: '${cmd}'. Escribe <span class='cmd-highlight'>help</span> para ver opciones.</span>`;
            terminalBody.appendChild(errorLine);
        }

        // Auto-scroll para mantener siempre el foco abajo
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    // ==========================================================================
    // 3. MENÚ MÓVIL INTERACTIVO
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = mobileToggle.querySelector('ion-icon');
            icon.setAttribute('name', navMenu.classList.contains('active') ? 'close-outline' : 'menu-outline');
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('ion-icon').setAttribute('name', 'menu-outline');
            });
        });
    }

    // ==========================================================================
    // 4. ANIMACIÓN DE LAS BARRAS DE HABILIDADES (SKILLS)
    // ==========================================================================
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.width = bar.getAttribute('data-width');
                skillsObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3 });

    skillProgressBars.forEach(bar => skillsObserver.observe(bar));

    // ==========================================================================
    // 5. FORMULARIO DE CONTACTO (WHATSAPP + EMAIL)
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const formFeedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('form-submit-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoader = submitBtn.querySelector('.btn-loader');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            if (!name || !email || !subject || !message) {
                showFeedback('Por favor, rellena todos los campos.', 'error');
                return;
            }

            btnText.style.display = 'none';
            btnLoader.style.display = 'block';
            submitBtn.disabled = true;

            setTimeout(() => {
                const whatsappMessage = `*¡Hola Ángel! Mensaje desde tu Portafolio* 🚀\n\n👤 *Nombre:* ${name}\n📧 *Email:* ${email}\n📌 *Asunto:* ${subject}\n\n💬 *Mensaje:*\n${message}`;
                const phoneNumber = "573202501045";
                const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(whatsappMessage)}`;
                const mailtoUrl = `mailto:angeldavid9@outlook.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("De: " + name + " <" + email + ">\n\n" + message)}`;

                window.open(whatsappUrl, '_blank');
                window.location.href = mailtoUrl;

                btnText.style.display = 'flex';
                btnLoader.style.display = 'none';
                submitBtn.disabled = false;

                showFeedback('¡Canales abiertos con éxito!', 'success');
                contactForm.reset();
            }, 1200);
        });
    }

    function showFeedback(msg, type) {
        formFeedback.textContent = msg;
        formFeedback.style.color = type === 'success' ? '#10b981' : '#ef4444';
        setTimeout(() => { formFeedback.textContent = ''; }, 5000);
    }
});
