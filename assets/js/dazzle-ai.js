
/* =========================================================
   DAZZLE AI ASSISTANT — client
   API key is never stored here. Requests go to /api/chat.
   ========================================================= */
(() => {
  "use strict";

  const BOT_IMAGE = "dazzle_bot.png";
  const STORAGE_KEY = "dazzle_ai_chat_v1";
  const MAX_HISTORY = 14;

  const escapeHtml = (value) => String(value)
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");

  const linkify = (text) => {
    let safe = escapeHtml(text);
    safe = safe.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>");
    safe = safe.replace(/\*([^*]+)\*/g,"<strong>$1</strong>");
    safe = safe.replace(/`([^`]+)`/g,"<code>$1</code>");
    safe = safe.replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');
    return safe.replace(/\n/g,"<br>");
  };

  const now = () => new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"});

  const saveHistory = (messages) => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY))); } catch (_) {}
  };

  const loadHistory = () => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(data) ? data : [];
    } catch (_) { return []; }
  };

  function init() {
    if (document.querySelector(".dazzle-ai-panel")) return;

    const launcher = document.createElement("button");
    launcher.className = "dazzle-ai-launcher";
    launcher.type = "button";
    launcher.setAttribute("aria-label","Open Dazzle AI Assistant");
    launcher.innerHTML = `
      <span class="dazzle-ai-bubbles" aria-hidden="true">
        <i class="dai-bubble"></i><i class="dai-bubble"></i><i class="dai-bubble"></i>
        <i class="dai-bubble"></i><i class="dai-bubble"></i><i class="dai-bubble"></i>
      </span>
      <img class="dazzle-ai-avatar" src="${BOT_IMAGE}" alt="" aria-hidden="true">
      <span class="dazzle-ai-tooltip">Dazzle AI Assistant</span>
    `;

    const panel = document.createElement("section");
    panel.className = "dazzle-ai-panel";
    panel.setAttribute("aria-label","Dazzle AI Assistant");
    panel.setAttribute("aria-hidden","true");
    panel.innerHTML = `
      <header class="dai-header">
        <div class="dai-header-avatar"><img src="${BOT_IMAGE}" alt="Dazzle AI"></div>
        <div class="dai-head-copy">
          <strong>Dazzle AI</strong>
          <span class="dai-status"><i></i> Design Dazzle Studio Assistant</span>
        </div>
        <div class="dai-head-actions">
          <button class="dai-icon-btn dai-reset" type="button" aria-label="New chat" title="New chat">↻</button>
          <button class="dai-icon-btn dai-close" type="button" aria-label="Close Dazzle AI" title="Close">×</button>
        </div>
      </header>

      <div class="dai-messages" aria-live="polite"></div>

      <div class="dai-composer">
        <form class="dai-form">
          <input class="dai-input" type="text" autocomplete="off" maxlength="800"
                 placeholder="Ask Dazzle AI..." aria-label="Message Dazzle AI">
          <button class="dai-send" type="submit" aria-label="Send message" title="Send">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M21 3 10 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <path d="m21 3-7 18-4-7-7-4 18-7Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
          </button>
        </form>
        <div class="dai-footer-row">
          <button class="dai-clear" type="button">Clear chat</button>
          <span class="dai-powered">AI can make mistakes · <a href="contact.html" style="color:#7057ff;text-decoration:none;font-weight:700">Start a project</a></span>
        </div>
      </div>
    `;

    document.body.appendChild(panel);
    document.body.appendChild(launcher);

    const messagesEl = panel.querySelector(".dai-messages");
    const input = panel.querySelector(".dai-input");
    const form = panel.querySelector(".dai-form");
    const send = panel.querySelector(".dai-send");

    let history = loadHistory();

    const renderWelcome = () => {
      messagesEl.innerHTML = `
        <div class="dai-welcome">
          <strong>Hi, I’m Dazzle ✦</strong>
          <p>Ask me about websites, graphic design, packages or your project. You can write in English, Urdu or Roman Urdu.</p>
        </div>
        <div class="dai-quick">
          <button type="button" data-prompt="What website services do you offer?">🌐 Website</button>
          <button type="button" data-prompt="What graphic design services do you offer?">✦ Graphic Design</button>
          <button type="button" data-prompt="I want a quote for my project. How should I start?">💬 Get a Quote</button>
          <button type="button" data-prompt="Show me the projects and types of websites you have developed.">↗ Projects</button>
        </div>`;
      messagesEl.querySelectorAll(".dai-quick button").forEach(btn => {
        btn.addEventListener("click", () => {
          input.value = btn.dataset.prompt || "";
          form.requestSubmit();
        });
      });
    };

    const scrollBottom = () => {
      requestAnimationFrame(() => { messagesEl.scrollTop = messagesEl.scrollHeight; });
    };

    const addMessage = (role, text, persist=true) => {
      const row = document.createElement("div");
      row.className = `dai-message ${role === "user" ? "user" : "assistant"}`;
      if (role === "assistant") {
        row.innerHTML = `
          <div class="dai-msg-avatar"><img src="${BOT_IMAGE}" alt="Dazzle AI"></div>
          <div class="dai-bubble-msg">${linkify(text)}<span class="dai-msg-time">${now()}</span></div>`;
      } else {
        row.innerHTML = `<div class="dai-bubble-msg">${linkify(text)}<span class="dai-msg-time">${now()}</span></div>`;
      }
      messagesEl.appendChild(row);
      if (persist) {
        history.push({role, text});
        saveHistory(history);
      }
      scrollBottom();
      return row;
    };

    const showTyping = () => {
      const row = document.createElement("div");
      row.className = "dai-message assistant";
      row.id = "daiTypingRow";
      row.innerHTML = `
        <div class="dai-msg-avatar"><img src="${BOT_IMAGE}" alt="Dazzle AI"></div>
        <div class="dai-bubble-msg dai-typing"><span></span><span></span><span></span></div>`;
      messagesEl.appendChild(row);
      scrollBottom();
    };

    const hideTyping = () => document.getElementById("daiTypingRow")?.remove();

    const renderSaved = () => {
      renderWelcome();
      if (!history.length) return;
      history.forEach(m => addMessage(m.role, m.text, false));
      scrollBottom();
    };

    const open = () => {
      panel.classList.add("is-open");
      panel.setAttribute("aria-hidden","false");
      launcher.setAttribute("aria-expanded","true");
      if (window.innerWidth <= 600) document.body.classList.add("dai-chat-lock");
      setTimeout(() => input.focus({preventScroll:true}), 120);
    };

    const close = () => {
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden","true");
      launcher.setAttribute("aria-expanded","false");
      document.body.classList.remove("dai-chat-lock");
      launcher.focus({preventScroll:true});
    };

    launcher.addEventListener("click", () => panel.classList.contains("is-open") ? close() : open());
    panel.querySelector(".dai-close").addEventListener("click", close);

    panel.querySelector(".dai-reset").addEventListener("click", () => {
      history = [];
      localStorage.removeItem(STORAGE_KEY);
      renderWelcome();
      input.focus();
    });

    panel.querySelector(".dai-clear").addEventListener("click", () => {
      history = [];
      localStorage.removeItem(STORAGE_KEY);
      renderWelcome();
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text || send.disabled) return;

      addMessage("user", text);
      input.value = "";
      send.disabled = true;
      showTyping();

      try {
        const response = await fetch("/api/chat", {
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify({
            message:text,
            history:history.slice(-MAX_HISTORY).map(m => ({role:m.role,text:m.text}))
          })
        });

        const data = await response.json().catch(() => ({}));
        hideTyping();

        if (!response.ok) {
          throw new Error(data.error || "The assistant could not respond right now.");
        }

        addMessage("assistant", data.reply || "I’m here. Please tell me a little more about your project.");
      } catch (error) {
        hideTyping();
        const fallback = "I’m having trouble connecting to the AI service right now. You can still start your project through the Contact page or WhatsApp.";
        addMessage("assistant", fallback);
        console.error("Dazzle AI:", error);
      } finally {
        send.disabled = false;
        input.focus();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && panel.classList.contains("is-open")) close();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 600) document.body.classList.remove("dai-chat-lock");
    });

    // Initial render
    renderSaved();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
