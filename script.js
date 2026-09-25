/* =========================================================
   SOGRONIS FC — JAVASCRIPT RESPONSIVO
   - Resultados responsivos
   - Elenco responsivo
   - Formação tática responsiva
   - Galeria / Lightbox responsivo
   - Menu mobile + rolagem por seção
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    /* =====================================================
       UTILITÁRIOS GERAIS
       ===================================================== */

    const root = document.documentElement;

    function atualizarAlturaHeader() {
        const header = document.querySelector('.top-header, header');

        if (!header) return;

        const altura = Math.ceil(
            header.getBoundingClientRect().height
        );

        root.style.setProperty(
            '--header-offset',
            `${altura + 12}px`
        );
    }

    atualizarAlturaHeader();

    window.addEventListener(
        'load',
        atualizarAlturaHeader
    );

    window.addEventListener(
        'resize',
        atualizarAlturaHeader
    );


    /* =====================================================
       MENU RESPONSIVO + NAVEGAÇÃO POR SEÇÕES
       ===================================================== */

    const mobileToggle =
        document.getElementById('mobileToggle');

    const navLinks =
        document.getElementById('navLinks');

    const toggleIcon =
        mobileToggle?.querySelector('i');


    function fecharMenu() {

        if (!navLinks) return;

        navLinks.classList.remove('nav-open');

        mobileToggle?.setAttribute(
            'aria-expanded',
            'false'
        );

        if (toggleIcon) {

            toggleIcon.classList.remove(
                'fa-times'
            );

            toggleIcon.classList.add(
                'fa-bars'
            );
        }
    }


    function abrirOuFecharMenu() {

        if (!navLinks) return;

        const aberto =
            navLinks.classList.toggle('nav-open');

        mobileToggle?.setAttribute(
            'aria-expanded',
            String(aberto)
        );

        if (toggleIcon) {

            toggleIcon.classList.toggle(
                'fa-bars',
                !aberto
            );

            toggleIcon.classList.toggle(
                'fa-times',
                aberto
            );
        }
    }


    if (mobileToggle) {

        mobileToggle.addEventListener(
            'click',
            abrirOuFecharMenu
        );
    }


    const linksDoMenu =
        navLinks?.querySelectorAll(
            'a[href^="#"]'
        ) || [];


    linksDoMenu.forEach(link => {

        link.addEventListener(
            'click',
            event => {

                const href =
                    link.getAttribute('href');

                if (!href || href === '#') {
                    return;
                }

                const alvo =
                    document.querySelector(href);

                if (!alvo) {
                    return;
                }

                event.preventDefault();

                fecharMenu();

                const header =
                    document.querySelector(
                        '.top-header, header'
                    );

                const alturaHeader =
                    header
                        ? header.getBoundingClientRect().height
                        : 0;

                const posicao =
                    alvo.getBoundingClientRect().top +
                    window.scrollY -
                    alturaHeader -
                    8;

                window.scrollTo({

                    top: Math.max(
                        0,
                        posicao
                    ),

                    behavior: 'smooth'
                });

                history.replaceState(
                    null,
                    '',
                    href
                );
            }
        );
    });


    /* Fecha o menu quando clicar fora */

    document.addEventListener(
        'click',
        event => {

            if (!navLinks || !mobileToggle) {
                return;
            }

            if (
                !navLinks.classList.contains(
                    'nav-open'
                )
            ) {
                return;
            }

            const clicouNoMenu =
                navLinks.contains(event.target);

            const clicouNoBotao =
                mobileToggle.contains(event.target);

            if (
                !clicouNoMenu &&
                !clicouNoBotao
            ) {
                fecharMenu();
            }
        }
    );


    /* Fecha o menu quando volta para desktop */

    window.addEventListener(
        'resize',
        () => {

            if (window.innerWidth > 900) {
                fecharMenu();
            }
        }
    );


    /* =====================================================
       DESTACAR SEÇÃO ATIVA NO MENU
       ===================================================== */

    const secoesNavegacao = [
        'inicio',
        'resultados',
        'elenco',
        'formacao',
        'galeria',
        'contato'
    ]

        .map(
            id =>
                document.getElementById(id)
        )

        .filter(Boolean);


    const linksPorId = new Map();


    linksDoMenu.forEach(link => {

        const href =
            link.getAttribute('href');

        if (href?.startsWith('#')) {

            linksPorId.set(
                href.substring(1),
                link
            );
        }
    });


    if (
        'IntersectionObserver' in window &&
        secoesNavegacao.length
    ) {

        const observadorSecoes =
            new IntersectionObserver(

                entries => {

                    const visiveis =
                        entries

                            .filter(
                                entry =>
                                    entry.isIntersecting
                            )

                            .sort(
                                (a, b) =>
                                    b.intersectionRatio -
                                    a.intersectionRatio
                            );


                    if (!visiveis.length) {
                        return;
                    }


                    linksDoMenu.forEach(
                        link =>
                            link.classList.remove(
                                'active'
                            )
                    );


                    const id =
                        visiveis[0].target.id;


                    const linkAtivo =
                        linksPorId.get(id);


                    linkAtivo?.classList.add(
                        'active'
                    );
                },

                {
                    root: null,

                    rootMargin:
                        '-20% 0px -65% 0px',

                    threshold: [
                        0,
                        0.15,
                        0.35,
                        0.6
                    ]
                }
            );


        secoesNavegacao.forEach(
            secao =>
                observadorSecoes.observe(
                    secao
                )
        );
    }


    /* =====================================================
       RESULTADOS — CARROSSEL RESPONSIVO
       ===================================================== */

    const resultadosContainer =
        document.getElementById(
            'resultadosContainer'
        );

    const btnProximos =
        document.getElementById(
            'btnProximos'
        );

    const btnAnteriores =
        document.getElementById(
            'btnAnteriores'
        );


    if (resultadosContainer) {

        const cardsResultados =
            Array.from(
                resultadosContainer.querySelectorAll(
                    '.card'
                )
            );


        function obterCardsResultadosPorVez() {

            if (window.innerWidth <= 650) {
                return 1;
            }

            if (window.innerWidth <= 992) {
                return 2;
            }

            return 3;
        }


        function obterGapResultados() {

            const estilo =
                window.getComputedStyle(
                    resultadosContainer
                );

            return (
                parseFloat(
                    estilo.columnGap ||
                    estilo.gap
                ) || 20
            );
        }


        function obterDistanciaResultados() {

            const card =
                cardsResultados[0];

            if (!card) {

                return (
                    resultadosContainer.clientWidth ||
                    320
                );
            }


            const quantidade =
                obterCardsResultadosPorVez();


            const gap =
                obterGapResultados();


            const largura =
                card.getBoundingClientRect().width;


            return (
                (largura + gap) *
                quantidade
            );
        }


        function rolarResultados(
            direcao
        ) {

            resultadosContainer.scrollBy({

                left:
                    direcao *
                    obterDistanciaResultados(),

                behavior: 'smooth'
            });
        }


        if (btnProximos) {

            btnProximos.addEventListener(
                'click',
                () =>
                    rolarResultados(1)
            );
        }


        if (btnAnteriores) {

            btnAnteriores.addEventListener(
                'click',
                () =>
                    rolarResultados(-1)
            );
        }


        /* =================================================
           SWIPE DO CARROSSEL DE RESULTADOS
           ================================================= */

        let inicioX = 0;

        let inicioScroll = 0;

        let arrastando = false;


        resultadosContainer.addEventListener(
            'touchstart',
            event => {

                if (!event.touches.length) {
                    return;
                }

                inicioX =
                    event.touches[0].clientX;

                inicioScroll =
                    resultadosContainer.scrollLeft;

                arrastando = true;

            },
            {
                passive: true
            }
        );


        resultadosContainer.addEventListener(
            'touchend',
            event => {

                if (
                    !arrastando ||
                    !event.changedTouches.length
                ) {
                    return;
                }


                const fimX =
                    event.changedTouches[0].clientX;


                const diferenca =
                    inicioX - fimX;


                arrastando = false;


                if (
                    Math.abs(diferenca) < 45
                ) {
                    return;
                }


                resultadosContainer.scrollTo({

                    left:
                        inicioScroll +
                        (
                            diferenca > 0
                                ? obterDistanciaResultados()
                                : -obterDistanciaResultados()
                        ),

                    behavior: 'smooth'
                });

            },
            {
                passive: true
            }
        );
    }


    /* =====================================================
       ELENCO — CARROSSEL RESPONSIVO
       ===================================================== */

    const elencoTrack =
        document.getElementById(
            'elencoTrack'
        );

    const elencoViewport =
        document.getElementById(
            'elencoViewport'
        );

    const elencoCards =
        elencoTrack
            ? Array.from(
                elencoTrack.querySelectorAll(
                    '.itens-card'
                )
            )
            : [];


    const btnElencoPrev =
        document.getElementById(
            'btnElencoPrev'
        );

    const btnElencoNext =
        document.getElementById(
            'btnElencoNext'
        );

    const elencoDots =
        document.getElementById(
            'elencoDots'
        );


    if (
        elencoTrack &&
        elencoCards.length
    ) {

        let paginaAtual = 0;

        let cardsPorVez = 3;

        let autoPlayTimer = null;

        let resizeTimer = null;

        let touchStartX = 0;

        let touchEndX = 0;


        function obterCardsPorVez() {

            if (window.innerWidth <= 650) {
                return 1;
            }

            if (window.innerWidth <= 1024) {
                return 2;
            }

            return 3;
        }


        function obterGapElenco() {

            const estilo =
                window.getComputedStyle(
                    elencoTrack
                );

            return (
                parseFloat(
                    estilo.columnGap ||
                    estilo.gap
                ) || 16
            );
        }


        function atualizarCardsPorVez() {

            cardsPorVez =
                obterCardsPorVez();
        }


        function obterTotalPaginas() {

            return Math.max(
                1,
                Math.ceil(
                    elencoCards.length /
                    cardsPorVez
                )
            );
        }


        function limitarPagina() {

            const total =
                obterTotalPaginas();


            if (
                paginaAtual >= total
            ) {
                paginaAtual =
                    total - 1;
            }


            if (
                paginaAtual < 0
            ) {
                paginaAtual = 0;
            }
        }


        function criarDots() {

            if (!elencoDots) {
                return;
            }


            elencoDots.innerHTML = '';


            const total =
                obterTotalPaginas();


            if (total <= 1) {

                elencoDots.style.display =
                    'none';

                return;
            }


            elencoDots.style.display = '';


            for (
                let i = 0;
                i < total;
                i++
            ) {

                const dot =
                    document.createElement(
                        'button'
                    );


                dot.type = 'button';

                dot.className = 'dot';

                dot.setAttribute(
                    'aria-label',
                    `Ir para página ${i + 1}`
                );

                dot.setAttribute(
                    'aria-current',
                    i === paginaAtual
                        ? 'true'
                        : 'false'
                );


                if (
                    i === paginaAtual
                ) {
                    dot.classList.add(
                        'active'
                    );
                }


                dot.addEventListener(
                    'click',
                    () => {

                        paginaAtual = i;

                        moverElenco();

                        reiniciarAutoPlay();
                    }
                );


                elencoDots.appendChild(
                    dot
                );
            }
        }


        function obterLarguraCard() {

            const card =
                elencoCards[0];

            if (!card) {
                return 0;
            }

            return card.getBoundingClientRect()
                .width;
        }


        function moverElenco() {

            atualizarCardsPorVez();

            limitarPagina();


            const cardWidth =
                obterLarguraCard();


            const gap =
                obterGapElenco();


            if (!cardWidth) {
                return;
            }


            const deslocamento =
                paginaAtual *
                cardsPorVez *
                (cardWidth + gap);


            elencoTrack.style.transform =
                `translate3d(-${deslocamento}px, 0, 0)`;


            if (elencoDots) {

                const dots =
                    elencoDots.querySelectorAll(
                        '.dot'
                    );


                dots.forEach(
                    (dot, index) => {

                        const ativo =
                            index ===
                            paginaAtual;


                        dot.classList.toggle(
                            'active',
                            ativo
                        );


                        dot.setAttribute(
                            'aria-current',
                            ativo
                                ? 'true'
                                : 'false'
                        );
                    }
                );
            }
        }


        function pararAutoPlay() {

            if (autoPlayTimer) {

                clearInterval(
                    autoPlayTimer
                );

                autoPlayTimer = null;
            }
        }


        function iniciarAutoPlay() {

            pararAutoPlay();


            if (
                elencoCards.length <=
                cardsPorVez
            ) {
                return;
            }


            autoPlayTimer =
                setInterval(
                    () => {

                        const total =
                            obterTotalPaginas();


                        paginaAtual++;


                        if (
                            paginaAtual >= total
                        ) {
                            paginaAtual = 0;
                        }


                        moverElenco();

                    },
                    5000
                );
        }


        function reiniciarAutoPlay() {

            pararAutoPlay();

            iniciarAutoPlay();
        }


        if (btnElencoNext) {

            btnElencoNext.addEventListener(
                'click',
                () => {

                    paginaAtual++;

                    if (
                        paginaAtual >=
                        obterTotalPaginas()
                    ) {
                        paginaAtual = 0;
                    }

                    moverElenco();

                    reiniciarAutoPlay();
                }
            );
        }


        if (btnElencoPrev) {

            btnElencoPrev.addEventListener(
                'click',
                () => {

                    paginaAtual--;

                    if (
                        paginaAtual < 0
                    ) {
                        paginaAtual =
                            obterTotalPaginas() -
                            1;
                    }

                    moverElenco();

                    reiniciarAutoPlay();
                }
            );
        }


        if (elencoViewport) {

            elencoViewport.addEventListener(
                'mouseenter',
                pararAutoPlay
            );


            elencoViewport.addEventListener(
                'mouseleave',
                iniciarAutoPlay
            );


            elencoViewport.addEventListener(
                'touchstart',
                event => {

                    if (
                        !event.touches.length
                    ) {
                        return;
                    }

                    touchStartX =
                        event.touches[0].clientX;

                    touchEndX =
                        touchStartX;

                    pararAutoPlay();
                },
                {
                    passive: true
                }
            );


            elencoViewport.addEventListener(
                'touchmove',
                event => {

                    if (
                        !event.touches.length
                    ) {
                        return;
                    }

                    touchEndX =
                        event.touches[0].clientX;
                },
                {
                    passive: true
                }
            );


            elencoViewport.addEventListener(
                'touchend',
                () => {

                    const diferenca =
                        touchStartX -
                        touchEndX;


                    if (
                        Math.abs(diferenca) >=
                        45
                    ) {

                        if (
                            diferenca > 0
                        ) {
                            paginaAtual++;
                        } else {
                            paginaAtual--;
                        }


                        limitarPagina();

                        moverElenco();
                    }


                    iniciarAutoPlay();
                },
                {
                    passive: true
                }
            );
        }


        window.addEventListener(
            'resize',
            () => {

                clearTimeout(
                    resizeTimer
                );


                resizeTimer =
                    setTimeout(
                        () => {

                            atualizarCardsPorVez();

                            limitarPagina();

                            criarDots();

                            moverElenco();

                            iniciarAutoPlay();

                        },
                        150
                    );
            }
        );


        atualizarCardsPorVez();

        criarDots();

        moverElenco();

        iniciarAutoPlay();
    }


    /* =====================================================
       FORMAÇÃO TÁTICA
       ===================================================== */

    const elencoSogronis = [

        {
            id: 1,
            nome: 'Jé',
            pos: 'GK',
            sigla: '1',
            foto: './img/escudo-time.png'
        },

        {
            id: 2,
            nome: 'Najo',
            pos: 'LE',
            sigla: '6',
            foto: './img/escudo-time.png'
        },

        {
            id: 3,
            nome: 'Victor',
            pos: 'ZAG',
            sigla: '4',
            foto: './img/escudo-time.png'
        },

        {
            id: 4,
            nome: 'Mosquito',
            pos: 'ZAG',
            sigla: '3',
            foto: './img/escudo-time.png'
        },

        {
            id: 5,
            nome: 'Lat. Direito',
            pos: 'LD',
            sigla: '2',
            foto: './img/escudo-time.png'
        },

        {
            id: 6,
            nome: 'PATINHO',
            pos: 'VOL',
            sigla: '10',
            foto: './img/img-jogador/jogador-pato.jpg'
        },

        {
            id: 7,
            nome: 'TIJOLO',
            pos: 'MC',
            sigla: '8',
            foto: './img/img-jogador/jogador-bloco.jpg'
        },

        {
            id: 8,
            nome: 'Volante',
            pos: 'MEI',
            sigla: '5',
            foto: './img/escudo-time.png'
        },

        {
            id: 9,
            nome: 'BOQUINHA',
            pos: 'PE',
            sigla: '16',
            foto: './img/img-jogador/jogador-boquinha.png'
        },

        {
            id: 10,
            nome: 'CABEÇA',
            pos: 'CA',
            sigla: '9',
            foto: './img/img-jogador/jogador-cabeça.png'
        },

        {
            id: 11,
            nome: 'TONY',
            pos: 'PD',
            sigla: '11',
            foto: './img/escudo-time.png'
        }
    ];


    const esquemasTaticos2D = {

        '4-4-2': [

            { left: '6%', top: '50%' },

            { left: '18%', top: '20%' },

            { left: '16%', top: '38%' },

            { left: '16%', top: '62%' },

            { left: '18%', top: '80%' },

            { left: '32%', top: '20%' },

            { left: '28%', top: '40%' },

            { left: '28%', top: '60%' },

            { left: '32%', top: '80%' },

            { left: '42%', top: '38%' },

            { left: '42%', top: '62%' }
        ],


        '4-3-3': [

            { left: '6%', top: '50%' },

            { left: '18%', top: '20%' },

            { left: '16%', top: '38%' },

            { left: '16%', top: '62%' },

            { left: '18%', top: '80%' },

            { left: '26%', top: '50%' },

            { left: '32%', top: '28%' },

            { left: '32%', top: '72%' },

            { left: '43%', top: '22%' },

            { left: '44%', top: '50%' },

            { left: '43%', top: '78%' }
        ]
    };


    const posicoesAdversario2D = [

        { left: '94%', top: '50%' },

        { left: '82%', top: '20%' },

        { left: '84%', top: '38%' },

        { left: '84%', top: '62%' },

        { left: '82%', top: '80%' },

        { left: '68%', top: '20%' },

        { left: '72%', top: '40%' },

        { left: '72%', top: '60%' },

        { left: '68%', top: '80%' },

        { left: '58%', top: '38%' },

        { left: '58%', top: '62%' }
    ];


    const containerTime =
        document.getElementById(
            'timePrincipal'
        );

    const containerAdv =
        document.getElementById(
            'timeAdversario'
        );

    const botoesEsquema =
        document.querySelectorAll(
            '.btn-esquema'
        );


    function renderizarAdversario() {

        if (!containerAdv) {
            return;
        }


        containerAdv.innerHTML = '';


        const fragmento =
            document.createDocumentFragment();


        posicoesAdversario2D.forEach(
            pos => {

                const pino =
                    document.createElement(
                        'div'
                    );


                pino.className =
                    'pino-adv';


                pino.style.left =
                    pos.left;


                pino.style.top =
                    pos.top;


                fragmento.appendChild(
                    pino
                );
            }
        );


        containerAdv.appendChild(
            fragmento
        );
    }


    function renderizarTimePrincipal(
        esquema
    ) {

        if (!containerTime) {
            return;
        }


        const posicoes =
            esquemasTaticos2D[esquema] ||
            esquemasTaticos2D['4-4-2'];


        const cardsExistentes =
            containerTime.querySelectorAll(
                '.card-jogador'
            );


        if (
            cardsExistentes.length ===
            elencoSogronis.length
        ) {

            cardsExistentes.forEach(
                (card, index) => {

                    const pos =
                        posicoes[index];

                    if (!pos) {
                        return;
                    }


                    card.style.left =
                        pos.left;

                    card.style.top =
                        pos.top;
                }
            );

            return;
        }


        containerTime.innerHTML = '';


        const fragmento =
            document.createDocumentFragment();


        elencoSogronis.forEach(
            (jogador, index) => {

                const pos =
                    posicoes[index];

                if (!pos) {
                    return;
                }


                const card =
                    document.createElement(
                        'div'
                    );


                card.className =
                    'card-jogador';


                card.style.left =
                    pos.left;


                card.style.top =
                    pos.top;


                card.innerHTML = `

                    <div class="avatar-circulo">

                        <img
                            src="${jogador.foto}"
                            alt="${jogador.nome}"
                            class="img-jogador"
                            onerror="this.src='./img/escudo-time.png'"
                        >

                        <span class="badge-numero">
                            ${jogador.sigla}
                        </span>

                    </div>

                    <div class="tag-nome">
                        ${jogador.nome}
                    </div>

                `;


                fragmento.appendChild(
                    card
                );
            }
        );


        containerTime.appendChild(
            fragmento
        );
    }


    botoesEsquema.forEach(
        btn => {

            btn.addEventListener(
                'click',
                event => {

                    const botao =
                        event.currentTarget;


                    const esquema =
                        botao.getAttribute(
                            'data-esquema'
                        );


                    botoesEsquema.forEach(
                        b => {

                            b.classList.remove(
                                'active'
                            );

                            b.setAttribute(
                                'aria-pressed',
                                'false'
                            );
                        }
                    );


                    botao.classList.add(
                        'active'
                    );


                    botao.setAttribute(
                        'aria-pressed',
                        'true'
                    );


                    renderizarTimePrincipal(
                        esquema
                    );
                }
            );
        }
    );


    renderizarAdversario();

    renderizarTimePrincipal(
        '4-4-2'
    );


    /* =====================================================
       GALERIA / LIGHTBOX — RESPONSIVO
       ===================================================== */

    const cardsGaleria =
        document.querySelectorAll(
            '.card-foto'
        );

    const modal =
        document.getElementById(
            'lightbox-modal'
        );

    const modalImg =
        document.getElementById(
            'lightbox-img'
        );

    const modalTitulo =
        document.getElementById(
            'lightbox-titulo'
        );

    const modalCategoria =
        document.getElementById(
            'lightbox-categoria'
        );

    const modalContador =
        document.getElementById(
            'lightbox-contador'
        );

    const btnFechar =
        document.querySelector(
            '.btn-fechar'
        );

    const btnGaleriaPrev =
        document.querySelector(
            '.prev-btn'
        );

    const btnGaleriaNext =
        document.querySelector(
            '.next-btn'
        );


    if (
        modal &&
        modalImg
    ) {

        let imagensAtuais = [];

        let indiceAtual = 0;


        function atualizarModal() {

            if (
                !imagensAtuais.length
            ) {
                return;
            }


            modalImg.src =
                imagensAtuais[indiceAtual];


            modalImg.alt =
                modalTitulo?.textContent ||
                'Imagem da galeria';


            if (modalContador) {

                modalContador.textContent =
                    `${indiceAtual + 1} / ${imagensAtuais.length}`;
            }
        }


        function proximaFoto() {

            if (
                !imagensAtuais.length
            ) {
                return;
            }


            indiceAtual =
                (
                    indiceAtual + 1
                ) %
                imagensAtuais.length;


            atualizarModal();
        }


        function fotoAnterior() {

            if (
                !imagensAtuais.length
            ) {
                return;
            }


            indiceAtual =
                (
                    indiceAtual - 1 +
                    imagensAtuais.length
                ) %
                imagensAtuais.length;


            atualizarModal();
        }


        function fecharModal() {

            modal.classList.remove(
                'active'
            );


            document.body.classList.remove(
                'lightbox-aberto'
            );


            document.body.style.overflow =
                '';


            modal.setAttribute(
                'aria-hidden',
                'true'
            );
        }


        cardsGaleria.forEach(
            card => {

                card.addEventListener(
                    'click',
                    () => {

                        const rawImages =
                            card.getAttribute(
                                'data-images'
                            );


                        if (!rawImages) {
                            return;
                        }


                        imagensAtuais =
                            rawImages

                                .split(',')

                                .map(
                                    img =>
                                        img.trim()
                                )

                                .filter(Boolean);


                        if (
                            !imagensAtuais.length
                        ) {
                            return;
                        }


                        indiceAtual = 0;


                        if (modalTitulo) {

                            modalTitulo.textContent =
                                card.getAttribute(
                                    'data-title'
                                ) ||
                                'Galeria';
                        }


                        if (modalCategoria) {

                            modalCategoria.textContent =
                                card.getAttribute(
                                    'data-category'
                                ) ||
                                'FOTOS';
                        }


                        atualizarModal();


                        modal.classList.add(
                            'active'
                        );


                        document.body.classList.add(
                            'lightbox-aberto'
                        );


                        document.body.style.overflow =
                            'hidden';


                        modal.setAttribute(
                            'aria-hidden',
                            'false'
                        );
                    }
                );
            }
        );


        if (btnGaleriaNext) {

            btnGaleriaNext.addEventListener(
                'click',
                event => {

                    event.stopPropagation();

                    proximaFoto();
                }
            );
        }


        if (btnGaleriaPrev) {

            btnGaleriaPrev.addEventListener(
                'click',
                event => {

                    event.stopPropagation();

                    fotoAnterior();
                }
            );
        }


        if (btnFechar) {

            btnFechar.addEventListener(
                'click',
                event => {

                    event.stopPropagation();

                    fecharModal();
                }
            );
        }


        modal.addEventListener(
            'click',
            event => {

                if (
                    event.target === modal
                ) {
                    fecharModal();
                }
            }
        );


        document.addEventListener(
            'keydown',
            event => {

                if (
                    !modal.classList.contains(
                        'active'
                    )
                ) {
                    return;
                }


                if (
                    event.key ===
                    'ArrowRight'
                ) {

                    event.preventDefault();

                    proximaFoto();
                }


                if (
                    event.key ===
                    'ArrowLeft'
                ) {

                    event.preventDefault();

                    fotoAnterior();
                }


                if (
                    event.key ===
                    'Escape'
                ) {

                    event.preventDefault();

                    fecharModal();
                }
            }
        );


        /* =================================================
           SWIPE DO LIGHTBOX
           ================================================= */

        let touchStartX = 0;

        let touchEndX = 0;


        modal.addEventListener(
            'touchstart',
            event => {

                if (
                    !event.touches.length
                ) {
                    return;
                }


                touchStartX =
                    event.touches[0].clientX;

                touchEndX =
                    touchStartX;

            },
            {
                passive: true
            }
        );


        modal.addEventListener(
            'touchmove',
            event => {

                if (
                    !event.touches.length
                ) {
                    return;
                }


                touchEndX =
                    event.touches[0].clientX;

            },
            {
                passive: true
            }
        );


        modal.addEventListener(
            'touchend',
            () => {

                const diferenca =
                    touchStartX -
                    touchEndX;


                if (
                    Math.abs(diferenca) < 45
                ) {
                    return;
                }


                if (
                    diferenca > 0
                ) {

                    proximaFoto();

                } else {

                    fotoAnterior();
                }
            },
            {
                passive: true
            }
        );
    }


    /* =====================================================
       ATUALIZAÇÃO FINAL DO HEADER
       ===================================================== */

    let ultimoResize = 0;


    window.addEventListener(
        'resize',
        () => {

            const agora =
                Date.now();


            if (
                agora - ultimoResize <
                100
            ) {
                return;
            }


            ultimoResize = agora;


            atualizarAlturaHeader();
        }
    );

});
