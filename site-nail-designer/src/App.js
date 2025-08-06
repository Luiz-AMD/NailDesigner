import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Home from './components/Home';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Appointment from './components/Appointment';

function App() {
    return (
        <div className="App">
            <Header />
            <main className="main-content">
                <Home />
                <Services />
                <Gallery />
                <Contact />
                <Appointment />
            </main>
            <footer>
                <p>&copy; 2023 Designer de Unhas. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default App; 