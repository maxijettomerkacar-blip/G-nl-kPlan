document.addEventListener('DOMContentLoaded', function() {
    const scheduleData = [
        // Sabah: Kişisel Gelişim ve Aile
        { start: '05:30', end: '06:00', category: 'health', title: 'Uyanma ve Güne Başlangıç', description: 'Su iç, 5-10 dk meditasyon, günün planını gözden geçir.' },
        { start: '06:00', end: '08:00', category: 'personal', title: 'Odaklanmış Bireysel Gelişim', description: 'Dil çalışması, kitap okuma veya stratejik düşünme.' },
        { start: '08:00', end: '09:00', category: 'family', title: 'Aile Zamanı', description: 'Kahvaltı ve çocukları okula hazırlama.' },
        { start: '09:00', end: '09:30', category: 'work', title: 'Hazırlık ve Geçiş', description: 'Toplantı için zihinsel ve fiziksel hazırlık.' },
        
        // Öğleden Önce: Odaklanmış İş
        { start: '09:30', end: '11:30', category: 'work', title: 'LeaderCoders Toplantı Bloğu', description: 'Ekip senkronizasyonu ve strateji toplantısı.' },
        { start: '11:30', end: '13:20', category: 'work', title: 'Derin Çalışma Bloğu', description: 'Yazılım, kodlama veya önemli iş görevleri.' },
        
        // Öğleden Sonra: Yenilenme ve Aile
        { start: '12:30', end: '13:20', category: 'family', title: 'Öğle Yemeği (Opsiyonel)', description: 'Çocuklarla birlikte öğle yemeği.' },
        { start: '13:20', end: '14:30', category: 'health', title: 'Spor ve Enerji Tazeleme', description: 'Haftada 4 gün egzersiz. Diğer günler dinlenme veya yürüyüş.' },
        { start: '14:30', end: '15:00', category: 'personal', title: 'Toparlanma ve Geçiş', description: 'Duş ve çocukları okula hazırlık.' },
        { start: '15:00', end: '17:00', category: 'family', title: 'Aile Odaklı Zaman', description: 'Çocukları okuldan alma, oyun ve sohbet.' },

        // Akşam: Yoğun Çalışma ve Kapanış
        { start: '17:00', end: '22:00', category: 'work', title: 'LeaderCoders Ders Bloğu', description: 'Aktif ders ve eğitim saatleri.' },
        { start: '21:00', end: '22:00', category: 'work', title: 'MaxiJett Saha Çalışması (Değişken)', description: 'Derslerin erken bittiği günler için planlanır.' },
        { start: '22:00', end: '23:00', category: 'family', title: 'Günü Kapatma ve Dinlenme', description: 'Eş ile sohbet, ekranlardan uzaklaşma.' },
        { start: '23:00', end: '23:30', category: 'personal', title: 'Uykuya Hazırlık', description: 'Yarının planını gözden geçirme, 15 dk kitap okuma.' },
        { start: '23:30', end: '05:30', category: 'health', title: 'Uyku', description: 'Minimum 6 saat kaliteli uyku.' },
    ];

    const container = document.getElementById('schedule-container');
    const savedStates = JSON.parse(localStorage.getItem('taskStates')) || {};

    // Planı HTML olarak oluştur
    scheduleData.forEach((item, index) => {
        const itemEl = document.createElement('div');
        itemEl.classList.add('schedule-item');
        itemEl.dataset.startTime = item.start;
        itemEl.dataset.endTime = item.end;
        itemEl.dataset.category = item.category;
        itemEl.id = `task-${index}`;

        const isChecked = savedStates[itemEl.id] || false;

        itemEl.innerHTML = `
            <div class="item-time">${item.start} - ${item.end}</div>
            <div class="item-content">
                <h3 class="item-title">${item.title}</h3>
                <p class="item-description">${item.description}</p>
            </div>
            <div class="item-actions">
                <input type="checkbox" class="complete-checkbox" id="check-${index}" ${isChecked ? 'checked' : ''}>
            </div>
        `;
        
        container.appendChild(itemEl);

        if (isChecked) {
            itemEl.classList.add('completed');
        }
    });

    // Onay kutusu (checkbox) dinleyicileri
    document.querySelectorAll('.complete-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const parentItem = this.closest('.schedule-item');
            parentItem.classList.toggle('completed', this.checked);
            savedStates[parentItem.id] = this.checked;
            localStorage.setItem('taskStates', JSON.stringify(savedStates));
        });
    });

    // Mevcut saati vurgulama fonksiyonu
    function updateCurrentTask() {
        const now = new Date();
        const currentTime = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        
        let currentTaskEl = null;

        document.querySelectorAll('.schedule-item').forEach(item => {
            item.classList.remove('current');
            const start = item.dataset.startTime;
            const end = item.dataset.endTime;

            // Gece yarısını geçen zaman dilimlerini (örn: 23:30 - 05:30) kontrol et
            if (start > end) { 
                if (currentTime >= start || currentTime < end) {
                    item.classList.add('current');
                    currentTaskEl = item;
                }
            } else {
                if (currentTime >= start && currentTime < end) {
                    item.classList.add('current');
                    currentTaskEl = item;
                }
            }
        });

        // Sayfa ilk yüklendiğinde mevcut göreve odaklan
        if (currentTaskEl && !document.body.dataset.scrolled) {
            currentTaskEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            document.body.dataset.scrolled = 'true';
        }
    }
    
    // Tarihi ayarla
    function setCurrentDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        document.getElementById('current-date').innerText = now.toLocaleDateString('tr-TR', options);
    }

    setCurrentDate();
    updateCurrentTask();
    // Her dakika kontrol et
    setInterval(updateCurrentTask, 60000);
});