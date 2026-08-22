import { supabase, AppState } from 'https://cdn.doruklu.com/supabase-config.js';
import { ui as globalUI } from 'https://cdn.doruklu.com/ui.js';
import { initSubdomainAuth } from 'https://cdn.doruklu.com/auth.js';

export async function initAuth() {
    await initSubdomainAuth('ozgur_dashboard', (user, profile) => {
        const appContent = document.getElementById('dashboard-screen');
        if (appContent) appContent.style.display = 'flex';

        // Global Header
        // Rozet artık CDN auth.js tarafından, onSuccess'ten SONRA render ediliyor
        // (performGlobalLogout callback'iyle). Buradaki ikinci çağrı kaldırıldı —
        // yerel kopya çıkış sırasını yanlış yapıyordu (clearAllCaches, signOut'tan önce).
        globalUI.renderGlobalHeader("Özgür");
    });
}
