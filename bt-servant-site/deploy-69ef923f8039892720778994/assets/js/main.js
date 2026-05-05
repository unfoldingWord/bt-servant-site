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
            toggle.addEventListener('click', function () {
                var open = nav.classList.toggle('is-open');
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
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
    });
})();
