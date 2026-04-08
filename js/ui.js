export const ui = {
    showScreen: (screenId) => {
        const screens = ['auth-screen', 'dashboard-screen'];
        screens.forEach(s => {
            document.getElementById(s).style.display = s === screenId ? 'flex' : 'none';
        });
    },
    
    showSection: (sectionId) => {
        const sections = ['stats-section', 'cards-section'];
        sections.forEach(s => {
            document.getElementById(s).style.display = s === sectionId ? 'block' : 'none';
        });
        
        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
        document.getElementById(`nav-${sectionId}`).classList.add('active');
    },

    showError: (msg) => {
        const el = document.getElementById('alert-box');
        el.className = 'alert error show';
        el.textContent = msg;
        setTimeout(() => el.classList.remove('show'), 3000);
    },

    showSuccess: (msg) => {
        const el = document.getElementById('alert-box');
        el.className = 'alert success show';
        el.textContent = msg;
        setTimeout(() => el.classList.remove('show'), 3000);
    },

    setLoading: (isLoading) => {
        const spinner = document.getElementById('loading-spinner');
        spinner.style.display = isLoading ? 'flex' : 'none';
    }
};
