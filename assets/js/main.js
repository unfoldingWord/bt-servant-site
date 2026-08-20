/* BT Servant — site behavior (2026 rebrand)
   Nav toggle · hero rotator · intent selector · reach/platform selector ·
   context demo · copy link · GA4 track() helper */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ---------- GA4 helper ---------- */
  function track(eventName, params) {
    if (typeof gtag === 'function') gtag('event', eventName, params || {});
  }
  document.querySelectorAll('[data-track]').forEach(function (el) {
    el.addEventListener('click', function () {
      track(el.getAttribute('data-track'), { name: el.getAttribute('data-track-name') || '' });
    });
  });

  /* ---------- Mobile nav ---------- */
  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var open = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    siteNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        siteNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Hero rotator: typewriter ---------- */
  var rotator = document.getElementById('heroRotator');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* Reduced motion: leave the word already painted by the static markup
     (index.html / organizations.html #heroRotator) exactly as-is. Swapping it
     for a longer combined phrase here caused a visible text/layout jump right
     after load for these users — the one thing "reduced motion" asks us not
     to do. */
  if (rotator && !reduceMotion) {
    var words = ['to understand', 'to study', 'to teach', 'to translate', 'to share'];
    var wi = 0, ci = 0, deleting = false, paused = false;
    var hero = rotator.closest('.hero');
    if (hero) {
      hero.addEventListener('mouseenter', function () { paused = true; });
      hero.addEventListener('mouseleave', function () { paused = false; });
      hero.addEventListener('focusin', function () { paused = true; });
      hero.addEventListener('focusout', function () { paused = false; });
    }
    function tick() {
      if (paused) { setTimeout(tick, 300); return; }
      var word = words[wi];
      if (!deleting) {
        ci++;
        rotator.textContent = word.slice(0, ci);
        if (ci === word.length) { deleting = true; setTimeout(tick, 900); return; }
        setTimeout(tick, 38);
      } else {
        ci--;
        rotator.textContent = word.slice(0, ci);
        if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; setTimeout(tick, 180); return; }
        setTimeout(tick, 14);
      }
    }
    /* Pick up from the word the static markup already rendered instead of
       clearing it to blank and re-typing it — that clear-then-retype was the
       visible "flash" / restart bug on page load. If the markup ever gets
       hand-edited to something outside `words`, fall back to a clean start. */
    var startIndex = words.indexOf(rotator.textContent.trim());
    if (startIndex === -1) {
      rotator.textContent = '';
      setTimeout(tick, 450);
    } else {
      wi = startIndex;
      ci = words[wi].length;
      deleting = true;
      setTimeout(tick, 900);
    }
  }

  /* ---------- Intent selector ---------- */
  /* Each intent maps to a real BT Servant WhatsApp screenshot (assets/images/wa/) \u2014
     no native app exists, so the previews are actual conversations, not mockups. */
  var INTENTS = {
    understand: {
      img: 'assets/images/wa/understand.png',
      alt: 'A real WhatsApp conversation with BT Servant: a user asks for help understanding Romans 12:1-2, and BT Servant replies with the passage text and translation notes.',
      cta: 'Start understanding'
    },
    study: {
      img: 'assets/images/wa/study.png',
      alt: 'A real WhatsApp conversation with BT Servant: a user asks about the historical context of Philippians, and BT Servant replies with background from Bible study resources.',
      cta: 'Start studying'
    },
    teach: {
      img: 'assets/images/wa/teach.png',
      alt: 'A real WhatsApp conversation with BT Servant: a user asks for help preparing a lesson on the Good Samaritan, and BT Servant replies with a lesson outline and key insights.',
      cta: 'Start teaching'
    },
    translate: {
      img: 'assets/images/wa/translate.png',
      alt: 'A real WhatsApp conversation with BT Servant: a user asks how to translate the word grace for a language with no equivalent word, and BT Servant replies with guidance from Translation Words and Translation Academy.',
      cta: 'Start translating'
    },
    share: {
      img: 'assets/images/wa/share.png',
      alt: 'A real WhatsApp conversation with BT Servant: a user asks for help explaining the gospel, and BT Servant replies with a clear outline of key gospel passages.',
      cta: 'Start sharing'
    },
    equip: {
      img: 'assets/images/wa/equip.png',
      alt: 'A real WhatsApp conversation with BT Servant: a user asks for help training multilingual groups in Bible translation principles, and BT Servant replies with clarifying questions to tailor the training.',
      cta: 'Start equipping'
    }
  };
  var intentBtns = document.querySelectorAll('.intent-btn');
  var pvImg = document.getElementById('intentPreviewImg');
  var pvCta = document.getElementById('intentPreviewCta');
  intentBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-intent');
      var data = INTENTS[key];
      if (!data) return;
      intentBtns.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
        b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      });
      if (pvImg) {
        pvImg.src = data.img;
        pvImg.alt = data.alt;
      }
      if (pvCta) {
        pvCta.textContent = data.cta;
        pvCta.href = 'https://app.btservant.ai/chat?intent=' + key;
        pvCta.setAttribute('data-track-name', key);
      }
      track('intent_select', { name: key });
    });
  });

  /* ---------- Reach / platform selector ---------- */
  var CHANNELS = {
    whatsapp: {
      heading: 'Use BT Servant on WhatsApp',
      steps: ['Scan the QR code, or tap \u201cOpen in WhatsApp.\u201d', 'Send any question.', 'Reply in text or voice.'],
      note: '',
      link: 'https://wa.me/15558196461?text=Hello%2C%20BT%20Servant',
      cta: 'Open in WhatsApp',
      qr: 'assets/images/qr-code.png',
      qrAlt: 'Scan to open BT Servant on WhatsApp'
    },
    telegram: {
      heading: 'Use BT Servant on Telegram',
      steps: ['Scan the QR code, or tap \u201cOpen in Telegram\u201d (or search @bt_servant_bot).', 'Tap Start and send any question.', 'Reply in text or voice.'],
      note: '@bt_servant_bot',
      link: 'https://t.me/bt_servant_bot',
      cta: 'Open in Telegram',
      qr: 'assets/images/qr-code-telegram.png',
      qrAlt: 'Scan to open BT Servant on Telegram'
    },
    signal: {
      heading: 'Use BT Servant on Signal',
      steps: ['Scan the QR code, or tap \u201cOpen in Signal.\u201d', 'Send any question.', 'Reply in text or voice.'],
      note: '',
      link: 'https://signal.me/#eu/-RGNTp_ER2U74QlijVSyUHxU_EnzcvATLyvcTyCYS8r_jcbr-FlNxJcgZ7fPXTce',
      cta: 'Open in Signal',
      qr: 'assets/images/qr-code-signal.png',
      qrAlt: 'Scan to open BT Servant on Signal'
    },
    web: {
      heading: 'Use BT Servant on the Web',
      steps: ['Scan the QR code, or open app.btservant.ai in any browser.', 'Ask your first question.', 'Continue on your phone later.'],
      note: '',
      link: 'https://app.btservant.ai/chat',
      cta: 'Open Web App',
      qr: 'assets/images/qr-code-webapp.png',
      qrAlt: 'Scan to open the BT Servant web app'
    }
  };
  var reachTabs = document.querySelectorAll('.reach__tab');
  var reachHeading = document.getElementById('reachHeading');
  var reachSteps = document.getElementById('reachSteps');
  var reachNote = document.getElementById('reachNote');
  var reachCta = document.getElementById('reachCta');
  var reachQrImg = document.getElementById('reachQrImg');

  function renderChannel(key) {
    var c = CHANNELS[key];
    if (!c) return;
    if (reachHeading) reachHeading.textContent = c.heading;
    if (reachSteps) {
      reachSteps.innerHTML = '';
      c.steps.forEach(function (s) {
        var li = document.createElement('li');
        li.textContent = s;
        reachSteps.appendChild(li);
      });
    }
    if (reachNote) reachNote.textContent = c.note;
    if (reachCta) { reachCta.href = c.link; reachCta.textContent = c.cta; reachCta.setAttribute('data-track-name', key); }
    if (reachQrImg) { reachQrImg.src = c.qr; reachQrImg.alt = c.qrAlt; }
  }
  reachTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      reachTabs.forEach(function (t) {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      renderChannel(tab.getAttribute('data-channel'));
      track('reach_tab', { name: tab.getAttribute('data-channel') });
    });
  });
  renderChannel('whatsapp');

  /* Copy access link */
  var copyBtn = document.getElementById('reachCopyLink');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var link = reachCta ? reachCta.href : window.location.href;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(link).then(function () {
          var prev = copyBtn.textContent;
          copyBtn.textContent = 'Link copied!';
          setTimeout(function () { copyBtn.textContent = prev; }, 1800);
        });
      }
      track('copy_link', { name: link });
    });
  }

  /* ---------- Context-aware demo ---------- */
  var CONTEXT_ANSWERS = {
    believer: '\u201cThis verse means God wants your whole life \u2014 not just your words \u2014 to honor him. Let\u2019s look at what that could look like this week.\u201d',
    translator: '\u201cThe key term here is \u201csacrifice\u201d (thysia). Translation Words suggests testing whether your rendering carries \u201coffering given to God,\u201d not merely \u201csomething lost.\u201d\u201d',
    leader: '\u201cHere are three discussion questions for your group, moving from what the passage says to what obedience looks like for each person this week.\u201d'
  };
  var ctxTabs = document.querySelectorAll('.context-demo__tab');
  var ctxAnswer = document.getElementById('contextDemoAnswer');
  ctxTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      ctxTabs.forEach(function (t) {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
      });
      if (ctxAnswer) ctxAnswer.textContent = CONTEXT_ANSWERS[tab.getAttribute('data-role')] || '';
      track('context_demo', { name: tab.getAttribute('data-role') });
    });
  });
});
