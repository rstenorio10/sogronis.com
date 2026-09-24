document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('resultadosContainer');
    const btnProximos = document.getElementById('btnProximos');
    const btnAnteriores = document.getElementById('btnAnteriores');

    if (!container) return;

    // Função que calcula a distância de rolagem baseada na largura de 1 card + o gap de 20px
    function obterDistanciaRolagem() {
        const primeiroCard = container.querySelector('.card');
        if (!primeiroCard) return 320;
        
        // Pega a largura exata do card + o gap de 20px definido no seu CSS
        const larguraCard = primeiroCard.offsetWidth;
        const gap = 20; 
        
        // Rola proporcionalmente ao tamanho da tela (3 cards no desktop, 2 no tablet, 1 no mobile)
        if (window.innerWidth <= 650) {
            return larguraCard + gap; // Rola 1 card
        } else if (window.innerWidth <= 992) {
            return (larguraCard + gap) * 2; // Rola 2 cards
        } else {
            return (larguraCard + gap) * 3; // Rola 3 cards
        }
    }

    // Evento para ir para jogos mais antigos (Avançar para a direita)
    if (btnProximos) {
        btnProximos.addEventListener('click', () => {
            container.scrollBy({
                left: obterDistanciaRolagem(),
                behavior: 'smooth'
            });
        });
    }

    // Evento para voltar para jogos mais recentes (Voltar para a esquerda)
    if (btnAnteriores) {
        btnAnteriores.addEventListener('click', () => {
            container.scrollBy({
                left: -obterDistanciaRolagem(),
                behavior: 'smooth'
            });
        });
    }
});






