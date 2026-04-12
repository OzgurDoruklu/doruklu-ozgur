import { supabase, AppState } from 'https://cdn.doruklu.com/supabase-config.js';
import { ui as globalUI } from 'https://cdn.doruklu.com/ui.js';
import { initSubdomainAuth } from 'https://cdn.doruklu.com/auth.js';

export async function initAuth() {
    await initSubdomainAuth('ozgur_dashboard', (user, profile) => {
        // Login başarılı, app content göster
        const appContent = document.getElementById('dashboard-screen');
        if (appContent) appContent.style.display = 'flex';

        // Merkezi Sisteme Dön butonu
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async () => {
                await supabase.auth.signOut();
                window.location.href = 'https://doruklu.com';
            });
        }
    });
}
