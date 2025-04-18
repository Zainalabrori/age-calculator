// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});

// Tab Switching
const tabAge = document.getElementById('tabAge');
const tabBirth = document.getElementById('tabBirth');
const ageCalculator = document.getElementById('ageCalculator');
const birthCalculator = document.getElementById('birthCalculator');

tabAge.addEventListener('click', () => {
  // Aktifkan tab umur
  tabAge.classList.add('text-blue-600', 'dark:text-blue-400', 'bg-white', 'dark:bg-gray-800', 'border-b-2', 'border-blue-600', 'dark:border-blue-400');
  tabAge.classList.remove('text-gray-600', 'dark:text-gray-400', 'bg-gray-100', 'dark:bg-gray-700');
  
  // Nonaktifkan tab tanggal lahir
  tabBirth.classList.add('text-gray-600', 'dark:text-gray-400', 'bg-gray-100', 'dark:bg-gray-700');
  tabBirth.classList.remove('text-blue-600', 'dark:text-blue-400', 'bg-white', 'dark:bg-gray-800', 'border-b-2', 'border-blue-600', 'dark:border-blue-400');
  
  // Tampilkan kalkulator umur, sembunyikan kalkulator tanggal lahir
  ageCalculator.classList.remove('hidden');
  birthCalculator.classList.add('hidden');
});

tabBirth.addEventListener('click', () => {
  // Aktifkan tab tanggal lahir
  tabBirth.classList.add('text-blue-600', 'dark:text-blue-400', 'bg-white', 'dark:bg-gray-800', 'border-b-2', 'border-blue-600', 'dark:border-blue-400');
  tabBirth.classList.remove('text-gray-600', 'dark:text-gray-400', 'bg-gray-100', 'dark:bg-gray-700');
  
  // Nonaktifkan tab umur
  tabAge.classList.add('text-gray-600', 'dark:text-gray-400', 'bg-gray-100', 'dark:bg-gray-700');
  tabAge.classList.remove('text-blue-600', 'dark:text-blue-400', 'bg-white', 'dark:bg-gray-800', 'border-b-2', 'border-blue-600', 'dark:border-blue-400');
  
  // Tampilkan kalkulator tanggal lahir, sembunyikan kalkulator umur
  birthCalculator.classList.remove('hidden');
  ageCalculator.classList.add('hidden');
});

// KALKULATOR UMUR
let countdownInterval;

// Fungsi untuk mendapatkan teks berdasarkan bahasa aktif
function getText(key) {
  const currentLang = localStorage.getItem('preferredLanguage') || 'id';
  return translations[currentLang][key] || '';
}

function recalculateAge() {
  const dobInput = document.getElementById('dob').value;
  if (!dobInput) return;
  
  calculateAge(dobInput);
}

