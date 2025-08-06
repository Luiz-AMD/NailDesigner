import React from 'react';

function Contact() {
    return (
        <section id="contato" className="main-contato">
            <h2 className="titulo-contato">Informações de Contato</h2>
            <p>Entre em contato conosco para agendar um horário ou para mais informações.</p>
            <div className="contato-redes">
                <a
                    href="https://wa.me/38992702823"
                    target="_blank"
                    rel="noopener"
                    className="contato-whatsapp contato-link"
                    aria-label="WhatsApp"
                >
                    <svg width="32" height="32" viewBox="0 0 32 32" style={{ verticalAlign: 'middle' }} fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="32" height="32" rx="16" fill="#25D366" />
                        <path d="M16 7.333c-4.78 0-8.667 3.887-8.667 8.667 0 1.53.413 3.027 1.197 4.34l-1.267 4.74 4.87-1.28c1.27.697 2.71 1.07 4.13 1.07 4.78 0 8.667-3.887 8.667-8.667S20.78 7.333 16 7.333Zm4.267 12.267c-.18.507-1.05.98-1.44 1.04-.387.06-.867.087-1.393-.087-.32-.107-.73-.237-1.26-.463-2.22-.92-3.667-3.08-3.78-3.227-.113-.147-.9-1.2-.9-2.293 0-1.093.573-1.627.78-1.847.207-.22.453-.273.607-.273.153 0 .307.001.44.008.14.007.33-.053.52.4.193.46.66 1.587.72 1.7.06.113.1.247.02.393-.08.147-.12.24-.24.387-.12.147-.253.327-.36.44-.12.127-.247.267-.107.527.14.26.62 1.02 1.34 1.653.92.82 1.7 1.08 1.96 1.2.253.12.4.1.547-.06.147-.16.627-.727.793-.98.167-.253.333-.207.56-.127.227.08 1.44.68 1.687.807.247.127.413.187.473.293.06.107.06.62-.12 1.127Z" fill="#fff" />
                    </svg>
                    WhatsApp
                </a>
                <a
                    href="https://instagram.com/livia_nailart__"
                    target="_blank"
                    rel="noopener"
                    className="contato-instagram contato-link"
                    aria-label="Instagram"
                >
                    <svg width="32" height="32" viewBox="0 0 32 32" style={{ verticalAlign: 'middle' }} fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="32" height="32" rx="16" fill="url(#ig-gradient)" />
                        <defs>
                            <radialGradient id="ig-gradient" cx="0.7" cy="0.3" r="1">
                                <stop stopColor="#fdf497" />
                                <stop offset="0.5" stopColor="#fd5949" />
                                <stop offset="0.7" stopColor="#d6249f" />
                                <stop offset="1" stopColor="#285AEB" />
                            </radialGradient>
                        </defs>
                        <rect x="9" y="9" width="14" height="14" rx="4" stroke="#fff" strokeWidth="2" />
                        <circle cx="16" cy="16" r="3.5" stroke="#fff" strokeWidth="2" />
                        <circle cx="21.2" cy="10.8" r="1.2" fill="#fff" />
                    </svg>
                    Instagram
                </a>
            </div>
        </section>
    );
}

export default Contact; 