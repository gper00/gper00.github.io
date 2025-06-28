document.addEventListener("DOMContentLoaded", function() {
    // Skrip untuk animasi fade-in
    const animatedElements = document.querySelectorAll('.fade-in-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    animatedElements.forEach(element => { observer.observe(element); });

    // Skrip untuk efek header saat scroll
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 10) {
                header.classList.add('bg-white/95', 'backdrop-blur-lg', 'shadow-sm');
            } else {
                header.classList.remove('bg-white/95', 'backdrop-blur-lg', 'shadow-sm');
            }
        });
    }

    // Skrip menu responsif
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

    if (mobileMenuBtn && mobileMenu) {
        const body = document.body;

        function toggleMobileMenu() {
            mobileMenu.classList.toggle('is-open');
            body.classList.toggle('overflow-hidden');

            // Toggle overlay jika ada
            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.toggle('hidden');
            }
        }

        function closeMobileMenu() {
            mobileMenu.classList.remove('is-open');
            body.classList.remove('overflow-hidden');

            // Sembunyikan overlay jika ada
            if (mobileMenuOverlay) {
                mobileMenuOverlay.classList.add('hidden');
            }
        }

        mobileMenuBtn.addEventListener('click', toggleMobileMenu);

        // Tambahkan event listener untuk tombol close jika ada
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', closeMobileMenu);
        }

        // Tambahkan event listener untuk overlay jika ada
        if (mobileMenuOverlay) {
            mobileMenuOverlay.addEventListener('click', closeMobileMenu);
        }

        const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMobileMenu();
            }
        });
    }

    // Skrip efek ketik di index.html
    const typingElement = document.getElementById('typing-effect');
    if (typingElement) {
        const phrases = [
            "Hello world.",
            "Suka membangun hal menarik dengan Javascript.",
            "Sangat suka sepak bola #VicsaBarca.",
            "Senang juga jika diajak main catur.",
            "Ingin Menjadi Programmer Handal Namun Enggan Ngoding."
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
        async function typeLoop() {
            while (true) {
                const currentPhrase = phrases[phraseIndex];
                if (isDeleting) {
                    typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
                    charIndex--;
                    await sleep(50);
                } else {
                    typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
                    charIndex++;
                    await sleep(100);
                }
                if (!isDeleting && charIndex === currentPhrase.length) {
                    await sleep(2000);
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    await sleep(500);
                }
            }
        }
        typeLoop();
    }

    // Skrip untuk render data 3 tulisan di index.html
    const recentArticlesContiner = document.getElementById('latest-articles-container');
    if(recentArticlesContiner) {
        fetch('data.json')
            .then(res => res.json())
            .then(data => {
                data
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .filter(item => item.published)
                    .slice(0, 3)
                    .forEach(blog => {
                        let thumbHtml = '';
                        if (blog.thumbnail) {
                            thumbHtml = `<div class="aspect-video h-52 w-full overflow-hidden rounded-xl mb-4">
                                    <img src="${blog.thumbnail}" alt="${blog.title}" class="w-full h-full object-cover" />
                                    </div>`;
                        } else {
                            thumbHtml = `<div class="aspect-video h-52 w-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl mb-4 overflow-hidden">
                                <svg class="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v11.494m-5.253-7.494H17.25M3.375 6.168h17.25m-17.25 11.664h17.25"></path></svg>
                                </div>`;
                        }
                        let category = blog.category ? blog.category.toUpperCase() : 'UMUM';
                        let html = `<a href="post-detail.html?slug=${blog.slug}" class="group block">
                            <div class="thumbnail-wrapper">${thumbHtml}</div>
                            <div class="content-wrapper">
                                <span class="text-sm font-medium text-slate-500">${category}</span>
                                <h3 class="mt-1 text-xl font-semibold text-slate-900 group-hover:text-slate-700">${blog.title}</h3>
                                <p class="text-slate-600 text-sm mt-2 hidden">${blog.excerpt}</p>
                            </div>
                            </a>`;
                recentArticlesContiner.innerHTML += html;
            });
        });
    }

    // Skrip untuk View Toggler di blog.html
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    const articlesContainer = document.getElementById('articles-container');
    if (gridBtn && listBtn && articlesContainer) {
        const articleCards = articlesContainer.querySelectorAll('.group');
        gridBtn.addEventListener('click', () => {
            gridBtn.classList.add('active', 'bg-white', 'shadow-sm');
            gridBtn.classList.remove('text-slate-500');
            listBtn.classList.remove('active', 'bg-white', 'shadow-sm');
            listBtn.classList.add('text-slate-500');
            articlesContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 fade-in-up is-visible';
            articleCards.forEach(card => {
                card.className = 'group block';
                card.querySelector('.content-wrapper p').classList.add('hidden');
            });
        });
        listBtn.addEventListener('click', () => {
            listBtn.classList.add('active', 'bg-white', 'shadow-sm');
            listBtn.classList.remove('text-slate-500');
            gridBtn.classList.remove('active', 'bg-white', 'shadow-sm');
            gridBtn.classList.add('text-slate-500');
            articlesContainer.className = 'flex flex-col gap-6 fade-in-up is-visible';
            articleCards.forEach(card => {
                card.className = 'list-view-card';
                card.querySelector('.content-wrapper p').classList.remove('hidden');
            });
        });
    }

    // Skrip tombol salin kode di post-detail.html
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const wrapper = button.closest('.code-block-wrapper');
            const codeElement = wrapper.querySelector('pre > code');
            const textToCopy = codeElement.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const buttonText = button.querySelector('.btn-text');
                buttonText.textContent = 'Disalin!';
                setTimeout(() => { buttonText.textContent = 'Salin'; }, 2000);
            }).catch(err => { console.error('Gagal menyalin kode: ', err); });
        });
    });

    // Render post detail
    if (window.location.pathname.endsWith('post-detail.html')) {
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('slug');
        if (!slug) {
            document.querySelector('main').innerHTML = '<div class="text-center py-20 text-xl">Post tidak ditemukan.</div>';
        } else {
            fetch('data.json')
                .then(res => res.json())
                .then(data => {
                    const post = data.find(item => item.slug === slug && item.published);
                    if (!post) {
                        document.querySelector('main').innerHTML = '<div class="text-center py-20 text-xl">Post tidak ditemukan.</div>';
                        return;
                    }
                    // Update judul halaman
                    document.title = post.title + ' | ' + document.title.split('|').pop().trim();
                    // Update header judul, kategori, tanggal, dsb
                    const header = document.querySelector('article > header');
                    if (header) {
                        header.querySelector('span').textContent = post.category ? post.category.toUpperCase() : 'UMUM';
                        header.querySelector('h1').textContent = post.title;
                        // Tanggal
                        const date = new Date(post.created_at);
                        const dateStr = date.toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
                        header.querySelector('.text-slate-500').textContent = `Diterbitkan pada ${dateStr}`;
                    }
                    // Update gambar utama jika ada thumbnail
                    const figure = document.querySelector('figure');
                    if (figure) {
                        if (post.thumbnail) {
                            figure.innerHTML = `<img src="${post.thumbnail}" alt="${post.title}" class="w-full aspect-video object-cover rounded-xl shadow-lg">`;
                        } else {
                            figure.innerHTML = '';
                            figure.style.display = 'none';
                            document.querySelector('.article-content').classList.add('mt-10');
                        }
                    }
                    // Update tags
                    const footer = document.querySelector('article > footer .flex');
                    if (footer && post.tags) {
                        footer.innerHTML = '<span class="text-sm font-medium text-slate-600">Tags:</span>' +
                            post.tags.map(tag => `<a href="#" class="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full hover:bg-slate-200 transition-colors">${tag}</a>`).join(' ');
                    }
                    // Fetch markdown dan render ke .article-content
                    fetch(`posts/${slug}.md`)
                        .then(res => res.text())
                        .then(md => {
                            const content = document.querySelector('.article-content');
                            if (content) {
                                content.innerHTML = marked.parse(md);
                            }
                        });
                });
        }
    }
});
