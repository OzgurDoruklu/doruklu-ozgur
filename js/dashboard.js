import { supabase } from './supabase-config.js';
import { ui } from './ui.js';

export async function initDashboard() {
    // Setup Navigation
    document.getElementById('nav-stats-section').addEventListener('click', () => ui.showSection('stats-section'));
    document.getElementById('nav-cards-section').addEventListener('click', () => ui.showSection('cards-section'));

    // Form Event Listeners
    document.getElementById('q-type').addEventListener('change', handleTypeChange);
    document.getElementById('add-card-form').addEventListener('submit', handleAddCard);

    // Initial load
    ui.setLoading(true);
    await Promise.all([loadStats(), loadCards()]);
    ui.setLoading(false);
}

// ================ STATS ================
async function loadStats() {
    const { data: sessions, error } = await supabase
        .from('game_sessions')
        .select(`
            *,
            profiles(display_name)
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
        return;
    }

    let totalDuration = 0;
    let totalQuestions = 0;
    let totalCorrect = 0;
    let typeStats = {};

    const tableBody = document.getElementById('sessions-table-body');
    tableBody.innerHTML = '';

    sessions.forEach(s => {
        totalDuration += s.duration_seconds;
        totalQuestions += s.total_questions;
        totalCorrect += s.correct_count;
        
        // Count question types played
        if (s.questions_answered) {
            s.questions_answered.forEach(type => {
                typeStats[type] = (typeStats[type] || 0) + 1;
            });
        }

        // populate recent sessions table
        tableBody.innerHTML += `
            <tr>
                <td>${new Date(s.created_at).toLocaleString('tr-TR')}</td>
                <td>${s.profiles?.display_name || 'Bilinmiyor'}</td>
                <td>${s.duration_seconds} sn</td>
                <td>${s.total_questions}</td>
                <td><span class="text-success">${s.correct_count}</span> / <span class="text-danger">${s.incorrect_count}</span></td>
                <td>${s.score_delta > 0 ? '+' : ''}${s.score_delta}</td>
            </tr>
        `;
    });

    document.getElementById('stat-total-sessions').textContent = sessions.length;
    document.getElementById('stat-total-duration').textContent = `${Math.floor(totalDuration/60)} dk ${totalDuration % 60} sn`;
    
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    document.getElementById('stat-accuracy').textContent = `%${accuracy}`;

    // Most played type
    let mostPlayedType = '-';
    let maxPlay = 0;
    Object.entries(typeStats).forEach(([type, count]) => {
        if (count > maxPlay) { maxPlay = count; mostPlayedType = type; }
    });
    
    const typeMapping = { 'single_choice': 'Tekli Seçim', 'multi_choice': 'Çoklu Seçim', 'free_text': 'Serbest Metin' };
    document.getElementById('stat-fav-type').textContent = typeMapping[mostPlayedType] || '-';
}

// ================ CARDS ================
async function loadCards() {
    const { data: cards, error } = await supabase
        .from('flashcards')
        .select('*')
        .order('created_at', { ascending: false });

    const tbody = document.getElementById('cards-table-body');
    tbody.innerHTML = '';

    if (cards) {
        const typeMapping = { 'single_choice': 'Tekli Seçim', 'multi_choice': 'Çoklu Seçim', 'free_text': 'Serbest Metin' };
        
        cards.forEach(card => {
            tbody.innerHTML += `
                <tr>
                    <td>${typeMapping[card.question_type]}</td>
                    <td>${card.content.substring(0, 30)}...</td>
                    <td>${JSON.stringify(card.correct_answer)}</td>
                    <td>
                        <button onclick="window.deleteCard('${card.id}')" class="btn-danger btn-sm">Sil</button>
                    </td>
                </tr>
            `;
        });
    }
}

function handleTypeChange() {
    const type = document.getElementById('q-type').value;
    const optionsGroup = document.getElementById('options-group');
    if (type === 'free_text') {
        optionsGroup.style.display = 'none';
        document.getElementById('q-answer').placeholder = 'Doğru cevap (Metin)';
    } else {
        optionsGroup.style.display = 'block';
        document.getElementById('q-answer').placeholder = 'Doğru cevap(lar) (Çoklu ise virgülle ayırın)';
    }
}

async function handleAddCard(e) {
    e.preventDefault();
    const type = document.getElementById('q-type').value;
    const content = document.getElementById('q-content').value;
    const optionsRaw = document.getElementById('q-options').value;
    const answerRaw = document.getElementById('q-answer').value;

    let options = null;
    let correctAnswer = null;

    if (type !== 'free_text') {
        options = optionsRaw.split(',').map(s => s.trim());
    }

    if (type === 'multi_choice') {
        correctAnswer = answerRaw.split(',').map(s => s.trim());
    } else {
        correctAnswer = answerRaw.trim();
    }

    ui.setLoading(true);
    const { error } = await supabase.from('flashcards').insert({
        question_type: type,
        content: content,
        options: options,
        correct_answer: correctAnswer
    });
    
    if (error) {
        ui.showError('Soru eklenemedi: ' + error.message);
    } else {
        ui.showSuccess('Soru başarıyla eklendi!');
        document.getElementById('add-card-form').reset();
        await loadCards(); // refresh
    }
    ui.setLoading(false);
}

window.deleteCard = async (id) => {
    if(!confirm("Bu soruyu silmek istediğinize emin misiniz?")) return;
    
    ui.setLoading(true);
    await supabase.from('flashcards').delete().eq('id', id);
    ui.showSuccess('Soru silindi');
    await loadCards();
    ui.setLoading(false);
};
