// Virtual Assistant: floating button + right-hand chat drawer, shared by both pages.
// Include with <link rel="stylesheet" href=".../shared/va.css"> in <head> and
// <script src=".../shared/va.js"></script> at the end of <body>.
//
// The drawer's open/closed state and the conversation are kept in localStorage
// (keys 'dell_va_open' and 'dell_va_chat', the same keys the Claude Design source uses),
// so they carry over between the landing page and the product page.
(function () {
  const OPEN_KEY = 'dell_va_open';
  const CHAT_KEY = 'dell_va_chat';

  // Paths are resolved against this script's location, so the pages can live in any folder
  const here = document.currentScript.src;
  const iconUrl = new URL('../uploads/mindellva.png', here).href;

  // Public Sans, as in the Virtual Assistant design
  const font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = 'https://fonts.googleapis.com/css2?family=Public+Sans:wght@400;500;600;700&display=swap';
  document.head.appendChild(font);

  const sparkSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="oklch(50% .2 300)" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z"/></svg>';
  const speakerSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M4 10v4h4l5 4V6l-5 4zM16 9a4 4 0 010 6M18.5 6.5a8 8 0 010 11"/></svg>';
  const thumbUpSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"><path d="M7 11v9H3v-9zM7 11l4-8c1.5 0 2.5 1 2.5 2.5V9H19a2 2 0 012 2l-1.4 7a2 2 0 01-2 1.6H7"/></svg>';
  const thumbDownSvg = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round" style="transform:rotate(180deg)"><path d="M7 11v9H3v-9zM7 11l4-8c1.5 0 2.5 1 2.5 2.5V9H19a2 2 0 012 2l-1.4 7a2 2 0 01-2 1.6H7"/></svg>';
  const spinnerSvg = '<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="url(#vaGrad)" stroke-width="1.8" stroke-linejoin="round"><defs><linearGradient id="vaGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2f55c9"/><stop offset="1" stop-color="#b0287a"/></linearGradient></defs><path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z"/><path d="M19 2v3M17.5 3.5h3M5 19v3M3.5 20.5h3" stroke-linecap="round"/></svg>';

  // ── Markup ──
  const root = document.createElement('div');
  root.innerHTML =
    '<button class="va-fab" id="vaFab" aria-label="Virtual Assistant">' +
      '<img src="' + iconUrl + '" alt="Virtual Assistant">' +
    '</button>' +
    '<div class="va-panel" id="vaPanel">' +
     '<div class="va-card">' +
      '<div class="va-header">' +
        '<button aria-label="Menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
        '<div class="va-header-title">' +
          '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z"/></svg>' +
          '<span>Virtual Assistant</span>' +
          '<span class="va-beta">BETA</span>' +
        '</div>' +
        '<button aria-label="Expand"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7"/></svg></button>' +
        '<button aria-label="Close" id="vaClose"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M13 5l7 7-7 7"/></svg></button>' +
      '</div>' +
      '<div class="va-messages" id="vaMessages"></div>' +
      '<div class="va-input-bar">' +
        '<div class="va-input-row">' +
          '<label class="va-input-label" for="vaInput">Ask me a question</label>' +
          '<input type="text" id="vaInput">' +
          '<button class="va-mic-btn" aria-label="Voice input"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0014 0M12 18v3"/></svg></button>' +
          '<button class="va-send-btn" id="vaSend" aria-label="Send"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M13 5l7 7-7 7"/></svg></button>' +
        '</div>' +
        '<p class="va-disclaimer">Please verify responses. <a href="#">Transparency Statement</a></p>' +
      '</div>' +
     '</div>' +
    '</div>';
  while (root.firstChild) document.body.appendChild(root.firstChild);

  const vaFab = document.getElementById('vaFab');
  const vaPanel = document.getElementById('vaPanel');
  const vaClose = document.getElementById('vaClose');
  const vaInput = document.getElementById('vaInput');
  const vaSend = document.getElementById('vaSend');
  const vaMessages = document.getElementById('vaMessages');

  // ── State (conversation resets on each page load) ──
  const load = (key) => { try { return localStorage.getItem(key); } catch (e) { return null; } };
  const save = (key, value) => { try { localStorage.setItem(key, value); } catch (e) {} };

  let chatMessages = [];
  // A fresh visit starts with an empty conversation
  let chatEnded = false;
  let thinking = false;
  let replyTimer = null;

  save(CHAT_KEY, JSON.stringify({ messages: chatMessages, ended: chatEnded }));

  function persistChat() {
    save(CHAT_KEY, JSON.stringify({ messages: chatMessages, ended: chatEnded }));
  }

  // ── Rendering ──
  function el(className, html) {
    const div = document.createElement('div');
    div.className = className;
    div.innerHTML = html;
    return div;
  }

  function renderMessages() {
    vaMessages.innerHTML = '';
    chatMessages.forEach(m => {
      if (m.isUser) {
        const div = el('va-msg-user', '<div class="va-msg-user-bubble"></div>');
        div.firstChild.textContent = m.text;
        vaMessages.appendChild(div);
      } else {
        const div = el('va-msg-bot',
          '<div class="va-msg-header">' + sparkSvg + '<button aria-label="Read aloud">' + speakerSvg + '</button></div>' +
          '<p class="va-msg-bot-text"></p>' +
          '<div class="va-question-list"></div>' +
          '<div class="va-msg-actions"><button aria-label="Helpful">' + thumbUpSvg + '</button><button aria-label="Not helpful">' + thumbDownSvg + '</button></div>');
        div.querySelector('.va-msg-bot-text').textContent = m.text;
        const questionList = div.querySelector('.va-question-list');
        (m.questions || []).forEach(question => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'va-question-btn';
          button.textContent = question;
          button.addEventListener('click', () => {
            vaInput.value = question;
            vaInput.focus();
          });
          questionList.appendChild(button);
        });
        if (!questionList.childElementCount) questionList.remove();
        vaMessages.appendChild(div);
      }
    });

    // "I'm working on your response..." while a reply is pending
    if (thinking) {
      vaMessages.appendChild(el('va-thinking', spinnerSvg + '<p>I’m working on your response...</p>'));
    }

    // Sign-in card
    if (chatMessages.length || thinking || chatEnded) {
      const signin = el('', sparkSvg +
        '<div class="va-signin-card">' +
          '<h3>Save your chats</h3>' +
          '<p>Sign in to start saving your chats. Once you\'re signed in, you can access your recent chats in the menu.</p>' +
          '<div class="va-signin-actions">' +
            '<button class="btn-primary">Sign In</button>' +
            '<button class="btn-secondary">Create an Account</button>' +
          '</div>' +
        '</div>');
      signin.style.cssText = 'display:flex;flex-direction:column;gap:14px';
      vaMessages.appendChild(signin);
    }

    // "Chat ended" notice with a Start a New Chat button
    if (chatEnded && !thinking) {
      const ended = el('va-ended',
        '<p>Our chat has ended due to inactivity. If you have questions, select Start a New Chat.</p>' +
        '<button class="va-new-chat">Start a New Chat</button>');
      ended.querySelector('.va-new-chat').addEventListener('click', startNewChat);
      vaMessages.appendChild(ended);
    }

    vaMessages.scrollTop = vaMessages.scrollHeight;
  }

  // ── Actions ──
  async function sendMessage() {
    const text = vaInput.value.trim();
    if (!text) return;
    chatMessages.push({ isUser: true, text });
    vaInput.value = '';
    chatEnded = false;
    thinking = true;
    persistChat();
    renderMessages();
    clearTimeout(replyTimer);

    // Call the visit-ids API proxy
    try {
      const response = await fetch('http://localhost:8001/visit-ids', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ service_tag: text })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`HTTP ${response.status}: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      chatMessages.push({ isBot: true, text: JSON.stringify(data, null, 2) });
    } catch (error) {
      console.error('API Error:', error);
      chatMessages.push({ isBot: true, text: 'Sorry, I couldn\'t retrieve the visit IDs. Error: ' + error.message });
    }

    thinking = false;
    persistChat();
    renderMessages();
  }

  function startNewChat() {
    clearTimeout(replyTimer);
    chatMessages = [{ isBot: true, text: 'Hi! How can I help you today?' }];
    chatEnded = false;
    thinking = false;
    persistChat();
    renderMessages();
    vaInput.focus();
  }

  function setOpen(open) {
    vaPanel.classList.toggle('open', open);
    vaFab.style.display = open ? 'none' : '';
    save(OPEN_KEY, open ? '1' : '0');
    if (open) {
      renderMessages();
      vaInput.focus();
    }
  }

  vaFab.addEventListener('click', async () => {
    // Clear chat content when the Virtual Assistant button is clicked
    chatMessages = [];
    chatEnded = false;
    thinking = false;
    persistChat();
    renderMessages();

    const wasOpen = vaPanel.classList.contains('open');
    setOpen(!wasOpen);

    // If opening the panel, check the API mode and call the appropriate API
    if (!wasOpen) {
      const apiMode = document.querySelector('input[name="apiMode"]:checked')?.value || 'probing';
      const serviceTag = document.getElementById('serviceTag')?.value?.trim() || '';
      const visitId = document.getElementById('visitId')?.value?.trim() || '';
      const start = document.getElementById('startDate')?.value?.trim() || '';
      const end = document.getElementById('endDate')?.value?.trim() || '';

      const context = [
        serviceTag && `service_tag: ${serviceTag}`,
        start && `start: ${start}`,
        end && `end: ${end}`,
        visitId && `visit_id: ${visitId}`
      ].filter(Boolean).join('\n');

      chatMessages = [{
        isBot: true,
        text: context ? `Virtual Assistant relaunched with:\n${context}` : 'Hi! How can I help you today?'
      }];
      chatEnded = false;
      thinking = true;
      persistChat();
      renderMessages();

      if (apiMode === 'probing') {
        try {
          const response = await fetch('http://localhost:8001/probing-agent/run', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              service_tag: serviceTag,
              visit_id: visitId,
              start_date: start,
              end_date: end
            })
          });
          const data = await response.json();
          if (!response.ok) throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
          const questions = Array.isArray(data.probing_questions)
            ? data.probing_questions.slice(0, 3).map(item => item?.question).filter(Boolean)
            : [];
          chatMessages.push({
            isBot: true,
            text: questions.length
              ? 'Select a topic or enter your specific information.'
              : 'No probing questions were returned.',
            questions
          });
        } catch (error) {
          console.error('Probing agent API error:', error);
          const fallbackQuestions = [
            'Why is there something rather than nothing?',
            'What does your subjective experience of the color red look like?',
            'If every part of an object is replaced over time, does it remain the same object?',
            'What happened before time began?',
            'Is the statement "This statement is false" true or false?',
            'Does the universe have an intrinsic purpose?'
          ];
          for (let i = fallbackQuestions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [fallbackQuestions[i], fallbackQuestions[j]] = [fallbackQuestions[j], fallbackQuestions[i]];
          }
          chatMessages.push({
            isBot: true,
            text: 'Select a topic or enter your specific information.',
            questions: fallbackQuestions.slice(0, 3)
          });
        }
      } else {
        // semantic search mode - just put "blank" in the chat
        chatMessages.push({
          isBot: true,
          text: 'blank'
        });
      }

      thinking = false;
      persistChat();
      renderMessages();
    }
  });
  vaClose.addEventListener('click', () => setOpen(false));
  vaSend.addEventListener('click', sendMessage);
  vaInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
  });
  window.addEventListener('dell-va-launch', async event => {
    clearTimeout(replyTimer);
    const serviceTag = event.detail?.serviceTag || '';
    const start = event.detail?.start || '';
    const end = event.detail?.end || '';
    const visitId = event.detail?.visitId || '';
    const context = [
      serviceTag && `service_tag: ${serviceTag}`,
      start && `start: ${start}`,
      end && `end: ${end}`,
      visitId && `visit_id: ${visitId}`
    ].filter(Boolean).join('\n');
    chatMessages = [{
      isBot: true,
      text: context ? `Virtual Assistant relaunched with:\n${context}` : 'Hi! How can I help you today?'
    }];
    chatEnded = false;
    thinking = true;
    persistChat();
    setOpen(true);

    try {
      const response = await fetch('http://localhost:8001/probing-agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_tag: serviceTag,
          visit_id: visitId,
          start_date: start,
          end_date: end
        })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${JSON.stringify(data)}`);
      const questions = Array.isArray(data.probing_questions)
        ? data.probing_questions.slice(0, 3).map(item => item?.question).filter(Boolean)
        : [];
      chatMessages.push({
        isBot: true,
        text: questions.length
          ? 'Select a topic or enter your specific information.'
          : 'No probing questions were returned.',
        questions
      });
    } catch (error) {
      console.error('Probing agent API error:', error);
      const fallbackQuestions = [
        'Why is there something rather than nothing?',
        'What does your subjective experience of the color red look like?',
        'If every part of an object is replaced over time, does it remain the same object?',
        'What happened before time began?',
        'Is the statement "This statement is false" true or false?',
        'Does the universe have an intrinsic purpose?'
      ];
      for (let i = fallbackQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fallbackQuestions[i], fallbackQuestions[j]] = [fallbackQuestions[j], fallbackQuestions[i]];
      }
      chatMessages.push({
        isBot: true,
        text: 'Select a topic or enter your specific information.',
        questions: fallbackQuestions.slice(0, 3)
      });
    }

    thinking = false;
    persistChat();
    renderMessages();
  });

  // Reopen the drawer if it was open on the previous page
  if (load(OPEN_KEY) === '1') setOpen(true);
})();
