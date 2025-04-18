// Objek Lokalisasi - Kamus bahasa
const translations = {
    // Bahasa Indonesia
    'id': {
      'title': 'Kalkulator Umur',
      'tab_age': 'Hitung Umur',
      'tab_birth': 'Cari Tanggal Lahir',
      'dob_label': 'Masukkan Tanggal Lahir',
      'calculate_btn': 'Hitung Umur',
      'age_label': 'Masukkan Umur Anda',
      'years_label': 'Tahun',
      'months_label': 'Bulan',
      'days_label': 'Hari',
      'age_format_label': 'Atau masukkan langsung format "X tahun Y bulan Z hari"',
      'age_input_placeholder': 'contoh: 19 tahun 2 bulan 13 hari',
      'find_birth_btn': 'Cari Tanggal Lahir',
      'age_result_prefix': 'Umur Anda:',
      'age_result_or': 'Atau sekitar:',
      'countdown_prefix': 'Hitung Mundur Ulang Tahun Berikutnya:',
      'happy_birthday': 'Selamat ulang tahun!',
      'birth_date_prefix': 'Berdasarkan umur',
      'birth_date_suffix': 'Anda lahir pada:',
      'years_text': 'tahun',
      'months_text': 'bulan',
      'days_text': 'hari',
      'weeks_text': 'minggu',
      'hours_text': 'jam',
      'minutes_text': 'menit',
      'seconds_text': 'detik',
      'error_no_dob': 'Silakan masukkan tanggal lahir Anda.',
      'error_future_date': 'Tanggal lahir tidak boleh di masa depan.',
      'error_no_age': 'Silakan masukkan umur Anda.',
      'and_text': 'dan'
    },
    // Bahasa Inggris
    'en': {
      'title': 'Age Calculator',
      'tab_age': 'Calculate Age',
      'tab_birth': 'Find Birth Date',
      'dob_label': 'Enter Your Birth Date',
      'calculate_btn': 'Calculate Age',
      'age_label': 'Enter Your Age',
      'years_label': 'Years',
      'months_label': 'Months',
      'days_label': 'Days',
      'age_format_label': 'Or enter directly in format "X years Y months Z days"',
      'age_input_placeholder': 'example: 19 years 2 months 13 days',
      'find_birth_btn': 'Find Birth Date',
      'age_result_prefix': 'Your Age:',
      'age_result_or': 'Or approximately:',
      'countdown_prefix': 'Countdown to Your Next Birthday:',
      'happy_birthday': 'Happy birthday!',
      'birth_date_prefix': 'Based on the age of',
      'birth_date_suffix': 'you were born on:',
      'years_text': 'years',
      'months_text': 'months',
      'days_text': 'days',
      'weeks_text': 'weeks',
      'hours_text': 'hours',
      'minutes_text': 'minutes',
      'seconds_text': 'seconds',
      'error_no_dob': 'Please enter your birth date.',
      'error_future_date': 'Birth date cannot be in the future.',
      'error_no_age': 'Please enter your age.',
      'and_text': 'and'
    }
  };
  
  // Fungsi untuk menetapkan bahasa saat ini
  function setLanguage(lang) {
    // Simpan bahasa saat ini ke localStorage
    localStorage.setItem('preferredLanguage', lang);
    
    // Dapatkan semua elemen dengan atribut data-lang
    const elements = document.querySelectorAll('[data-lang]');
    
    // Atur teks untuk setiap elemen berdasarkan kunci lokasinya
    elements.forEach(element => {
      const key = element.getAttribute('data-lang');
      if (translations[lang] && translations[lang][key]) {
        element.textContent = translations[lang][key];
      }
    });
    
    // Atur placeholder untuk input yang memiliki atribut data-lang-placeholder
    const placeholderElements = document.querySelectorAll('[data-lang-placeholder]');
    placeholderElements.forEach(element => {
      const key = element.getAttribute('data-lang-placeholder');
      if (translations[lang] && translations[lang][key]) {
        element.placeholder = translations[lang][key];
      }
    });
    
    // Setel atribut lang pada elemen HTML
    document.documentElement.lang = lang;
    
    // Update hasil perhitungan jika ada
    updateUITexts(lang);
  }
  
  // Fungsi untuk mengupdate teks UI yang dihasilkan secara dinamis
  function updateUITexts(lang) {
    const resultEl = document.getElementById('result');
    const countdownEl = document.getElementById('countdown');
    const birthResultEl = document.getElementById('birthResult');
    
    // Update hasil perhitungan umur jika ada
    if (resultEl && resultEl.innerHTML.trim() !== '') {
      recalculateAge();
    }
    
    // Update hasil perhitungan tanggal lahir jika ada
    if (birthResultEl && birthResultEl.innerHTML.trim() !== '') {
      recalculateBirthDate();
    }
  }
  
  // Inisialisasi bahasa saat halaman dimuat
  document.addEventListener('DOMContentLoaded', () => {
    // Cek preferensi bahasa dari localStorage atau gunakan bahasa default 'id'
    const savedLanguage = localStorage.getItem('preferredLanguage') || 'id';
    
    // Setel nilai dropdown pemilih bahasa
    document.getElementById('languageSelector').value = savedLanguage;
    
    // Terapkan bahasa yang dipilih
    setLanguage(savedLanguage);
    
    // Tambahkan event listener untuk dropdown pemilih bahasa
    document.getElementById('languageSelector').addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  });