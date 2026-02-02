// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────────────────────
export const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Source+Sans+3:wght@300;400;500;600&display=swap');

  :root {
    --cream: #f5f0e8;
    --cream-dark: #ebe4d5;
    --ink: #2c2420;
    --ink-light: #5c4f45;
    --ink-muted: #8a7e74;
    --accent: #c2724a;
    --accent-hover: #a85e38;
    --accent-light: #f0e0d6;
    --gold: #b8976b;
    --gold-light: #f0e6d0;
    --red-soft: #d4564a;
    --green-soft: #5a9a6f;
    --border: #d9d0c2;
    --shadow: 0 2px 16px rgba(44,36,32,0.08);
    --shadow-lg: 0 8px 40px rgba(44,36,32,0.12);
    --radius: 10px;
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Source Sans 3', sans-serif;
    background: var(--cream);
    color: var(--ink);
    min-height: 100vh;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4 { font-family: 'Playfair Display', serif; }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

  /* ── Layout Shell ── */
  .app-shell { display: flex; min-height: 100vh; }

  /* ── Sidebar ── */
  .sidebar {
    width: 240px;
    background: var(--ink);
    color: #fff;
    display: flex;
    flex-direction: column;
    position: fixed;
    inset: 0;
    left: 0;
    z-index: 100;
    transition: transform 0.3s cubic-bezier(.4,0,.2,1);
  }
  .sidebar.hidden { transform: translateX(-240px); }
  .sidebar-logo {
    padding: 32px 24px 28px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
  }
  .sidebar-logo h1 { font-size: 1.35rem; color: #fff; letter-spacing: -0.5px; }
  .sidebar-logo p { font-size: 0.72rem; color: var(--ink-muted); margin-top: 2px; text-transform: uppercase; letter-spacing: 1.5px; }

  .nav-list { list-style: none; padding: 16px 12px; flex: 1; }
  .nav-item { margin-bottom: 2px; }
  .nav-link {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 14px;
    border-radius: 8px;
    color: rgba(255,255,255,0.6);
    text-decoration: none;
    font-size: 0.88rem;
    font-weight: 500;
    transition: all 0.2s;
    cursor: pointer;
    border: none; background: none; width: 100%; text-align: left;
  }
  .nav-link:hover { background: rgba(255,255,255,0.08); color: #fff; }
  .nav-link.active { background: var(--accent); color: #fff; }
  .nav-link svg { width: 18px; height: 18px; opacity: 0.7; flex-shrink: 0; }
  .nav-link.active svg { opacity: 1; }

  .sidebar-footer { padding: 16px 12px; border-top: 1px solid rgba(255,255,255,0.1); }
  .user-card { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; }
  .user-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: var(--accent); display: flex; align-items: center; justify-content: center;
    font-weight: 600; font-size: 0.85rem; color: #fff; flex-shrink: 0;
  }
  .user-info { overflow: hidden; flex: 1; min-width: 0; }
  .user-info .name { font-size: 0.82rem; color: #fff; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-info .role { font-size: 0.68rem; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 1px; }
  .logout-btn {
    background: none; border: none; color: var(--ink-muted);
    cursor: pointer; font-size: 0.78rem; padding: 6px 8px; border-radius: 6px;
    transition: all 0.2s; margin-top: 4px; width: 100%; text-align: left;
  }
  .logout-btn:hover { color: var(--red-soft); background: rgba(212,86,74,0.1); }

  /* ── Main Content ── */
  .main-content {
    margin-left: 240px;
    flex: 1;
    min-height: 100vh;
    transition: margin-left 0.3s cubic-bezier(.4,0,.2,1);
  }
  .main-content.expanded { margin-left: 0; }

  .top-bar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 32px;
    background: var(--cream);
    border-bottom: 1px solid var(--border);
    position: sticky; top: 0; z-index: 50;
  }
  .top-bar h2 { font-size: 1.5rem; color: var(--ink); }
  .hamburger {
    width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border);
    background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s; margin-right: 16px;
  }
  .hamburger:hover { background: var(--cream-dark); }
  .hamburger svg { width: 18px; height: 18px; color: var(--ink); }

  .page-body { padding: 28px 32px; max-width: 1200px; }

  /* ── Cards ── */
  .card {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    overflow: hidden;
  }
  .card-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .card-header h3 { font-size: 1.1rem; }
  .card-body { padding: 24px; }

  /* ── Buttons ── */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: 8px; border: none;
    font-family: inherit; font-size: 0.82rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s; text-decoration: none;
    white-space: nowrap;
  }
  .btn svg { width: 15px; height: 15px; }
  .btn-primary { background: var(--accent); color: #fff; }
  .btn-primary:hover { background: var(--accent-hover); }
  .btn-secondary { background: #fff; color: var(--ink); border: 1px solid var(--border); }
  .btn-secondary:hover { background: var(--cream-dark); }
  .btn-danger { background: var(--red-soft); color: #fff; }
  .btn-danger:hover { background: #b84439; }
  .btn-ghost { background: transparent; color: var(--ink-light); border: 1px solid transparent; }
  .btn-ghost:hover { background: var(--cream-dark); border-color: var(--border); }
  .btn-sm { padding: 5px 12px; font-size: 0.76rem; }
  .btn:disabled { opacity: 0.45; cursor: not-allowed; }

  /* ── Inputs ── */
  .input-group { margin-bottom: 18px; }
  .input-group label { display: block; font-size: 0.78rem; font-weight: 600; color: var(--ink-light); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.8px; }
  .input-group input, .input-group textarea, .input-group select {
    width: 100%; padding: 10px 14px; border-radius: 8px;
    border: 1px solid var(--border); background: #fff;
    font-family: inherit; font-size: 0.88rem; color: var(--ink);
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
  }
  .input-group input:focus, .input-group textarea:focus, .input-group select:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-light);
  }
  .input-group textarea { resize: vertical; min-height: 80px; }
  .input-group .hint { font-size: 0.72rem; color: var(--ink-muted); margin-top: 4px; }
  .input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

  /* ── Error / Toast ── */
  .error-msg { color: var(--red-soft); font-size: 0.78rem; margin-top: 8px; padding: 8px 12px; background: #fdf0ef; border-radius: 6px; }
  .toast {
    position: fixed; bottom: 32px; right: 32px; z-index: 9999;
    background: var(--ink); color: #fff; padding: 14px 22px;
    border-radius: 10px; font-size: 0.85rem; box-shadow: var(--shadow-lg);
    animation: slideUp 0.3s cubic-bezier(.4,0,.2,1);
    display: flex; align-items: center; gap: 10px; max-width: 360px;
  }
  .toast.success { background: var(--green-soft); }
  .toast.error { background: var(--red-soft); }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* ── Auth Pages ── */
  .auth-screen {
    min-height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: linear-gradient(135deg, var(--cream) 0%, var(--gold-light) 100%);
    padding: 20px;
  }
  .auth-card {
    background: #fff; border-radius: 16px; box-shadow: var(--shadow-lg);
    max-width: 420px; width: 100%; padding: 40px 36px;
  }
  .auth-logo {
    text-align: center; margin-bottom: 32px;
  }
  .auth-logo h1 { font-size: 1.7rem; margin-bottom: 6px; }
  .auth-logo p { font-size: 0.78rem; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 1.4px; }
  .auth-footer {
    text-align: center; margin-top: 24px; font-size: 0.82rem; color: var(--ink-muted);
  }
  .auth-footer a { color: var(--accent); font-weight: 600; text-decoration: none; }
  .auth-footer a:hover { text-decoration: underline; }

  /* ── Dashboard Stats ── */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: #fff; border: 1px solid var(--border); border-radius: var(--radius); padding: 22px; box-shadow: var(--shadow); }
  .stat-card .stat-val { font-family: 'Playfair Display', serif; font-size: 2rem; font-weight: 700; color: var(--ink); }
  .stat-card .stat-label { font-size: 0.72rem; color: var(--ink-muted); text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
  .stat-card .stat-icon { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
  .stat-card .stat-icon svg { width: 20px; height: 20px; }
  .si-blue { background: #e8f0fe; } .si-blue svg { color: #4a7cf7; }
  .si-amber { background: var(--gold-light); } .si-amber svg { color: var(--gold); }
  .si-rose { background: var(--accent-light); } .si-rose svg { color: var(--accent); }

  /* ── Table ── */
  .data-table { width: 100%; border-collapse: collapse; }
  .data-table th, .data-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid var(--border); }
  .data-table th { font-size: 0.76rem; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; color: var(--ink-light); background: var(--cream); }
  .data-table td { font-size: 0.84rem; color: var(--ink); }
  .data-table tbody tr:hover { background: var(--cream); }
  .actions-cell { display: flex; gap: 6px; align-items: center; }

  /* ── Badges ── */
  .badge {
    display: inline-block; padding: 4px 10px; border-radius: 6px;
    font-size: 0.72rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;
  }
  .badge.primary { background: var(--accent-light); color: var(--accent-hover); }
  .badge.success { background: #e6f4ec; color: var(--green-soft); }
  .badge.warning { background: #fef3e6; color: #d68a2e; }
  .badge.danger { background: #fdf0ef; color: var(--red-soft); }

  /* ── Stars ── */
  .stars { display: inline-flex; gap: 2px; }
  .stars svg { width: 16px; height: 16px; }

  /* ── Grid/List ── */
  .books-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px,1fr)); gap: 20px; }
  .book-card {
    background: #fff; border: 1px solid var(--border); border-radius: var(--radius);
    box-shadow: var(--shadow); overflow: hidden; transition: transform 0.2s, box-shadow 0.2s; cursor: pointer;
  }
  .book-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
  .book-card-cover {
    width: 100%; height: 280px; background: linear-gradient(135deg, var(--cream-dark), var(--gold-light));
    display: flex; align-items: center; justify-content: center; font-size: 3rem; color: var(--ink-muted);
  }
  .book-card-body { padding: 18px; }
  .book-card-body h4 { font-size: 1.05rem; margin-bottom: 4px; }
  .book-card-body .author { font-size: 0.78rem; color: var(--ink-muted); margin-bottom: 10px; }
  .book-card-body .rating { font-size: 0.76rem; color: var(--ink-light); margin-bottom: 4px; }

  /* ── Spinner ── */
  .spinner {
    width: 36px; height: 36px; border: 3px solid var(--border);
    border-top-color: var(--accent); border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Modal ── */
  .modal-backdrop {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    animation: fadeIn 0.2s;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-content {
    background: #fff; border-radius: 12px; box-shadow: var(--shadow-lg);
    max-width: 500px; width: 100%; padding: 28px; animation: slideDown 0.3s cubic-bezier(.4,0,.2,1);
  }
  @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .modal-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
  .modal-header h3 { font-size: 1.2rem; }
  .modal-footer { display: flex; gap: 10px; justify-content: flex-end; margin-top: 24px; }

  /* ── Empty State ── */
  .empty-state { text-align: center; padding: 60px 20px; color: var(--ink-muted); }
  .empty-state svg { width: 64px; height: 64px; margin-bottom: 16px; opacity: 0.3; }
  .empty-state h4 { font-size: 1.1rem; margin-bottom: 8px; color: var(--ink-light); }
  .empty-state p { font-size: 0.85rem; }

  /* ── Search bar ── */
  .search-bar {
    display: flex; align-items: center; gap: 10px; margin-bottom: 20px;
    padding: 10px 16px; border-radius: 8px; border: 1px solid var(--border); background: #fff;
  }
  .search-bar input {
    flex: 1; border: none; outline: none; font-size: 0.88rem; font-family: inherit; color: var(--ink);
  }
  .search-bar svg { width: 18px; height: 18px; color: var(--ink-muted); }

  /* ── Review Card ── */
  .review-card {
    background: #fff; border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; box-shadow: var(--shadow); margin-bottom: 16px;
  }
  .review-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px; }
  .review-meta { flex: 1; }
  .review-meta .book-title { font-weight: 600; font-size: 0.95rem; color: var(--ink); margin-bottom: 4px; }
  .review-meta .author { font-size: 0.76rem; color: var(--ink-muted); }
  .review-body .comment { font-size: 0.85rem; color: var(--ink-light); line-height: 1.6; margin-bottom: 10px; }
  .review-footer { display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem; color: var(--ink-muted); }

  /* ── Detail Page ── */
  .detail-header {
    display: flex; gap: 32px; margin-bottom: 32px;
    padding: 32px; background: #fff; border: 1px solid var(--border);
    border-radius: var(--radius); box-shadow: var(--shadow);
  }
  .detail-cover {
    width: 200px; height: 300px; flex-shrink: 0; border-radius: 8px;
    background: linear-gradient(135deg, var(--cream-dark), var(--gold-light));
    display: flex; align-items: center; justify-content: center; font-size: 4rem; color: var(--ink-muted);
  }
  .detail-info { flex: 1; }
  .detail-info h2 { font-size: 1.8rem; margin-bottom: 8px; }
  .detail-info .author { font-size: 1rem; color: var(--ink-muted); margin-bottom: 16px; }
  .detail-info .meta { display: flex; gap: 20px; margin-bottom: 20px; }
  .detail-info .meta-item { font-size: 0.8rem; }
  .detail-info .meta-item strong { display: block; color: var(--ink-light); text-transform: uppercase; letter-spacing: 0.8px; font-size: 0.7rem; margin-bottom: 4px; }
  .detail-actions { display: flex; gap: 10px; margin-top: 20px; }

  /* ── Filters ── */
  .filters { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .filter-btn {
    padding: 7px 14px; border-radius: 8px; border: 1px solid var(--border);
    background: #fff; font-size: 0.78rem; cursor: pointer; transition: all 0.2s;
    color: var(--ink-light); font-weight: 500;
  }
  .filter-btn:hover { background: var(--cream-dark); }
  .filter-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
`;