function calculateAge(dobInput) {
  // Hentikan interval countdown jika sebelumnya sudah berjalan
  if (countdownInterval) clearInterval(countdownInterval);

  const resultEl = document.getElementById('result');
  const countdownEl = document.getElementById('countdown');

  if (!dobInput) {
    resultEl.textContent = getText('error_no_dob');
    countdownEl.textContent = '';
    return;
  }

  const birthDate = new Date(dobInput);
  const now = new Date();

  if (birthDate > now) {
    resultEl.textContent = getText('error_future_date');
    countdownEl.textContent = '';
    return;
  }

  // Perhitungan Umur: Tahun, Bulan, Hari
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  let days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // Hitung total selisih waktu dalam milidetik
  const diffMs = now - birthDate;
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(totalDays / 7);
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor(diffMs / (1000 * 60));
  const seconds = Math.floor(diffMs / 1000);

  // Dapatkan teks yang lokalisasi
  const yearsText = getText('years_text');
  const monthsText = getText('months_text');
  const daysText = getText('days_text');
  const weeksText = getText('weeks_text');
  const hoursText = getText('hours_text');
  const minutesText = getText('minutes_text');
  const secondsText = getText('seconds_text');
  const andText = getText('and_text');
  
  resultEl.innerHTML = `
    <p>${getText('age_result_prefix')}</p>
    <p class="mt-2">${years} ${yearsText}, ${months} ${monthsText}, ${andText} ${days} ${daysText}.</p>
    <p class="mt-2">${getText('age_result_or')}</p>
    <p class="mt-2">${weeks} ${weeksText}, ${hours} ${hoursText}, ${minutes} ${minutesText}, ${andText} ${seconds} ${secondsText}.</p>
  `;

  // Hitungan Mundur Ulang Tahun Berikutnya
  let nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  if (now > nextBirthday) { 
    nextBirthday.setFullYear(now.getFullYear() + 1);
  }

  function updateCountdown() {
    const currentTime = new Date();
    const diff = nextBirthday - currentTime;

    if (diff <= 0) {
      countdownEl.textContent = getText('happy_birthday');
      clearInterval(countdownInterval);
      return;
    }

    const cdDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    const cdHours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const cdMinutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const cdSeconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysText = getText('days_text');
    const hoursText = getText('hours_text');
    const minutesText = getText('minutes_text');
    const secondsText = getText('seconds_text');

    countdownEl.innerHTML = `
      <p>${getText('countdown_prefix')}</p>
      <p class="mt-2">${cdDays} ${daysText}, ${cdHours} ${hoursText}, ${cdMinutes} ${minutesText}, ${cdSeconds} ${secondsText}.</p>
    `;
  }

  // Panggil fungsi updateCountdown untuk update segera dan setiap detik
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

document.getElementById('calculateBtn').addEventListener('click', function () {
  const dobInput = document.getElementById('dob').value;
  calculateAge(dobInput);
});

// KALKULATOR TANGGAL LAHIR
function recalculateBirthDate() {
  const yearsInput = document.getElementById('years').value;
  const monthsInput = document.getElementById('months').value;
  const daysInput = document.getElementById('days').value;
  const ageInput = document.getElementById('ageInput').value;
  
  if ((yearsInput || monthsInput || daysInput) || ageInput.trim() !== '') {
    findBirthDate(yearsInput, monthsInput, daysInput, ageInput);
  }
}

function findBirthDate(yearsInput, monthsInput, daysInput, ageInput) {
  const birthResult = document.getElementById('birthResult');
  
  let years = 0, months = 0, days = 0;
  
  // Cek apakah menggunakan input teks atau input numerik
  if (ageInput.trim() !== '') {
    // Parsing string input berdasarkan bahasa
    const currentLang = localStorage.getItem('preferredLanguage') || 'id';
    const yearsText = translations[currentLang]['years_text'];
    const monthsText = translations[currentLang]['months_text'];
    const daysText = translations[currentLang]['days_text'];
    
    // Buat regex dinamis berdasarkan teks bahasa
    const yearPattern = `(\\d+)\\s*${yearsText}`;
    const monthPattern = `(\\d+)\\s*${monthsText}`;
    const dayPattern = `(\\d+)\\s*${daysText}`;
    
    // Ekstrak angka tahun
    const yearMatch = new RegExp(yearPattern).exec(ageInput);
    if (yearMatch) years = parseInt(yearMatch[1]);
    
    // Ekstrak angka bulan
    const monthMatch = new RegExp(monthPattern).exec(ageInput);
    if (monthMatch) months = parseInt(monthMatch[1]);
    
    // Ekstrak angka hari
    const dayMatch = new RegExp(dayPattern).exec(ageInput);
    if (dayMatch) days = parseInt(dayMatch[1]);
  } else {
    // Menggunakan input numerik
    years = yearsInput ? parseInt(yearsInput) : 0;
    months = monthsInput ? parseInt(monthsInput) : 0;
    days = daysInput ? parseInt(daysInput) : 0;
  }
  
  if (years === 0 && months === 0 && days === 0) {
    birthResult.textContent = getText('error_no_age');
    return;
  }
  
  // Hitung tanggal lahir berdasarkan umur
  const now = new Date();
  let birthYear = now.getFullYear() - years;
  let birthMonth = now.getMonth() - months;
  let birthDay = now.getDate() - days;
  
  // Sesuaikan jika ada nilai negatif
  while (birthDay < 1) {
    birthMonth--;
    const tempDate = new Date(birthYear, birthMonth + 1, 0);
    birthDay += tempDate.getDate();
  }
  
  while (birthMonth < 0) {
    birthYear--;
    birthMonth += 12;
  }
  
  // Format tanggal lahir berdasarkan bahasa
  const birthDate = new Date(birthYear, birthMonth, birthDay);
  const currentLang = localStorage.getItem('preferredLanguage') || 'id';
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = birthDate.toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US', options);
  
  const yearsText = getText('years_text');
  const monthsText = getText('months_text');
  const daysText = getText('days_text');
  
  birthResult.innerHTML = `
    <p>${getText('birth_date_prefix')} ${years} ${yearsText}, ${months} ${monthsText}, ${days} ${daysText}, ${getText('birth_date_suffix')}</p>
    <p class="mt-3 text-blue-600 dark:text-blue-400">${formattedDate}</p>
  `;
  
  // Atur nilai input tanggal di tab pertama untuk memungkinkan pengecekan cepat
  const formattedDateValue = birthDate.toISOString().split('T')[0];
  document.getElementById('dob').value = formattedDateValue;
}

document.getElementById('findBirthBtn').addEventListener('click', function() {
  const yearsInput = document.getElementById('years').value;
  const monthsInput = document.getElementById('months').value;
  const daysInput = document.getElementById('days').value;
  const ageInput = document.getElementById('ageInput').value;
  
  findBirthDate(yearsInput, monthsInput, daysInput, ageInput);
});

// Event listener untuk input teks umur
document.getElementById('ageInput').addEventListener('input', function() {
  if (this.value.trim() !== '') {
    // Nonaktifkan input numerik jika input teks diisi
    document.getElementById('years').disabled = true;
    document.getElementById('months').disabled = true;
    document.getElementById('days').disabled = true;
  } else {
    // Aktifkan kembali input numerik jika input teks kosong
    document.getElementById('years').disabled = false;
    document.getElementById('months').disabled = false;
    document.getElementById('days').disabled = false;
  }
});

// Event listener untuk input numerik
const numericInputs = ['years', 'months', 'days'];
numericInputs.forEach(id => {
  document.getElementById(id).addEventListener('input', function() {
    if (document.getElementById('years').value !== '' || 
        document.getElementById('months').value !== '' || 
        document.getElementById('days').value !== '') {
      // Nonaktifkan input teks jika salah satu input numerik diisi
      document.getElementById('ageInput').disabled = true;
    } else {
      // Aktifkan kembali input teks jika semua input numerik kosong
      document.getElementById('ageInput').disabled = false;
    }
  });
});

// Cek dan setel preferensi dark mode dari localStorage
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'true') {
    document.documentElement.classList.add('dark');
  }
  
  // Simpan preferensi dark mode saat tombol diklik
  darkModeToggle.addEventListener('click', () => {
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark'));
  });
});