document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('elencoTrack');
    const viewport = document.getElementById('elencoViewport');
    const cards = track ? track.querySelectorAll('.itens-card') : [];
    const btnPrev = document.getElementById('btnElencoPrev');
    const btnNext = document.getElementById('btnElencoNext');
    const dotsContainer = document.getElementById('elencoDots');

    if (!track || cards.length === 0) return;

    let currentIndex = 0;
    let cardsPorVez = 3;
    let autoPlayTimer = null;

    // Detecta quantos cards cabem na tela
    function obterCardsPorVez() {
        if (window.innerWidth <= 650) return 1;
        if (window.innerWidth <= 1024) return 2;
        return 3;
    }

    // Calcula o total de páginas/passos do carrossel
    function obterTotalPaginas() {
        return Math.ceil(cards.length / cardsPorVez);
    }

    // Renderiza os pontos de navegação
    function criarDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        const totalPaginas = obterTotalPaginas();

        for (let i = 0; i < totalPaginas; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === currentIndex) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                currentIndex = i;
                moverCarrossel();
                reiniciarAutoPlay();
            });
            dotsContainer.appendChild(dot);
        }
    }

    // Aplica o movimento preciso no CSS
    function moverCarrossel() {
        cardsPorVez = obterCardsPorVez();
        const totalPaginas = obterTotalPaginas();

        // Limita os índices para evitar ultrapassar as bordas
        if (currentIndex >= totalPaginas) currentIndex = 0;
        if (currentIndex < 0) currentIndex = totalPaginas - 1;

        // Medição dinâmica da largura e do gap
        const cardWidth = cards[0].offsetWidth;
        const gap = parseFloat(window.getComputedStyle(track).gap) || 20;
        
        // Calcula o deslocamento exato com base no grupo visível
        const deslocamentoPixels = currentIndex * cardsPorVez * (cardWidth + gap);

        track.style.transform = `translateX(-${deslocamentoPixels}px)`;

        // Atualiza estilo dos pontos
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }
    }

    // Navegação manual
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            currentIndex++;
            moverCarrossel();
            reiniciarAutoPlay();
        });
    }

    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            currentIndex--;
            moverCarrossel();
            reiniciarAutoPlay();
        });
    }

    // Autoplay com reinício limpo
    function iniciarAutoPlay() {
        autoPlayTimer = setInterval(() => {
            currentIndex++;
            moverCarrossel();
        }, 5000);
    }

    function pararAutoPlay() {
        if (autoPlayTimer) clearInterval(autoPlayTimer);
    }

    function reiniciarAutoPlay() {
        pararAutoPlay();
        iniciarAutoPlay();
    }

    // Pausa quando o mouse está sobre o carrossel
    viewport.addEventListener('mouseenter', pararAutoPlay);
    viewport.addEventListener('mouseleave', iniciarAutoPlay);

    // Atualização em redimensionamento de janela com debounce simples
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            criarDots();
            moverCarrossel();
        }, 150);
    });

    // Inicialização
    cardsPorVez = obterCardsPorVez();
    criarDots();
    moverCarrossel();
    iniciarAutoPlay();
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Elenco com Posições no Campo Horizontal (Atacando da Esquerda para a Direita)
    const elencoSogronis = [
        { id: 1, nome: 'Jé', pos: 'GK', sigla: '1', foto: './img/escudo-time.png' },
        { id: 2, nome: 'Najo', pos: 'LE', sigla: '6', foto: './img/escudo-time.png' },
        { id: 3, nome: 'Victor', pos: 'ZAG', sigla: '4', foto: './img/escudo-time.png' },
        { id: 4, nome: 'Mosquito', pos: 'ZAG', sigla: '3', foto: './img/escudo-time.png' },
        { id: 5, nome: 'Lat. Direito', pos: 'LD', sigla: '2', foto: './img/escudo-time.png' },
        { id: 6, nome: 'PATINHO', pos: 'VOL', sigla: '10', foto: './img/img-jogador/jogador-pato.jpg' },
        { id: 7, nome: 'TIJOLO', pos: 'MC', sigla: '8', foto: './img/img-jogador/jogador-bloco.jpg' },
        { id: 8, nome: 'Volante', pos: 'MEI', sigla: '5', foto: './img/escudo-time.png' },
        { id: 9, nome: 'BOQUINHA', pos: 'PE', sigla: '16', foto: './img/img-jogador/jogador-boquinha.png' },
        { id: 10, nome: 'CABEÇA', pos: 'CA', sigla: '9', foto: './img/img-jogador/jogador-cabeça.png' },
        { id: 11, nome: 'TONY', pos: 'PD', sigla: '11', foto: './img/escudo-time.png' }
    ];

    // Coordenadas 2D Horizontais otimizadas para altura de 300px
    const esquemasTaticos2D = {
        '4-4-2': [
            { left: '6%',  top: '50%' }, // GK
            { left: '18%', top: '20%' }, // LE
            { left: '16%', top: '38%' }, // ZAG
            { left: '16%', top: '62%' }, // ZAG
            { left: '18%', top: '80%' }, // LD
            { left: '32%', top: '20%' }, // ME
            { left: '28%', top: '40%' }, // MC
            { left: '28%', top: '60%' }, // MC
            { left: '32%', top: '80%' }, // MD
            { left: '42%', top: '38%' }, // CA
            { left: '42%', top: '62%' }  // CA
        ],
        '4-3-3': [
            { left: '6%',  top: '50%' }, // GK
            { left: '18%', top: '20%' }, // LE
            { left: '16%', top: '38%' }, // ZAG
            { left: '16%', top: '62%' }, // ZAG
            { left: '18%', top: '80%' }, // LD
            { left: '26%', top: '50%' }, // VOL
            { left: '32%', top: '28%' }, // MC
            { left: '32%', top: '72%' }, // MC
            { left: '43%', top: '22%' }, // PE
            { left: '44%', top: '50%' }, // CA
            { left: '43%', top: '78%' }  // PD
        ]
    };

    // 3. Time Adversário Defendendo a Direita (4-4-2)
    // Time Adversário em 2D
    const posicoesAdversario2D = [
        { left: '94%', top: '50%' }, // GK
        { left: '82%', top: '20%' }, { left: '84%', top: '38%' }, { left: '84%', top: '62%' }, { left: '82%', top: '80%' }, // DEF
        { left: '68%', top: '20%' }, { left: '72%', top: '40%' }, { left: '72%', top: '60%' }, { left: '68%', top: '80%' }, // MID
        { left: '58%', top: '38%' }, { left: '58%', top: '62%' }  // ATA
    ];

    const containerTime = document.getElementById('timePrincipal');
    const containerAdv = document.getElementById('timeAdversario');
    const botoesEsquema = document.querySelectorAll('.btn-esquema');

    // Renderiza o time visitante em 2D
    function renderizarAdversario() {
        if (!containerAdv) return;
        containerAdv.innerHTML = '';
        posicoesAdversario2D.forEach(pos => {
            const pino = document.createElement('div');
            pino.className = 'pino-adv';
            pino.style.left = pos.left;
            pino.style.top = pos.top;
            containerAdv.appendChild(pino);
        });
    }

    // Renderiza o elenco principal em 2D
    function renderizarTimePrincipal(esquema) {
        if (!containerTime) return;

        const posicoes = esquemasTaticos2D[esquema] || esquemasTaticos2D['4-4-2'];
        const cardsExistentes = containerTime.querySelectorAll('.card-jogador');

        // Se os cards já existem, apenas atualiza as posições suavemente
        if (cardsExistentes.length === elencoSogronis.length) {
            cardsExistentes.forEach((card, index) => {
                const pos = posicoes[index];
                if (pos) {
                    card.style.left = pos.left;
                    card.style.top = pos.top;
                }
            });
            return;
        }

        containerTime.innerHTML = '';
        const fragmento = document.createDocumentFragment();

        elencoSogronis.forEach((jogador, index) => {
            const pos = posicoes[index];
            if (!pos) return;

            const card = document.createElement('div');
            card.className = 'card-jogador';
            card.style.left = pos.left;
            card.style.top = pos.top;

            card.innerHTML = `
                <div class="avatar-circulo">
                    <img src="${jogador.foto}" alt="${jogador.nome}" class="img-jogador" onerror="this.src='./img/escudo-time.png'">
                    <span class="badge-numero">${jogador.sigla}</span>
                </div>
                <div class="tag-nome">${jogador.nome}</div>
            `;

            fragmento.appendChild(card);
        });

        containerTime.appendChild(fragmento);
    }

    // Evento dos botões de esquema tático
    botoesEsquema.forEach(btn => {
        btn.addEventListener('click', (e) => {
            botoesEsquema.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            
            const esquema = e.target.getAttribute('data-esquema');
            renderizarTimePrincipal(esquema);
        });
    });

    // Inicialização
    renderizarAdversario();
    renderizarTimePrincipal('4-4-2');
});

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card-foto');
    const modal = document.getElementById('lightbox-modal');
    const modalImg = document.getElementById('lightbox-img');
    const modalTitulo = document.getElementById('lightbox-titulo');
    const modalCategoria = document.getElementById('lightbox-categoria');
    const modalContador = document.getElementById('lightbox-contador');
    const btnFechar = document.querySelector('.btn-fechar');
    const btnPrev = document.querySelector('.prev-btn');
    const btnNext = document.querySelector('.next-btn');

    let imagensAtuais = [];
    let indiceAtual = 0;

    // Abrir o Modal ao Clicar no Card
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const rawImages = card.getAttribute('data-images');
            if (!rawImages) return;

            imagensAtuais = rawImages.split(',').map(img => img.trim());
            indiceAtual = 0;

            modalTitulo.textContent = card.getAttribute('data-title') || 'Galeria';
            modalCategoria.textContent = card.getAttribute('data-category') || 'FOTOS';

            atualizarModal();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Impede o scroll de fundo
        });
    });

    // Atualiza a imagem e contador
    function atualizarModal() {
        modalImg.src = imagensAtuais[indiceAtual];
        modalContador.textContent = `${indiceAtual + 1} / ${imagensAtuais.length}`;
    }

    // Navegar para Próxima Foto
    function proximaFoto() {
        indiceAtual = (indiceAtual + 1) % imagensAtuais.length;
        atualizarModal();
    }

    // Navegar para Foto Anterior
    function fotoAnterior() {
        indiceAtual = (indiceAtual - 1 + imagensAtuais.length) % imagensAtuais.length;
        atualizarModal();
    }

    // Eventos dos Botões
    btnNext.addEventListener('click', proximaFoto);
    btnPrev.addEventListener('click', fotoAnterior);

    // Fechar Modal
    function fecharModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Reativa o scroll da página
    }

    btnFechar.addEventListener('click', fecharModal);

    // Fechar ao Clicar Fora da Imagem
    modal.addEventListener('click', (e) => {
        if (e.target === modal) fecharModal();
    });

    // Atalhos do Teclado (Seta Esquerda, Seta Direita e ESC)
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'ArrowRight') proximaFoto();
        if (e.key === 'ArrowLeft') fotoAnterior();
        if (e.key === 'Escape') fecharModal();
    });
});

// Lógica do Menu Responsivo (Hambúrguer)
document.addEventListener('DOMContentLoaded', () => {
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');
    const toggleIcon = mobileToggle ? mobileToggle.querySelector('i') : null;

    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('nav-open');
            
            // Alterna o ícone de Hambúrguer (bars) para Fechar (times)
            if (toggleIcon) {
                if (navLinks.classList.contains('nav-open')) {
                    toggleIcon.classList.remove('fa-bars');
                    toggleIcon.classList.add('fa-times');
                } else {
                    toggleIcon.classList.remove('fa-times');
                    toggleIcon.classList.add('fa-bars');
                }
            }
        });

        // Fecha o menu ao clicar em qualquer item da lista
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('nav-open');
                if (toggleIcon) {
                    toggleIcon.classList.remove('fa-times');
                    toggleIcon.classList.add('fa-bars');
                }
            });
        });
    }
});