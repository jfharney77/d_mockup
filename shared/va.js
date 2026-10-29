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
  let isFirstUserMessage = true;
  let mergedSemanticResults = null;

  // Clear any persisted chat on page load to prevent duplication
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

  function escapeHtml(value) {
    const span = document.createElement('span');
    span.textContent = String(value);
    return span.innerHTML;
  }

  function renderMessages() {
    vaMessages.innerHTML = '';

    // Sign-in card (displayed first if enabled)
    const showSignin = document.getElementById('showSignin')?.checked !== false;
    if (showSignin && (chatMessages.length || thinking || chatEnded)) {
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

    chatMessages.forEach(m => {
      if (m.isUser) {
        const div = el('va-msg-user', '<div class="va-msg-user-bubble"></div>');
        div.firstChild.textContent = m.text;
        vaMessages.appendChild(div);
      } else {
        const div = el('va-msg-bot',
          '<div class="va-msg-header">' + sparkSvg + '<button aria-label="Read aloud">' + speakerSvg + '</button></div>' +
          '<p class="va-msg-bot-text"></p>' +
          '<ul class="va-result-list"></ul>' +
          '<div class="va-question-list"></div>' +
          '<div class="va-coveo-slot"></div>' +
          '<div class="va-troubleshooting-slot"></div>' +
          '<div class="va-msg-actions"><button aria-label="Helpful">' + thumbUpSvg + '</button><button aria-label="Not helpful">' + thumbDownSvg + '</button></div>');
        const botText = div.querySelector('.va-msg-bot-text');
        botText.innerHTML = m.text;
        if (!m.text) botText.remove();
        const resultList = div.querySelector('.va-result-list');
        (m.results || []).forEach(result => {
          const item = document.createElement('li');
          let url = null;
          try {
            const parsed = new URL(result.url);
            if (parsed.protocol === 'http:' || parsed.protocol === 'https:') url = parsed.href;
          } catch (e) {}
          const title = document.createElement('a');
          title.textContent = result.title;
          title.href = url || '#';
          if (url) {
            title.target = '_blank';
            title.rel = 'noopener';
          } else {
            title.addEventListener('click', e => e.preventDefault());
          }
          item.appendChild(title);
          if (result.term) item.appendChild(document.createTextNode(` (Search Terms: ${result.term})`));
          resultList.appendChild(item);
        });
        if (!resultList.childElementCount) resultList.remove();
        const questionList = div.querySelector('.va-question-list');
        (m.questions || []).forEach((question, index) => {
          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'va-question-btn';
          button.textContent = question;
          button.addEventListener('click', () => {
            const apiMode = document.querySelector('input[name="apiMode"]:checked')?.value || 'probing';
            if (index === 0) {
              chatMessages.push({
                isBot: true,
                text: '',
                coveoSearch: true
              });
              persistChat();
              renderMessages();
              return;
            }
            if (index === 2) {
              const serviceTag = document.getElementById('serviceTag')?.value?.trim() || '';
              const issue = [...chatMessages].reverse().find(message => message.isUser)?.text || '';
              chatMessages.push({
                isBot: true,
                text: 'It looks like this issue needs guided support from our advanced troubleshooting assistant.<br>This form will log the details of this conversation for our Support team’s reference.',
                troubleshooting: true,
                product: 'dell-pro-precision-pw716260-laptop',
                serviceTag,
                issue
              });
              persistChat();
              renderMessages();
              return;
            }
            if (apiMode === 'merged' && index === 1 && mergedSemanticResults) {
              chatMessages.push({
                isBot: true,
                text: 'Search Results:',
                results: mergedSemanticResults
              });
              mergedSemanticResults = null;
              persistChat();
              renderMessages();
              return;
            }
            vaInput.value = question;
            vaInput.focus();
          });
          questionList.appendChild(button);
        });
        if (!questionList.childElementCount) questionList.remove();
        const coveoSlot = div.querySelector('.va-coveo-slot');
        if (m.coveoSearch) {
          coveoSlot.innerHTML =
            '<article class="va-coveo-result">' +
              '<h2>Troubleshooting Audio Sound Issues on Dell Computers</h2>' +
              '<section><h3>Initial Checks</h3>' +
                '<ol>' +
                  '<li><strong>Check Audio Devices:</strong> Click the speaker icon on the Windows taskbar. Ensure the correct playback device is selected and not muted.</li>' +
                  '<li><strong>Inspect Audio Ports:</strong> Turn off the computer, unplug all cables, and inspect the audio port for damage or debris. Clean gently with compressed air if necessary.</li>' +
                '</ol>' +
              '</section>' +
              '<section><h3>Software Solutions</h3>' +
                '<ol>' +
                  '<li><strong>Run Windows Troubleshooter:</strong>' +
                    '<ul><li>Click Start, search for &quot;Troubleshoot settings,&quot; and select &quot;Other troubleshooters.&quot;</li><li>Click &quot;Run&quot; next to &quot;Audio.&quot;</li></ul>' +
                  '</li>' +
                  '<li><strong>Update Audio Drivers:</strong>' +
                    '<ul><li>Right-click Start, select Device Manager.</li><li>Expand &quot;Sound, video and game controllers.&quot;</li><li>Right-click your audio device and select &quot;Update driver.&quot;</li><li>Alternatively, download the latest driver from Dell Drivers &amp; Downloads and install it.</li></ul>' +
                  '</li>' +
                '</ol>' +
              '</section>' +
              '<section><h3>Advanced Steps</h3>' +
                '<ol>' +
                  '<li><strong>BIOS and Chipset Drivers:</strong> Update your BIOS and chipset drivers if the issue persists.</li>' +
                  '<li><strong>Run Diagnostics:</strong> Use SupportAssist to run diagnostics on audio devices.</li>' +
                '</ol>' +
              '</section>' +
              '<section><h3>Specific Issue</h3>' +
                '<p>For Alienware x15 R2 users experiencing decreasing audio volume over time, update the audio driver to version 6.0.9605.1 or later.</p>' +
                '<p>If the issue remains unresolved, the available documentation</p>' +
              '</section>' +
            '</article>';
        } else {
          coveoSlot.remove();
        }
        const troubleshootingSlot = div.querySelector('.va-troubleshooting-slot');
        if (m.troubleshooting) {
          troubleshootingSlot.innerHTML =
            '<div class="va-troubleshooting-card">' +
              '<div class="va-device-details">' +
                '<p><strong>Product:</strong> <span class="va-product-name"></span></p>' +
                '<p><strong>Service Tag:</strong> <span class="va-service-tag"></span></p>' +
                '<p><strong>Issue:</strong> <span class="va-issue"></span></p>' +
              '</div>' +
              '<form class="va-troubleshooting-form">' +
                '<label>First Name <span>*</span><input type="text" name="firstName" required></label>' +
                '<label>Last Name <span>*</span><input type="text" name="lastName" required></label>' +
                '<label>Email Address <span>*</span><input type="email" name="email" required></label>' +
                '<label>Phone Number <span>*</span><input type="tel" name="phone" required></label>' +
                '<button type="submit">Continue</button>' +
              '</form>' +
              '<p class="va-privacy">Your privacy is important to us. We will only use your information to process your request. We will not share it with anyone. To learn more about how we use and protect your data, see our <a href="https://www.dell.com/learn/uk/en/ukcorp1/policies-privacy" target="_blank" rel="noopener">Dell Privacy Statement</a>.</p>' +
            '</div>';
          troubleshootingSlot.querySelector('.va-product-name').textContent = m.product;
          troubleshootingSlot.querySelector('.va-service-tag').textContent = m.serviceTag;
          troubleshootingSlot.querySelector('.va-issue').textContent = m.issue;
          troubleshootingSlot.querySelector('form').addEventListener('submit', event => event.preventDefault());
        } else {
          troubleshootingSlot.remove();
        }
        vaMessages.appendChild(div);
      }
    });
    // "I'm working on your response..." while a reply is pending
    if (thinking) {
      vaMessages.appendChild(el('va-thinking', spinnerSvg + '<p>I’m working on your response...</p>'));
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

    // Simulate a brief delay for natural feel
    await new Promise(resolve => setTimeout(resolve, 500));

    const apiMode = document.querySelector('input[name="apiMode"]:checked')?.value || 'probing';

    if (isFirstUserMessage) {
      mergedSemanticResults = null;
      const serviceTag = document.getElementById('serviceTag')?.value?.trim() || '';
      const safeText = escapeHtml(text);
      const safeServiceTag = escapeHtml(serviceTag);
      let botMessage = {
        isBot: true,
        text: (apiMode === 'probing' || apiMode === 'merged')
          ? `Thank you for reaching out about ${safeText}. Can you describe the issue?\nWe found your device with <strong>Service Tag ${safeServiceTag}</strong>`
          : `Thank you for reaching out about ${safeText}. We understand how frustrating that can be. We can help with that.\nWe found your device with <strong>Service Tag ${safeServiceTag}</strong>`
      };

      if ((apiMode === 'probing' || apiMode === 'merged')) {
        // Call the probing-agent API to get questions
        try {
          const visitId = document.getElementById('visitId')?.value?.trim() || '';
          const start = document.getElementById('startDate')?.value?.trim() || '';
          const end = document.getElementById('endDate')?.value?.trim() || '';

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

          botMessage.questions = questions.length > 0 ? questions : ['Check for service request', 'Check on a request', 'Troubleshoot audio problem'];
        } catch (error) {
          console.error('Probing agent API error:', error);
          // Fallback to default questions on error
          botMessage.questions = ['Check for service request', 'Check on a request', 'Troubleshoot audio problem'];
        }

        if (apiMode === 'merged') {
          try {
            const visitId = document.getElementById('visitId')?.value?.trim() || '';
            const start = document.getElementById('startDate')?.value?.trim() || '';
            const end = document.getElementById('endDate')?.value?.trim() || '';
            const response = await fetch('http://localhost:8001/weighing-agent/run', {
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
            const searchTerms = Array.isArray(data.search_terms) ? data.search_terms : [];
            const searchResults = Array.isArray(data.search_results) ? data.search_results : [];
            mergedSemanticResults = searchResults.map((result, i) => ({
              title: result?.title || 'Untitled',
              url: result?.url || '',
              term: result?.search_term || searchTerms[i] || ''
            }));
          } catch (error) {
            console.error('Weighing agent API error:', error);
            mergedSemanticResults = null;
          }

          try {
            const visitId = document.getElementById('visitId')?.value?.trim() || '';
            const start = document.getElementById('startDate')?.value?.trim() || '';
            const end = document.getElementById('endDate')?.value?.trim() || '';
            const intentResponse = await fetch('http://localhost:8001/online-context-intent-agent/run', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                service_tag: serviceTag,
                visit_id: visitId,
                start_date: start,
                end_date: end
              })
            });
            const intentData = await intentResponse.json();
            if (!intentResponse.ok) throw new Error(`HTTP ${intentResponse.status}: ${JSON.stringify(intentData)}`);
            if (intentData.error) throw new Error(intentData.error);
            const intentPhrases = Array.isArray(intentData.intent_phrases)
              ? intentData.intent_phrases.filter(phrase => typeof phrase === 'string' && phrase.trim()).slice(0, 5)
              : [];
            if (intentPhrases.length === 0) throw new Error('No intent phrases were returned.');

            const similarityResponse = await fetch('http://localhost:8001/intent-similarity/compare', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                intent_phrases: intentPhrases,
                reason: intentData.reason || '',
                user_message: text
              })
            });
            const similarityData = await similarityResponse.json();
            if (!similarityResponse.ok) throw new Error(`HTTP ${similarityResponse.status}: ${JSON.stringify(similarityData)}`);
            if (similarityData.error) throw new Error(similarityData.error);
            const similarityScore = Number(similarityData.similarity_score);
            if (!Number.isFinite(similarityScore)) throw new Error('No similarity score was returned.');

            if (similarityScore < 5) {
              botMessage.text = 'different intent';
              botMessage.questions = [];
              mergedSemanticResults = null;
            } else {
              botMessage.text += '\n\n<strong>Intent comparison</strong>' +
                `<br><strong>Inferred intent:</strong> ${intentPhrases.map(escapeHtml).join(', ')}` +
                `<br><strong>Reason:</strong> ${escapeHtml(intentData.reason || 'No reason was returned.')}` +
                `<br><strong>Similarity score:</strong> ${escapeHtml(similarityScore)}/10` +
                `<br><strong>Same intent:</strong> ${escapeHtml(similarityData.same_intent || 'N/A')}`;
            }
          } catch (error) {
            console.error('Intent comparison API error:', error);
            botMessage.text += `<br><br><strong>Intent comparison error:</strong> ${escapeHtml(error.message)}`;
          }
        }
      } else if (apiMode === 'semantic') {
        // Call the weighing-agent API to get semantic search results
        try {
          const visitId = document.getElementById('visitId')?.value?.trim() || '';
          const start = document.getElementById('startDate')?.value?.trim() || '';
          const end = document.getElementById('endDate')?.value?.trim() || '';
          const showSemanticContext = document.getElementById('showSemanticContext')?.checked !== false;

          const response = await fetch('http://localhost:8001/weighing-agent/run', {
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

          const searchTerms = Array.isArray(data.search_terms) ? data.search_terms : [];
          const searchResults = Array.isArray(data.search_results) ? data.search_results : [];

          if (showSemanticContext) {
            // Always remove "Search Results:" section from context summary to avoid duplication
            let contextSummary = data.context_summary || 'No context summary was returned.';
            // Use regex to remove everything from "Search Results:" to end of string
            contextSummary = contextSummary.replace(/Search Results:.*$/s, '').trim();
            botMessage.text += '\n\nContext Summary:\n' + contextSummary;
          }
          // Only add results if there are any
          if (searchResults.length > 0) {
            botMessage.results = searchResults.map((result, i) => ({
              title: result?.title || 'Untitled',
              url: result?.url || '',
              term: result?.search_term || searchTerms[i] || ''
            }));
          }
        } catch (error) {
          console.error('Weighing agent API error:', error);
          botMessage.text += '\n\nSorry, I couldn\'t retrieve the semantic search results. Error: ' + error.message;
        }
      }

      chatMessages.push(botMessage);
      isFirstUserMessage = false;
    } else {
      chatMessages.push({
        isBot: true,
        text: 'OK'
      });
    }

    thinking = false;
    persistChat();
    renderMessages();
  }

  function startNewChat() {
    clearTimeout(replyTimer);
    chatMessages = [{
      isBot: true,
      text: 'Select a topic or enter your specific information.',
      questions: ['Check for service request', 'Check on a request', 'Troubleshoot audio problem']
    }];
    chatEnded = false;
    thinking = false;
    isFirstUserMessage = true;
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
    isFirstUserMessage = true;
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
      const showProbingResponse = document.getElementById('showProbingResponse')?.checked !== false;

      chatMessages = [{
        isBot: true,
        text: 'Select a topic or enter your specific information.',
        questions: (apiMode === 'probing' || apiMode === 'merged') ? ['Check for service request', 'Check on a request', 'Troubleshoot audio problem'] : []
      }];
      chatEnded = false;
      thinking = false;
      isFirstUserMessage = true;
      persistChat();
      renderMessages();

      if ((apiMode === 'probing' || apiMode === 'merged')) {
        // No API call - just show the initial message with default buttons
      } else {
        // semantic search mode - no API call on launch, just show initial message
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
    const showProbingResponse = document.getElementById('showProbingResponse')?.checked !== false;
    chatMessages = [{
      isBot: true,
      text: 'Select a topic or enter your specific information.',
      questions: ['Check for service request', 'Check on a request', 'Troubleshoot audio problem']
    }];
    chatEnded = false;
    thinking = false;
    isFirstUserMessage = true;
    persistChat();
    setOpen(true);
    renderMessages();
  });

  // Do not reopen the drawer on page reload - always start closed
  // if (load(OPEN_KEY) === '1') setOpen(true);
})();
