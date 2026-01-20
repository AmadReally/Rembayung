/* ============================================
   REMBAYUNG - Security Protection Script
   ============================================ */

(function () {
    'use strict';

    // ===== Disable Right Click =====
    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        showSecurityWarning();
        return false;
    });

    // ===== Disable Keyboard Shortcuts =====
    document.addEventListener('keydown', function (e) {
        // F12
        if (e.key === 'F12' || e.keyCode === 123) {
            e.preventDefault();
            showSecurityWarning();
            return false;
        }

        // Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.keyCode === 73)) {
            e.preventDefault();
            showSecurityWarning();
            return false;
        }

        // Ctrl+Shift+J (Console)
        if (e.ctrlKey && e.shiftKey && (e.key === 'J' || e.key === 'j' || e.keyCode === 74)) {
            e.preventDefault();
            showSecurityWarning();
            return false;
        }

        // Ctrl+Shift+C (Inspect Element)
        if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c' || e.keyCode === 67)) {
            e.preventDefault();
            showSecurityWarning();
            return false;
        }

        // Ctrl+U (View Source)
        if (e.ctrlKey && (e.key === 'U' || e.key === 'u' || e.keyCode === 85)) {
            e.preventDefault();
            showSecurityWarning();
            return false;
        }

        // Ctrl+S (Save Page)
        if (e.ctrlKey && (e.key === 'S' || e.key === 's' || e.keyCode === 83)) {
            e.preventDefault();
            return false;
        }
    });

    // ===== Disable Text Selection (Optional) =====
    document.addEventListener('selectstart', function (e) {
        // Allow selection in form inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return true;
        }
        // Prevent selection elsewhere
        // Uncomment next line to enable
        // e.preventDefault();
    });

    // ===== Disable Drag =====
    document.addEventListener('dragstart', function (e) {
        e.preventDefault();
        return false;
    });

    // ===== DevTools Detection =====
    let devToolsOpen = false;
    const threshold = 160;

    const checkDevTools = function () {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;

        if (widthThreshold || heightThreshold) {
            if (!devToolsOpen) {
                devToolsOpen = true;
                showDevToolsWarning();
            }
        } else {
            devToolsOpen = false;
        }
    };

    // Check periodically
    setInterval(checkDevTools, 1000);

    // ===== Show Security Warning =====
    function showSecurityWarning() {
        // Remove existing warning
        const existing = document.getElementById('security-warning');
        if (existing) existing.remove();

        const warning = document.createElement('div');
        warning.id = 'security-warning';
        warning.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                animation: fadeIn 0.3s ease;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 20px;
                    text-align: center;
                    max-width: 400px;
                ">
                    <div style="margin-bottom: 20px;"><img src="assets/icons/star.png" alt="" style="width: 60px; height: 60px;"></div>
                    <h2 style="color: #2C1810; margin-bottom: 10px;">Akses Dihalang</h2>
                    <p style="color: #666; margin-bottom: 20px;">
                        Tindakan ini tidak dibenarkan. Laman web ini dilindungi.
                    </p>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                        background: linear-gradient(135deg, #D4A574, #B8956A);
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 30px;
                        font-size: 16px;
                        cursor: pointer;
                    ">
                        Faham
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(warning);
    }

    // ===== Show DevTools Warning =====
    function showDevToolsWarning() {
        console.clear();
        console.log('%c⚠️ AMARAN KESELAMATAN', 'color: red; font-size: 40px; font-weight: bold;');
        console.log('%cLaman web ini dilindungi. Sebarang percubaan untuk mengakses atau mengubah kod adalah dilarang.', 'color: #666; font-size: 16px;');
        console.log('%c© 2026 Rembayung. Hak Cipta Terpelihara.', 'color: #D4A574; font-size: 14px;');
    }

    // ===== Disable Copy (Optional) =====
    document.addEventListener('copy', function (e) {
        // Allow copy in form inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return true;
        }
        // Uncomment to prevent copying
        // e.preventDefault();
    });

    // ===== Clear Console on Load =====
    console.clear();
    showDevToolsWarning();

})();
