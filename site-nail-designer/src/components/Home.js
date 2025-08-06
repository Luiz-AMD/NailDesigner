import React, { useState } from 'react';

function Home() {
    const [currentImage, setCurrentImage] = useState(0);
    const images = [
        "https://www.coloramaesmaltes.com.br/-/media/Project/Loreal/Brand-Sites/Essie/MASTER/DMI/articles/tips_trends/2024/nail-designer/designer-esmalte.jpg?la=en&hash=B32B40E6273F316219E4843DE068DACDAFD9639E",
        "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiqLDMgX30fsXwmzwveU9qwq7H7S5mH-lkIu72isV4pNHx6NzOY7BHYdHcFe2SgJ3Moe1iMVD_XvLUAJDXkNnC4oqMsrkBip2y3dJdJl7smXHp2XABbRwZm7jzsRAOClwvsDbZsb3b4aKz2/s640/blogger-image-1446366530.jpg",
        "https://blog.mondaine.com.br/wp-content/uploads/2024/01/banhodegel1.jpeg"
    ];

    const trocaImg = () => {
        setCurrentImage((prev) => (prev + 1) % images.length);
    };

    return (
        <section id="home" className="main-welcome maxWidth">
            <div className="main-content-text">
                <h1 className="main-title">
                    Seja muito<span className="span-title-main">bem-vinda!</span>
                </h1>
                <p className="main-text">
                    É um prazer receber você aqui. Seu cuidado e autoestima merecem toda atenção!
                    Descubra nossos serviços exclusivos e transforme suas unhas em verdadeiras obras de arte.
                    Sinta-se à vontade para explorar, se inspirar e agendar seu atendimento.
                    Estamos pronta para realçar ainda mais a sua beleza!
                </p>
            </div>
            <img
                className="main-img"
                src={images[currentImage]}
                alt="Unhas em gel decoradas, exemplo de trabalho realizado"
                onClick={trocaImg}
            />
        </section>
    );
}

export default Home; 