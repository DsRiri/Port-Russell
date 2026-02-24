/**
 * Scripts principaux pour Port Russell API
 */

document.addEventListener('DOMContentLoaded', () => {
    // Auto-hide alerts après 5 secondes
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            alert.style.opacity = '0';
            setTimeout(() => alert.remove(), 500);
        }, 5000);
    });

    // Confirmation pour les actions de suppression
    document.querySelectorAll('.btn-danger').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!confirm('Êtes-vous sûr de vouloir supprimer ?')) {
                e.preventDefault();
            }
        });
    });

    // Validation des formulaires
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => {
            const password = form.querySelector('input[type="password"]');
            if (password && password.value.length < 6) {
                e.preventDefault();
                showError('Le mot de passe doit contenir au moins 6 caractères');
            }
        });
    });

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            btn.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
        });
    });

    // Formatage des dates
    document.querySelectorAll('.format-date').forEach(el => {
        const date = new Date(el.textContent);
        if (!isNaN(date)) {
            el.textContent = date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    });
});

function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-error';
    alert.innerHTML = `
        <span class="alert-icon">⚠️</span>
        <span>${message}</span>
    `;
    document.querySelector('main').prepend(alert);
    
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 500);
    }, 5000);
}

function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success';
    alert.innerHTML = `
        <span class="alert-icon">✅</span>
        <span>${message}</span>
    `;
    document.querySelector('main').prepend(alert);
    
    setTimeout(() => {
        alert.style.opacity = '0';
        setTimeout(() => alert.remove(), 500);
    }, 5000);
}

// Charger les statistiques pour le dashboard
async function loadStats() {
    try {
        const res = await fetch('/api/catways');
        const data = await res.json();
        
        if (data.success) {
            const statsContainer = document.querySelector('.stats-grid');
            if (statsContainer) {
                statsContainer.innerHTML = `
                    <div class="stat-card">
                        <span class="stat-number">${data.count}</span>
                        <span class="stat-label">Catways</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">${data.data.filter(c => c.type === 'long').length}</span>
                        <span class="stat-label">Longs</span>
                    </div>
                    <div class="stat-card">
                        <span class="stat-number">${data.data.filter(c => c.type === 'short').length}</span>
                        <span class="stat-label">Courts</span>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Erreur chargement stats:', error);
    }
}

// Recherche en temps réel
function initSearch(tableId, inputId, columnIndex = 0) {
    const input = document.getElementById(inputId);
    if (!input) return;

    input.addEventListener('keyup', () => {
        const search = input.value.toLowerCase();
        const rows = document.querySelectorAll(`#${tableId} tbody tr`);
        
        rows.forEach(row => {
            const text = row.cells[columnIndex].textContent.toLowerCase();
            row.style.display = text.includes(search) ? '' : 'none';
        });
    });
}

// Export des fonctions
window.portRussell = {
    showError,
    showSuccess,
    loadStats,
    initSearch
};