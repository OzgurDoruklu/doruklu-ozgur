import { supabase, AppState } from './supabase-config.js';
import { ui } from './ui.js';
import { initDashboard } from './dashboard.js';

export async function initAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        await handleLoginSuccess(session.user);
    } else {
        ui.showScreen('auth-screen');
    }

    document.getElementById('login-btn').addEventListener('click', handleLogin);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
}

async function handleLogin() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    ui.setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    ui.setLoading(false);

    if (error) {
        ui.showError(error.message);
    } else {
        await handleLoginSuccess(data.user);
    }
}

async function handleLoginSuccess(user) {
    AppState.user = user;
    
    // Profili çek ve admin yetkisi kontrol et
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
        
    if (profile && profile.role === 'admin') {
        AppState.profile = profile;
        document.getElementById('admin-name').textContent = profile.display_name || user.email;
        ui.showScreen('dashboard-screen');
        initDashboard();
    } else {
        ui.showError('Bu panele sadece adminler erişebilir.');
        await supabase.auth.signOut();
        AppState.user = null;
    }
}

async function handleLogout() {
    await supabase.auth.signOut();
    AppState.user = null;
    AppState.profile = null;
    ui.showScreen('auth-screen');
}
