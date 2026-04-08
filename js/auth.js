import { supabase } from 'https://cdn.doruklu.com/supabase-config.js';

export async function initAuth() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = 'flex';
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        if (spinner) spinner.style.display = 'none';
        
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                window.location.href = 'https://doruklu.com';
            });
        }
    } else {
        window.location.href = 'https://doruklu.com/?redirect_to=' + encodeURIComponent(window.location.href);
    }
}
