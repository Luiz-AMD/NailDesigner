import React from 'react';

function Services() {
    const services = [
        {
            title: "Molde F1",
            image: "https://mixdajo.fbitsstatic.net/img/p/kit-completo-alongamento-no-molde-f1-brilia-nails-144107/332008-3.jpg?w=530&h=530&v=no-value",
            alt: "Unha feita com molde F1"
        },
        {
            title: "Fibra de vidro",
            image: "https://alongamentosdeunhas.com/wp-content/uploads/2020/04/melhor-alongamento-unhas-vidro.jpg",
            alt: "Unha feita com fibra de vidro"
        },
        {
            title: "Banho em gel",
            image: "https://blog.mondaine.com.br/wp-content/uploads/2024/01/banhodegel1.jpeg",
            alt: "Unha feita com banho em gel"
        },
        {
            title: "Manutenção",
            image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqLDMgX30fsXwmzwveU9qwq7H7S5mH-lkIu72isV4pNHx6NzOY7BHYdHcFe2SgJ3Moe1iMVD_XvLUAJDXkNnC4oqMsrkBip2y3dJdJl7smXHp2XABbRwZm7jzsRAOClwvsDbZsb3b4aKz2/s640/blogger-image-1446366530.jpg",
            alt: "Unha feita após manutenção"
        },
        {
            title: "Esmaltação em gel",
            image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqLDMgX30fsXwmzwveU9qwq7H7S5mH-lkIu72isV4pNHx6NzOY7BHYdHcFe2SgJ3Moe1iMVD_XvLUAJDXkNnC4oqMsrkBip2y3dJdJl7smXHp2XABbRwZm7jzsRAOClwvsDbZsb3b4aKz2/s640/blogger-image-1446366530.jpg",
            alt: "Unha feita após manutenção"
        }
    ];

    return (
        <section id="servicos" className="main-services">
            <div className="maxWidth main-services-container">
                <h2 className="main-services-title">Nossos Serviços</h2>
                <p className="main-services-text">
                    Conheça nossos serviços de designer de unhas, feitos com carinho e dedicação para realçar a sua
                    beleza. Cada detalhe é pensado para proporcionar uma experiência única e transformadora.
                </p>
                <div className="services-container">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`service-item ${index === 0 ? 'service-itemAlinhado' : ''}`}
                        >
                            <h3 className="service-item-title">{service.title}</h3>
                            <img
                                src={service.image}
                                alt={service.alt}
                                className="service-item-img"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Services; 