// Age Calculator JavaScript - Indonesian Version (Modified)

// Global variables
let countdownInterval;

// Get DOM elements
const birthDateInput = document.getElementById('birthDate');
const resultsContainer = document.getElementById('resultsContainer');
const errorAlert = document.getElementById('errorAlert');
const errorMessage = document.getElementById('errorMessage');

// Result elements
const yearsValue = document.getElementById('yearsValue');
const monthsValue = document.getElementById('monthsValue');
const daysValue = document.getElementById('daysValue');
const totalWeeks = document.getElementById('totalWeeks');
const totalDays = document.getElementById('totalDays');
const totalHours = document.getElementById('totalHours');
const totalMinutes = document.getElementById('totalMinutes');
const totalSeconds = document.getElementById('totalSeconds'); // Added seconds element
const birthdayCountdown = document.getElementById('birthdayCountdown');

// Indonesian month names
const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Kalkulator Usia diinisialisasi');
    
    // Set max date to today
    birthDateInput.max = new Date().toISOString().split('T')[0];
    
    // Add event listener for date change to auto-calculate
    birthDateInput.addEventListener('change', calculateAge);
    birthDateInput.addEventListener('keypress', handleKeyPress);
    
    // Set initial displayed date format for the input field
    handleDateInputInit();
});

// Handle Enter key press
function handleKeyPress(e) {
    if (e.key === 'Enter') {
        calculateAge();
    }
}

// Initialize date input with a more user-friendly format display
function handleDateInputInit() {
    // Add an event listener to format the date when focus leaves the input
    birthDateInput.addEventListener('blur', function() {
        if (this.value) {
            const selectedDate = new Date(this.value);
            console.log('Selected date for formatting:', selectedDate);
            
            // Create a formatted display of the date (this won't change the actual value)
            const formattedDate = formatDateText(selectedDate);
            console.log('Formatted date for display:', formattedDate);
            
            // Add a data attribute to show the formatted date in a tooltip or nearby element
            this.setAttribute('data-formatted-date', formattedDate);
            
            // Display the formatted date somewhere near the input
            const dateDisplayElement = document.getElementById('formattedDateDisplay');
            if (dateDisplayElement) {
                dateDisplayElement.textContent = formattedDate;
                dateDisplayElement.classList.remove('d-none');
            }
        }
    });
}

// Format date to "D Month, Yr" format (17 February, 2009)
function formatDateText(date) {
    const day = date.getDate(); // No leading zeros
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    
    return `${day} ${month}, ${year}`;
}

// Main calculation function
function calculateAge() {
    console.log('Memulai perhitungan usia...');
    
    // Clear previous interval
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Get birth date value
    const birthDateValue = birthDateInput.value;
    
    // Hide previous results and errors
    hideResults();
    hideError();
    
    // Validation
    if (!birthDateValue) {
        showError('Silakan masukkan tanggal lahir Anda.');
        return;
    }
    
    const birthDate = new Date(birthDateValue);
    const now = new Date();
    
    if (birthDate > now) {
        showError('Tanggal lahir tidak boleh di masa depan.');
        return;
    }
    
    // Calculate age components
    const ageData = calculateAgeComponents(birthDate, now);
    
    // Display results
    displayResults(ageData);
    
    // Start birthday countdown
    startCountdown(birthDate, now);
    
    // Show results with animation
    showResults();
    
    console.log('Perhitungan usia selesai:', ageData);
    console.log('Tanggal lahir (format baru):', formatDateText(birthDate));
}

// Calculate age components
function calculateAgeComponents(birthDate, now) {
    // The calculation starts with years, months, days in that order
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    
    // Adjust for negative days
    if (days < 0) {
        months--;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
    }
    
    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Calculate additional units
    const diffMs = now - birthDate;
    const totalSecondsValue = Math.floor(diffMs / 1000);
    const totalMinutesValue = Math.floor(diffMs / (1000 * 60));
    const totalHoursValue = Math.floor(diffMs / (1000 * 60 * 60));
    const totalDaysValue = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const totalWeeksValue = Math.floor(totalDaysValue / 7);
    
    return {
        years,
        months,
        days,
        totalWeeks: totalWeeksValue,
        totalDays: totalDaysValue,
        totalHours: totalHoursValue,
        totalMinutes: totalMinutesValue,
        totalSeconds: totalSecondsValue
    };
}

// Display results
function displayResults(data) {
    // Animate counter effect - Note the order is now years, months, days (in the UI)
    animateValue(yearsValue, 0, data.years, 1000);
    animateValue(monthsValue, 0, data.months, 1000);
    animateValue(daysValue, 0, data.days, 1000);
    
    // Display detailed statistics in new order: weeks, days, hours, minutes, seconds
    totalWeeks.textContent = data.totalWeeks.toLocaleString('id-ID');
    totalDays.textContent = data.totalDays.toLocaleString('id-ID');
    totalHours.textContent = data.totalHours.toLocaleString('id-ID');
    totalMinutes.textContent = data.totalMinutes.toLocaleString('id-ID');
    if (totalSeconds) {
        totalSeconds.textContent = data.totalSeconds.toLocaleString('id-ID');
    }
}

// Animate value changes
function animateValue(element, start, end, duration) {
    const startTimestamp = Date.now();
    const step = (timestamp) => {
        const progress = Math.min((Date.now() - startTimestamp) / duration, 1);
        element.textContent = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Start birthday countdown
function startCountdown(birthDate, now) {
    let nextBirthday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
    
    if (now > nextBirthday) {
        nextBirthday.setFullYear(now.getFullYear() + 1);
    }
    
    function updateCountdown() {
        const currentTime = new Date();
        const diff = nextBirthday - currentTime;
        
        if (diff <= 0) {
            birthdayCountdown.innerHTML = '<span class="text-warning">🎉 Selamat Ulang Tahun! 🎂</span>';
            clearInterval(countdownInterval);
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        birthdayCountdown.innerHTML = `${days}h ${hours}j ${minutes}m ${seconds}d`;
    }
    
    // Initial update
    updateCountdown();
    
    // Update every second
    countdownInterval = setInterval(updateCountdown, 1000);
}

// Show results
function showResults() {
    resultsContainer.classList.remove('d-none');
    resultsContainer.classList.add('fade-in');
}

// Hide results
function hideResults() {
    resultsContainer.classList.add('d-none');
    resultsContainer.classList.remove('fade-in');
}

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorAlert.classList.remove('d-none');
    console.error('Error validasi:', message);
}

// Hide error message
function hideError() {
    errorAlert.classList.add('d-none');
}

// Add fade-in animation class
resultsContainer.addEventListener('animationend', function() {
    this.classList.remove('fade-in');
});