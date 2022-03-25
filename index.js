initPlayer({
    target: '.my-player',
    slides: [
        {
            url: 'img/chunk-1.jpg',
            alt: 'slide1',
            overlays: [
                {
                    type: 'text',
                    value: 'Hello',
                    styles: {
                        color: 'orange',
                        'font-size': '60px',
                        'text-shadow': '1px 1px #000',
                        top: '60%',
                        left: '30%',
                        transform: 'rotate(-30deg)',
                        animation: 'scale 6s infinite ease',
                    },
                },
                {
                    type: 'text',
                    value: 'world!',
                    styles: {
                        color: 'orange',
                        'font-size': '30px',
                        'text-shadow': '1px 1px #000',
                        bottom: '10%',
                        right: '20%',
                        transform: 'rotate(90deg)',
                        animation: 'scale 2s infinite ease-in-out',
                    },
                },
            ]
        },
        {url: 'img/chunk-2.jpg', alt: 'slide2'},
        {url: 'img/chunk-3.jpg', alt: 'slide3'},
        {url: 'img/chunk-4.jpg', alt: 'slide4'},
    ],
    delayPerSlide: 5,
});