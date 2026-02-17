// =============================================
// GrabMaR - Calculator Logic + Save
// =============================================

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const digitalInputs = document.querySelectorAll('[data-digital]');
    const cashInputs = document.querySelectorAll('[data-cash]');
    const totalDigitalEl = document.getElementById('total-digital');
    const totalCashEl = document.getElementById('total-cash');
    const btnCalculate = document.getElementById('btn-calculate');
    const resultSection = document.getElementById('result-section');
    const resultDigital = document.getElementById('result-digital');
    const resultCash = document.getElementById('result-cash');
    const resultTotal = document.getElementById('result-total');
    const btnSave = document.getElementById('btn-save');
    const saveAlert = document.getElementById('save-alert');

    let hasCalculated = false;

    // Format number to Rupiah
    function formatRupiah(number) {
        return 'Rp ' + new Intl.NumberFormat('id-ID').format(number);
    }

    // Calculate total digital money
    function calculateDigital() {
        let total = 0;
        digitalInputs.forEach(input => {
            const value = parseFloat(input.value) || 0;
            total += value;
        });
        totalDigitalEl.textContent = formatRupiah(total);
        return total;
    }

    // Calculate total cash money
    function calculateCash() {
        let total = 0;
        cashInputs.forEach(input => {
            const nominal = parseInt(input.dataset.nominal);
            const qty = parseInt(input.value) || 0;
            const subtotal = nominal * qty;
            total += subtotal;

            const subEl = document.getElementById('sub-' + nominal);
            if (subEl) {
                subEl.textContent = '= ' + formatRupiah(subtotal);
                if (subtotal > 0) {
                    subEl.classList.add('has-value');
                } else {
                    subEl.classList.remove('has-value');
                }
            }
        });

        // Add manual cash
        const manualCash = parseFloat(document.getElementById('cash-manual').value) || 0;
        total += manualCash;

        totalCashEl.textContent = formatRupiah(total);
        return total;
    }

    // Live update on digital inputs
    digitalInputs.forEach(input => {
        input.addEventListener('input', () => calculateDigital());
    });

    // Live update on cash inputs
    cashInputs.forEach(input => {
        input.addEventListener('input', () => calculateCash());
    });

    // Live update on manual cash
    document.getElementById('cash-manual').addEventListener('input', () => calculateCash());

    // Calculate button
    btnCalculate.addEventListener('click', () => {
        const totalDigital = calculateDigital();
        const totalCash = calculateCash();
        const grandTotal = totalDigital + totalCash;

        resultDigital.textContent = formatRupiah(totalDigital);
        resultCash.textContent = formatRupiah(totalCash);
        resultTotal.textContent = formatRupiah(grandTotal);

        // Show result section
        if (resultSection.classList.contains('hidden')) {
            resultSection.classList.remove('hidden');
            resultSection.style.animation = 'none';
            resultSection.offsetHeight;
            resultSection.style.animation = '';
        } else {
            resultSection.style.animation = 'none';
            resultSection.offsetHeight;
            resultSection.style.animation = '';
        }

        hasCalculated = true;

        // Show save button if logged in
        if (typeof isLoggedIn === 'function' && isLoggedIn() && btnSave) {
            btnSave.classList.remove('hidden');
        }

        // Scroll to result
        setTimeout(() => {
            resultSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    });

    // Save earning button
    if (btnSave) {
        btnSave.addEventListener('click', async () => {
            if (!hasCalculated) return;

            btnSave.disabled = true;
            btnSave.textContent = '⏳ Menyimpan...';

            const data = {
                dompet_kredit: parseFloat(document.getElementById('dompet-kredit').value) || 0,
                dompet_tunai: parseFloat(document.getElementById('dompet-tunai').value) || 0,
                ovo_cash: parseFloat(document.getElementById('ovo-cash').value) || 0,
                cash_100k: parseInt(document.getElementById('cash-100000').value) || 0,
                cash_50k: parseInt(document.getElementById('cash-50000').value) || 0,
                cash_20k: parseInt(document.getElementById('cash-20000').value) || 0,
                cash_10k: parseInt(document.getElementById('cash-10000').value) || 0,
                cash_5k: parseInt(document.getElementById('cash-5000').value) || 0,
                cash_2k: parseInt(document.getElementById('cash-2000').value) || 0,
                cash_1k: parseInt(document.getElementById('cash-1000').value) || 0,
                cash_manual: parseFloat(document.getElementById('cash-manual').value) || 0,
                total_digital: calculateDigital(),
                total_cash: calculateCash(),
                total_all: calculateDigital() + calculateCash()
            };

            try {
                const res = await fetchWithAuth('/api/save-earning.php', {
                    method: 'POST',
                    body: JSON.stringify(data)
                });

                const result = await res.json();

                if (res.ok) {
                    showSaveAlert('✅ Pendapatan berhasil disimpan!', 'success');
                } else {
                    showSaveAlert('❌ ' + (result.error || 'Gagal menyimpan'), 'error');
                }
            } catch (err) {
                showSaveAlert('❌ Terjadi kesalahan koneksi', 'error');
            } finally {
                btnSave.disabled = false;
                btnSave.textContent = '💾 Simpan Pendapatan';
            }
        });
    }

    function showSaveAlert(msg, type) {
        if (!saveAlert) return;
        saveAlert.className = 'mb-5 p-3 rounded-xl text-sm font-medium';
        if (type === 'error') {
            saveAlert.classList.add('bg-red-500/10', 'text-red-400', 'border', 'border-red-500/20');
        } else {
            saveAlert.classList.add('bg-green-500/10', 'text-green-400', 'border', 'border-green-500/20');
        }
        saveAlert.textContent = msg;
        saveAlert.classList.remove('hidden');

        // Auto-hide after 4 seconds
        setTimeout(() => {
            saveAlert.classList.add('hidden');
        }, 4000);
    }
});
