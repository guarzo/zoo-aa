/**
 * Zoo Landers Alliance Auth Custom JavaScript Enhancements
 * Corporation: Zoo Landers
 * Theme: Space Exploration Zoo
 */

(function() {
    'use strict';

    /**
     * Add "Flyga" watermark to pages
     */
    function addFlygaWatermark() {
        // Only add if it doesn't already exist
        if (document.querySelector('.zoo-flyga-watermark')) {
            return;
        }

        const flyga = document.createElement('div');
        flyga.className = 'zoo-flyga-watermark';
        flyga.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            opacity: 0.15;
            pointer-events: none;
            z-index: 9999;
            font-size: 48px;
            font-weight: bold;
            color: #1e90ff;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            font-family: 'Impact', 'Arial Black', sans-serif;
            transform: rotate(-15deg);
            transition: opacity 0.3s ease;
        `;
        flyga.textContent = 'Flyga';

        // Fade in effect
        flyga.style.opacity = '0';
        document.body.appendChild(flyga);

        setTimeout(function() {
            flyga.style.opacity = '0.15';
        }, 100);
    }

    /**
     * Animate sidebar icons on hover
     */
    function animateSidebarIcons() {
        const icons = document.querySelectorAll('.sidebar-menu .fa, .sidebar-menu .fas, .sidebar-menu .fab, .sidebar-menu .glyphicon');

        icons.forEach(function(icon) {
            // Ensure transition is set
            icon.style.transition = 'transform 0.3s ease, color 0.3s ease';

            // Get parent link
            const link = icon.closest('a');
            if (!link) return;

            link.addEventListener('mouseenter', function() {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            });

            link.addEventListener('mouseleave', function() {
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }

    /**
     * Add smooth scroll behavior to internal links
     */
    function enableSmoothScroll() {
        document.documentElement.style.scrollBehavior = 'smooth';
    }

    /**
     * Enhance button click feedback
     */
    function enhanceButtons() {
        const buttons = document.querySelectorAll('.btn');

        buttons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                // Add ripple effect
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    left: ${x}px;
                    top: ${y}px;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

                // Ensure button has relative positioning
                if (getComputedStyle(button).position === 'static') {
                    button.style.position = 'relative';
                }
                button.style.overflow = 'hidden';

                button.appendChild(ripple);

                setTimeout(function() {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple animation to stylesheet
        if (!document.getElementById('zoo-ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'zoo-ripple-styles';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Add loading state to forms
     */
    function enhanceForms() {
        const forms = document.querySelectorAll('form');

        forms.forEach(function(form) {
            form.addEventListener('submit', function() {
                const submitButtons = form.querySelectorAll('button[type="submit"], input[type="submit"]');

                submitButtons.forEach(function(button) {
                    button.disabled = true;
                    const originalText = button.textContent || button.value;

                    if (button.tagName === 'BUTTON') {
                        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                    } else {
                        button.value = 'Processing...';
                    }

                    // Store original text for potential restoration
                    button.setAttribute('data-original-text', originalText);
                });
            });
        });
    }

    /**
     * Console welcome message
     */
    function logWelcomeMessage() {
        if (typeof console !== 'undefined') {
            const styles = [
                'color: #1e90ff',
                'font-size: 20px',
                'font-weight: bold',
                'text-shadow: 2px 2px 0 #1a237e'
            ].join(';');

            console.log('%c🦒 Zoo Landers Auth 🦁', styles);
            console.log('%cCenter for Kids Who Can\'t Fly Good', 'color: #FFD700; font-size: 14px;');
            console.log('%cPowered by Alliance Auth', 'color: #666; font-size: 12px;');
        }
    }

    /**
     * Add tooltips to icons (if Bootstrap tooltips are available)
     */
    function initializeTooltips() {
        if (typeof $ !== 'undefined' && $.fn.tooltip) {
            $('[data-toggle="tooltip"]').tooltip();
        }
    }

    /**
     * Enhance table responsiveness
     */
    function enhanceTables() {
        const tables = document.querySelectorAll('table:not(.dataTable)');

        tables.forEach(function(table) {
            // Only wrap if not already wrapped
            if (!table.parentElement.classList.contains('table-responsive')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-responsive';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        });
    }

    /**
     * Add loading animation to page transitions
     */
    function addPageTransitions() {
        // Fade in content on page load
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';

        setTimeout(function() {
            document.body.style.opacity = '1';
        }, 50);
    }

    /**
     * Initialize all enhancements
     */
    function initialize() {
        try {
            logWelcomeMessage();
            addFlygaWatermark();
            animateSidebarIcons();
            enableSmoothScroll();
            enhanceButtons();
            enhanceForms();
            initializeTooltips();
            enhanceTables();
            addPageTransitions();

            console.log('%c✓ Zoo Landers enhancements loaded', 'color: #4caf50; font-weight: bold;');
        } catch (error) {
            console.error('Error initializing Zoo Landers enhancements:', error);
        }
    }

    /**
     * Initialize on DOM ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        // DOM is already loaded
        initialize();
    }

    /**
     * Re-initialize on dynamic content changes (for AJAX-loaded content)
     */
    if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    // Re-initialize enhancements for new content
                    animateSidebarIcons();
                    enhanceButtons();
                    enhanceTables();
                    initializeTooltips();
                }
            });
        });

        // Start observing after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
        } else {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

})();
