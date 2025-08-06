import React, { useEffect } from 'react';

function Gallery() {
    useEffect(() => {
        // Carregar o script do LightWidget
        const script = document.createElement('script');
        script.src = 'https://cdn.lightwidget.com/widgets/lightwidget.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Limpar o script quando o componente for desmontado
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, []);

    return (
        <section id="galeria" className="main-gallery" aria-label="Galeria de Trabalhos">
            <h2 className="main-gallery-title">Galeria de Trabalhos</h2>
            <p className="main-gallery-text">Confira alguns dos nossos trabalhos mais recentes.</p>
            <iframe
                src="//lightwidget.com/widgets/2af3a2623e205f1288d76adc314d61ab.html"
                scrolling="no"
                allowTransparency="true"
                className="lightwidget-widget"
                style={{ width: '100%', border: 0, overflow: 'hidden' }}
                title="Galeria do Instagram"
            />
        </section>
    );
}

export default Gallery; 