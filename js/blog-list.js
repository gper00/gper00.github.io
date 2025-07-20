// Blog List Logic for blog.html
(function() {
    if (!window.location.pathname.endsWith('blog.html')) return;

    const host = 'http://localhost:5000';
    const endpoint = '/api/posts';

    let blogs = [];
    let filteredBlogs = [];
    let currentSort = 'desc'; // 'desc' = terbaru, 'asc' = terlama
    let currentView = 'grid';
    let recentPost = null;

    const container = document.getElementById('articles-container');
    const sortSelect = document.getElementById('sort-by');
    const searchInput = document.querySelector('input[type="search"]');
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    const recentPostContainer = document.getElementById('recent-post-container');

    // Helper: update URL query string
    function updateURL() {
        const params = new URLSearchParams(window.location.search);
        params.set('sort', currentSort);
        params.set('view', currentView);
        if (searchInput && searchInput.value) params.set('q', searchInput.value);
        else params.delete('q');
        history.replaceState(null, '', window.location.pathname + '?' + params.toString());
    }

    // Helper: load state from URL
    function loadFromURL() {
        const params = new URLSearchParams(window.location.search);
        currentSort = params.get('sort') || 'desc';
        currentView = params.get('view') || 'grid';
        if (sortSelect) sortSelect.value = currentSort === 'desc' ? sortSelect.options[0].value : sortSelect.options[1].value;
        if (gridBtn && listBtn) {
            if (currentView === 'grid') {
                gridBtn.classList.add('active', 'bg-white', 'shadow-sm');
                gridBtn.classList.remove('text-slate-500');
                listBtn.classList.remove('active', 'bg-white', 'shadow-sm');
                listBtn.classList.add('text-slate-500');
            } else {
                listBtn.classList.add('active', 'bg-white', 'shadow-sm');
                listBtn.classList.remove('text-slate-500');
                gridBtn.classList.remove('active', 'bg-white', 'shadow-sm');
                gridBtn.classList.add('text-slate-500');
            }
        }
        if (searchInput) searchInput.value = params.get('q') || '';
    }

    // Skeleton loader
    function showLoading() {
        if (!container) return;
        container.innerHTML = '';
        if (currentView === 'grid') {
            // Skeleton untuk grid: 3 kolom
            for (let i = 0; i < 6; i++) {
                container.innerHTML += `<div class="bg-white rounded-xl shadow p-0 flex flex-col animate-pulse">
  <div class="aspect-video h-52 w-full bg-slate-200 rounded-t-xl"></div>
  <div class="p-4">
    <div class="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
    <div class="h-6 bg-slate-200 rounded w-2/3 mb-3"></div>
    <div class="h-4 bg-slate-200 rounded w-1/2"></div>
  </div>
</div>`;
            }
            container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
        } else {
            // Skeleton untuk list: flex row
            for (let i = 0; i < 3; i++) {
                container.innerHTML += `<div class="animate-pulse bg-white rounded-xl shadow p-6 mb-6 flex flex-col md:flex-row gap-6">
  <div class="bg-slate-200 rounded-xl aspect-video h-52 w-full md:w-1/3"></div>
  <div class="flex-1 space-y-4 py-4">
    <div class="h-4 bg-slate-200 rounded w-1/4"></div>
    <div class="h-6 bg-slate-200 rounded w-2/3"></div>
    <div class="h-4 bg-slate-200 rounded w-3/4"></div>
  </div>
</div>`;
            }
            container.className = 'flex flex-col gap-6';
        }
    }

    function renderRecentPost() {
        if (!recentPostContainer) {
            return;
        }
        if (!recentPost) {
            recentPostContainer.innerHTML = '<div class="text-center text-slate-500 py-8">Belum ada artikel terbaru.</div>';
            return;
        }
        let thumbHtml = '';
        if (recentPost.thumbnail) {
            thumbHtml = `<div class="aspect-[4/3] w-full overflow-hidden rounded-lg mb-4 md:mb-0">
                <img src="${recentPost.thumbnail}" alt="${recentPost.title}" class="w-full h-full object-cover aspect-[4/3]" />
            </div>`;
        } else {
            thumbHtml = `<div class="aspect-[4/3] w-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 rounded-lg mb-4 md:mb-0 overflow-hidden">
                <svg class="w-12 h-12 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v11.494m-5.253-7.494H17.25M3.375 6.168h17.25m-17.25 11.664h17.25"></path></svg>
            </div>`;
        }
        let category = recentPost.category ? recentPost.category.toUpperCase() : 'UMUM';
        let html = `<a href="post-detail.html?title=${recentPost.slug}"
            class="group block md:flex gap-8 items-center bg-white p-6 rounded-xl border border-slate-200 hover:shadow-xl transition-all duration-300">
            <div class="w-full md:w-1/2">${thumbHtml}</div>
            <div class="w-full md:w-1/2">
                <span class="text-sm font-medium text-amber-600">★ ARTIKEL TERBARU</span>
                <h2 class="mt-2 text-2xl md:text-3xl font-bold text-slate-900 group-hover:text-slate-700">${recentPost.title}</h2>
                <p class="mt-3 text-slate-600">${recentPost.excerpt || ''}</p>
                <div class="mt-4 text-sm font-semibold text-slate-800 group-hover:text-slate-500 transition-colors">
                    Baca selengkapnya &rarr;
                </div>
            </div>
        </a>`;
        recentPostContainer.innerHTML = html;
    }

    function renderBlogs() {
        if (!container) return;
        container.innerHTML = '';
        filteredBlogs.forEach(blog => {
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
            let html = '';
            if (currentView === 'list') {
                html = `<a href="post-detail.html?title=${blog.slug}" class="list-view-card md:flex gap-6 group block">
  <div class="thumbnail-wrapper md:w-1/3 flex-shrink-0">
    <div class="aspect-video h-52 w-full overflow-hidden rounded-xl mb-4">
      ${blog.thumbnail ? `<img src="${blog.thumbnail}" alt="${blog.title}" class="w-full h-full object-cover" />` : `<div class=\"w-full h-full flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl\"><svg class=\"w-12 h-12 text-stone-400\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.5\" d=\"M12 6.253v11.494m-5.253-7.494H17.25M3.375 6.168h17.25m-17.25 11.664h17.25\"></path></svg></div>`}
    </div>
  </div>
  <div class="content-wrapper md:w-2/3 flex flex-col justify-center">
    <span class="text-sm font-medium text-slate-500">${category}</span>
    <h3 class="mt-1 text-xl font-semibold text-slate-900 group-hover:text-slate-700">${blog.title}</h3>
    <p class="text-slate-600 text-sm mt-2">${blog.excerpt}</p>
  </div>
</a>`;
            } else {
                html = `<a href="post-detail.html?title=${blog.slug}" class="group block">
  <div class="thumbnail-wrapper">${thumbHtml}</div>
  <div class="content-wrapper">
    <span class="text-sm font-medium text-slate-500">${category}</span>
    <h3 class="mt-1 text-xl font-semibold text-slate-900 group-hover:text-slate-700">${blog.title}</h3>
    <p class="text-slate-600 text-sm mt-2 hidden">${blog.excerpt}</p>
  </div>
</a>`;
            }
            container.innerHTML += html;
        });
        // Atur class container sesuai view
        if (currentView === 'grid') {
            container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
        } else {
            container.className = 'flex flex-col gap-6';
        }
    }

    function sortBlogs() {
        filteredBlogs.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            if (currentSort === 'desc') return dateB - dateA;
            else return dateA - dateB;
        });
    }

    function filterBlogs() {
        showLoading();
        updateURL();
        setTimeout(() => {
            const q = (searchInput?.value || '').toLowerCase();

            // filteredBlogs = blogs.filter(blog =>
            //     blog.slug !== (recentPost && recentPost.slug) && (
            //         blog.title.toLowerCase().includes(q) ||
            //         (blog.excerpt && blog.excerpt.toLowerCase().includes(q)) ||
            //         (blog.tags && blog.tags.join(' ').toLowerCase().includes(q))
            //     )
            // );

            filteredBlogs = blogs.filter(blog =>
                blog.slug !== (recentPost && recentPost.slug) && (
                    blog.title.toLowerCase().includes(q) ||
                    blog.slug.toLowerCase().includes(q) ||
                    (blog.category && blog.category.toLowerCase().includes(q)) ||
                    (blog.excerpt && blog.excerpt.toLowerCase().includes(q)) ||
                    (blog.tags && blog.tags.join(' ').toLowerCase().includes(q))
                )
            );
            sortBlogs();
            renderBlogs();
        }, 400);
    }

    // Event listeners
    if (sortSelect) {
        // Hilangkan opsi 'Urutkan: Terpopuler'
        [...sortSelect.options].forEach(opt => { if (opt.textContent.includes('Terpopuler')) opt.remove(); });
        sortSelect.addEventListener('change', e => {
            showLoading();
            currentSort = sortSelect.value.includes('Terbaru') ? 'desc' : 'asc';
            updateURL();
            setTimeout(() => {
                sortBlogs();
                renderBlogs();
            }, 400);
        });
    }
    if (searchInput) {
        searchInput.addEventListener('input', filterBlogs);
    }
    if (gridBtn && listBtn) {
        gridBtn.addEventListener('click', () => {
            currentView = 'grid';
            updateURL();
            renderBlogs();
            gridBtn.classList.add('active', 'bg-white', 'shadow-sm');
            gridBtn.classList.remove('text-slate-500');
            listBtn.classList.remove('active', 'bg-white', 'shadow-sm');
            listBtn.classList.add('text-slate-500');
        });
        listBtn.addEventListener('click', () => {
            currentView = 'list';
            updateURL();
            renderBlogs();
            listBtn.classList.add('active', 'bg-white', 'shadow-sm');
            listBtn.classList.remove('text-slate-500');
            gridBtn.classList.remove('active', 'bg-white', 'shadow-sm');
            gridBtn.classList.add('text-slate-500');
        });
    }

    // Fetch data
    fetch(`${host}${endpoint}`)
        .then(res => res.json())
        .then(data => {
            // console.log(data)
            const { posts } = data
            const sorted = posts.sort((a, b) => b.createdAt - a.createdAt);
            recentPost = sorted[0] || null;
            renderRecentPost();
            blogs = sorted.slice(1); // sisanya untuk daftar artikel
            filteredBlogs = [...blogs];
            loadFromURL();
            filterBlogs();
        });
})();
