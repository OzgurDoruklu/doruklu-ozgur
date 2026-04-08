import { supabase } from 'https://cdn.doruklu.com/supabase-config.js';
import { ui as globalUI } from 'https://cdn.doruklu.com/ui.js';

export async function initAuth() {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = 'flex';
    
    supabase.auth.onAuthStateChange(async (event, session) => {
        if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && session) {
            await handleLogin(session);
        }
    });

    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        await handleLogin(session);
    } else {
        if (!window.location.hash.includes('access_token')) {
            window.location.href = 'https://doruklu.com/?redirect_to=' + encodeURIComponent(window.location.href);
        }
    }
let _isLoggedIn = false;
async function handleLogin(session) {
    if (_isLoggedIn) return;
    _isLoggedIn = true;
    const spinner = document.getElementById('loading-spinner');
    if (spinner) spinner.style.display = 'none';
        
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
    globalUI.renderUserBadge(session.user, profile, async () => {
        await supabase.auth.signOut();
        window.location.href = 'https://doruklu.com';
    });
        
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'https://doruklu.com';
        });
    }
}
