/**
 * BT Servant — main.js
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        // Mobile nav toggle
        var toggle = document.querySelector('.nav-toggle');
        var nav    = document.querySelector('.site-nav');
        if (toggle && nav) {
            toggle.addEventListener('click', function (e) {
                e.stopPropagation();
                var open = nav.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            });
            // Close menu when a nav link is tapped
            nav.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    nav.classList.remove('is-open');
                    toggle.setAttribute('aria-expanded', 'false');
                });
            });
            // Close menu when clicking outside the header
            document.addEventListener('click', function (e) {
                if (!nav.classList.contains('is-open')) return;
                if (e.target.closest('.site-header')) return;
                nav.classList.remove('is-open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        }

        // Smooth scroll for in-page anchors
        document.querySelectorAll('a[href^="#"]').forEach(function (a) {
            a.addEventListener('click', function (e) {
                var target = document.querySelector(a.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });

        // GA4 event tracking ------------------------------------------------
        function track(eventName, params) {
            if (typeof window.gtag === 'function') {
                window.gtag('event', eventName, params || {});
            }
        }

        // "Try BT Servant" CTA clicks (anything pointing at app.btservant.ai)
        document.querySelectorAll('a[href*="app.btservant.ai"]').forEach(function (a) {
            a.addEventListener('click', function () {
                track('cta_click', {
                    cta_name: 'try_bt_servant',
                    link_url: a.href,
                    link_text: (a.textContent || '').trim().replace(/\s+/g, ' ')
                });
            });
        });

        // Discord community link clicks
        document.querySelectorAll('a[href*="discord.gg"], a[href*="discord.com"]').forEach(function (a) {
            a.addEventListener('click', function () {
                track('discord_click', {
                    link_url: a.href,
                    link_text: (a.textContent || '').trim().replace(/\s+/g, ' ')
                });
            });
        });

        // Access tabs: WhatsApp / Telegram / Signal / Web App --------------
        var accessTabs = document.querySelectorAll('.access-tab');
        var accessPanels = document.querySelectorAll('.access-panel');
        if (accessTabs.length && accessPanels.length) {
            accessTabs.forEach(function (tab) {
                tab.addEventListener('click', function () {
                    var platform = tab.getAttribute('data-platform');

                    accessTabs.forEach(function (t) {
                        var isActive = t === tab;
                        t.classList.toggle('is-active', isActive);
                        t.setAttribute('aria-selected', isActive ? 'true' : 'false');
                    });
                    accessPanels.forEach(function (panel) {
                        var isActive = panel.getAttribute('data-platform') === platform;
                        panel.classList.toggle('is-active', isActive);
                        if (isActive) {
                            panel.removeAttribute('hidden');
                        } else {
                            panel.setAttribute('hidden', '');
                        }
                    });

                    track('platform_tab_click', { platform: platform });
                });
            });
        }

        // Copy access link buttons ------------------------------------------
        document.querySelectorAll('.copy-link').forEach(function (btn) {
            var defaultLabel = btn.textContent;
            btn.addEventListener('click', function () {
                var link = btn.getAttribute('data-copy-link');
                if (!link) return;

                function showCopied() {
                    btn.textContent = 'Copied!';
                    setTimeout(function () { btn.textContent = defaultLabel; }, 2000);
                    track('copy_access_link', { link_url: link });
                }

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(link).then(showCopied, showCopied);
                } else {
                    // Fallback for older browsers
                    var temp = document.createElement('textarea');
                    temp.value = link;
                    temp.style.position = 'fixed';
                    temp.style.opacity = '0';
                    document.body.appendChild(temp);
                    temp.select();
                    try { document.execCommand('copy'); } catch (err) { /* no-op */ }
                    document.body.removeChild(temp);
                    showCopied();
                }
            });
        });
    });
})();
