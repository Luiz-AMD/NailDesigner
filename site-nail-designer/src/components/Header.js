import React, { useState } from 'react';

function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header className="header">
            <nav className="nav-header maxWidth" aria-label="Menu principal">
                <a href="#home" className="logo-header-nome" aria-label="Ir para o início">
                    Livía Nail Art
                </a>
                <a href="#home" aria-label="Ir para o início">
                    <img src="img/Ana Livia.png" alt="Logo Ana Livia" className="logo-header_img" />
                </a>

                <input
                    type="checkbox"
                    name="header-menu-input"
                    id="header-menu-input"
                    className="header-menu-input hide"
                    checked={isMenuOpen}
                    onChange={toggleMenu}
                />
                <label
                    htmlFor="header-menu-input"
                    className="header-menu-icon"
                    aria-label="Abrir menu de navegação"
                >
                    <span className="header-nav-icon"></span>
                </label>
                <ul className="header-menu" id="header-menu">
                    <li className="header_li">
                        <a href="#servicos" aria-label="Ir para Serviços">Serviços</a>
                    </li>
                    <li className="header_li">
                        <a href="#galeria" aria-label="Ir para Galeria">Galeria</a>
                    </li>
                    <li className="header_li">
                        <a href="#inspiracao" aria-label="Ir para Inspirações">Inspirações</a>
                    </li>
                    <li className="header_li">
                        <a href="#contato" aria-label="Ir para Contato">Contato</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default Header; 