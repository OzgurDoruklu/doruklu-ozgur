import { supabase, AppState } from 'https://cdn.doruklu.com/supabase-config.js';
import { ui as globalUI } from 'https://cdn.doruklu.com/ui.js';
import { initSubdomainAuth } from 'https://cdn.doruklu.com/auth.js';

export async function initAuth() {
    await initSubdomainAuth('ozgur_dashboard', (user, profile) => {
        // Login başarılı, app content göster
        const appContent = document.getElementById('dashboard-screen');
        if (appContent) appContent.style.display = 'flex';

        // Merkezi Sisteme Dön butonu
        // "Merkezi Sisteme Dön" — sadece yönlendir, signOut yapma
        // Gerçek çıkış badge'deki "Çıkış Yap" butonuyla yapılır
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                window.location.href = 'https://doruklu.com';
            });
        }
    });
}
