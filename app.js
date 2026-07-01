const app = document.getElementById("app");

const state = {
  currentQuestionIndex: 0,
  answerHistory: [],
  identityKey: null,
  lead: {
    name: "",
    email: "",
    phone: ""
  },
  resultVariant: null,
  startedAt: null,
  isMuted: false
};

let audio = null;
let posthogReady = false;
let posthogFailed = false;
let interactionLocked = false;
const pendingPostHogEvents = [];
const RETORT_DURATION = 2160;
const CARD_COLORS = ["#37C155", "#47D86A", "#22B84B", "#7BEA8F", "#B6F35C", "#19C98B", "#D8FF64"];
const RESULT_REVEAL_DURATION = 1200;

function track(eventName, properties) {
  try {
    if (posthogReady && window.posthog && typeof window.posthog.capture === "function") {
      window.posthog.capture(eventName, properties || {});
      return;
    }

    if (!posthogFailed) {
      pendingPostHogEvents.push({
        eventName,
        properties: properties || {}
      });
    }
  } catch (error) {
    console.error("PostHog tracking failed", error);
  }
}

function initPostHog() {
  if (!CONFIG.POSTHOG_KEY || !CONFIG.POSTHOG_HOST || posthogReady) {
    return;
  }

  try {
    installPostHogSnippet();
    window.posthog.init(CONFIG.POSTHOG_KEY, {
      api_host: CONFIG.POSTHOG_HOST,
      defaults: "2026-05-30",
      autocapture: false,
      capture_pageview: false,
      disable_session_recording: true,
      disable_surveys: true,
      advanced_disable_decide: true,
      loaded: () => {
        posthogReady = true;
        flushPostHogEvents();
      }
    });

    window.setTimeout(() => {
      if (!posthogReady) {
        console.error("PostHog did not finish loading");
      }
    }, 6000);
  } catch (error) {
    posthogFailed = true;
    console.error("PostHog setup failed", error);
  }
}

function installPostHogSnippet() {
  if (window.posthog && window.posthog.__SV) {
    return;
  }

  (function (documentRef, posthogRef) {
    let methodIndex;
    let methodNames;
    let script;
    let firstScript;

    if (posthogRef.__SV) {
      return;
    }

    window.posthog = posthogRef;
    posthogRef._i = [];
    posthogRef.init = function (key, config, name) {
      function addStub(target, methodName) {
        const parts = methodName.split(".");
        if (parts.length === 2) {
          target = target[parts[0]];
          methodName = parts[1];
        }
        target[methodName] = function () {
          target.push([methodName].concat(Array.prototype.slice.call(arguments, 0)));
        };
      }

      script = documentRef.createElement("script");
      script.type = "text/javascript";
      script.crossOrigin = "anonymous";
      script.async = true;
      script.src = `${config.api_host.replace(".i.posthog.com", "-assets.i.posthog.com")}/static/array.js`;
      firstScript = documentRef.getElementsByTagName("script")[0];
      firstScript.parentNode.insertBefore(script, firstScript);

      let target = posthogRef;
      if (name !== undefined) {
        target = posthogRef[name] = [];
      } else {
        name = "posthog";
      }

      target.people = target.people || [];
      target.toString = function (isPeople) {
        let value = "posthog";
        if (name !== "posthog") {
          value += `.${name}`;
        }
        if (!isPeople) {
          value += " (stub)";
        }
        return value;
      };
      target.people.toString = function () {
        return `${target.toString(1)}.people (stub)`;
      };

      methodNames = "init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" ");
      for (methodIndex = 0; methodIndex < methodNames.length; methodIndex += 1) {
        addStub(target, methodNames[methodIndex]);
      }

      posthogRef._i.push([key, config, name]);
    };
    posthogRef.__SV = 1;
  })(document, window.posthog || []);
}

function flushPostHogEvents() {
  try {
    while (pendingPostHogEvents.length > 0) {
      const event = pendingPostHogEvents.shift();
      window.posthog.capture(event.eventName, event.properties);
    }

    window.posthog.capture("posthog_ready", {
      source: "Confessional"
    });
  } catch (error) {
    console.error("PostHog flush failed", error);
  }
}

function startMusic() {
  try {
    if (!audio) {
      audio = new Audio(CONFIG.MUSIC_URL);
      audio.loop = true;
      audio.preload = "auto";
      audio.volume = 0.42;
    }

    audio.muted = state.isMuted;

    const playAttempt = audio.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch((error) => console.error("Music failed to start", error));
    }
  } catch (error) {
    console.error("Music setup failed", error);
  }
}

function setScreen(html, afterRender) {
  app.innerHTML = `${renderMuteButton()}${html}`;
  const muteButton = document.getElementById("muteButton");
  if (muteButton) {
    muteButton.addEventListener("click", toggleMute);
  }

  window.requestAnimationFrame(() => {
    const screen = app.querySelector(".screen");
    if (screen) {
      screen.classList.remove("is-changing");
    }
    if (typeof afterRender === "function") {
      afterRender();
    }
  });
}

function renderMuteButton() {
  if (!state.startedAt) {
    return "";
  }

  const label = state.isMuted ? "Unmute music" : "Mute music";
  return `
    <button class="mute-button ${state.isMuted ? "is-off" : "is-on"}" type="button" id="muteButton" aria-label="${label}">
      ${state.isMuted ? "♪" : "♫"}
    </button>
  `;
}

function toggleMute() {
  state.isMuted = !state.isMuted;

  if (audio) {
    audio.muted = state.isMuted;
  }

  const muteButton = document.getElementById("muteButton");
  if (muteButton) {
    muteButton.textContent = state.isMuted ? "♪" : "♫";
    muteButton.classList.toggle("is-off", state.isMuted);
    muteButton.classList.toggle("is-on", !state.isMuted);
    muteButton.setAttribute("aria-label", state.isMuted ? "Unmute music" : "Mute music");
  }
}

function renderLanding() {
  setScreen(`
    <section class="screen is-changing">
      <div class="brand-lockup">
        <img class="landing-logo" src="${escapeAttribute(CONFIG.LOGO_SVG)}" alt="The Daily Sin">
        <h1 class="landing-title">Confess Your Sins</h1>
        <p class="landing-subtitle">A Never ending series<br>of Bad Decisions</p>
      </div>
      <div class="button-row">
        <button class="button button-primary button-caps" type="button" id="startButton">Confess Now</button>
      </div>
    </section>
  `, () => {
    document.getElementById("startButton").addEventListener("click", startGame);
  });
}

function startGame() {
  state.currentQuestionIndex = 0;
  state.answerHistory = [];
  state.identityKey = null;
  state.resultVariant = null;
  state.lead = { name: "", email: "", phone: "" };
  state.startedAt = new Date().toISOString();

  startMusic();
  track("game_started");
  renderQuiz();
}

function renderQuiz() {
  interactionLocked = false;
  const question = QUESTIONS[state.currentQuestionIndex];

  setScreen(`
    <section class="screen quiz-screen is-changing">
      <div class="quiz-shell">
        <div class="deck-stage">
          ${renderDeckBacks()}
          <div class="swipe-card quiz-card" id="quizContent" style="--card-bg: ${getCardColor(state.currentQuestionIndex)}">
            <h2 class="question">${escapeHtml(question.question)}</h2>
            <div class="direction-row">
              <button class="direction-choice direction-left" type="button" data-answer-index="0">
                <span>←</span>
                <span>${escapeHtml(question.answers[0].text)}</span>
              </button>
              <button class="direction-choice direction-right" type="button" data-answer-index="1">
                <span>${escapeHtml(question.answers[1].text)}</span>
                <span>→</span>
              </button>
            </div>
            <p class="swipe-hint">Swipe toward your answer</p>
          </div>
        </div>
        ${renderProgress()}
      </div>
    </section>
  `, () => {
    app.querySelectorAll(".direction-choice").forEach((button) => {
      const index = Number(button.dataset.answerIndex);
      button.addEventListener("click", () => selectAnswer(index, index === 0 ? "left" : "right"));
    });
    setupSwipeCard(document.getElementById("quizContent"), {
      onLeft: () => selectAnswer(0, "left"),
      onRight: () => selectAnswer(1, "right")
    });
  });
}

function renderDeckBacks() {
  return `
    <div class="deck-back deck-back-one"></div>
    <div class="deck-back deck-back-two"></div>
  `;
}

function renderProgress() {
  return `
    <div class="story-progress" style="--segments: ${QUESTIONS.length}" aria-hidden="true">
      ${QUESTIONS.map((question, index) => {
        const className = index < state.currentQuestionIndex
          ? "story-segment is-complete"
          : index === state.currentQuestionIndex
            ? "story-segment is-current"
            : "story-segment";
        return `<span class="${className}"></span>`;
      }).join("")}
    </div>
  `;
}

function selectAnswer(answerIndex, direction) {
  if (interactionLocked) {
    return;
  }

  const question = QUESTIONS[state.currentQuestionIndex];
  const answer = question.answers[answerIndex];

  if (!answer) {
    return;
  }

  interactionLocked = true;

  state.answerHistory.push(answer.traits);
  track("question_answered", {
    questionId: question.id,
    questionIndex: state.currentQuestionIndex,
    answerText: answer.text,
    identityTraits: answer.traits
  });

  const quizContent = document.getElementById("quizContent");
  if (quizContent) {
    quizContent.classList.add(direction === "right" ? "is-swiped-right" : "is-swiped-left");
  }

  window.setTimeout(() => {
    renderRetort(answer.retort);
  }, 300);

  window.setTimeout(() => {
    state.currentQuestionIndex += 1;

    if (state.currentQuestionIndex >= QUESTIONS.length) {
      renderLeadForm();
      return;
    }

    renderQuiz();
  }, RETORT_DURATION);
}

function renderRetort(retort) {
  setScreen(`
    <section class="screen quiz-screen">
      <div class="quiz-shell">
        <div class="deck-stage">
          ${renderDeckBacks()}
          <div class="swipe-card retort-card" style="--card-bg: ${getCardColor(state.currentQuestionIndex + 1)}">
            <div class="retort-timer" aria-hidden="true"></div>
            <p class="retort">${escapeHtml(retort)}</p>
          </div>
        </div>
        ${renderProgress()}
      </div>
    </section>
  `);
}

function renderLeadForm() {
  interactionLocked = false;

  setScreen(`
    <section class="screen lead-screen is-changing">
      <div class="deck-stage">
        <form class="swipe-card lead-form" id="leadForm" style="--card-bg: #F4FFF6" novalidate>
          <h2 class="screen-title"><span>Before we make this</span> <span class="handwritten">Official</span></h2>

          <label class="field">
            <span class="visually-hidden">Name</span>
            <input id="leadName" name="name" type="text" autocomplete="name" placeholder="Name" required>
          </label>

          <label class="field">
            <span class="visually-hidden">Email</span>
            <input id="leadEmail" name="email" type="email" autocomplete="email" placeholder="Email" required>
          </label>

          <label class="field">
            <span class="visually-hidden">Phone</span>
            <input id="leadPhone" name="phone" type="tel" autocomplete="tel" placeholder="Phone (optional)">
          </label>

          <p class="form-error" id="formError" role="alert"></p>
          <p class="lead-swipe-copy">Swipe to reveal</p>
          <p class="lead-disclaimer">By swiping, you agree to hear from The Daily Sin about offers, updates, and questionable choices.</p>
        </form>
      </div>
      ${renderProgress()}
    </section>
  `, () => {
    const form = document.getElementById("leadForm");
    form.addEventListener("submit", submitLead);
    setupSwipeCard(form, {
      ignoreInteractive: true,
      animateOnSwipe: false,
      onLeft: () => submitLead(),
      onRight: () => submitLead()
    });
  });
}

async function submitLead(event) {
  if (event) {
    event.preventDefault();
  }

  const name = document.getElementById("leadName").value.trim();
  const email = document.getElementById("leadEmail").value.trim();
  const phone = document.getElementById("leadPhone").value.trim();
  const error = document.getElementById("formError");
  const form = document.getElementById("leadForm");

  if (interactionLocked) {
    return;
  }

  if (!name) {
    error.textContent = "Name is required.";
    return;
  }

  if (!email || !email.includes("@")) {
    error.textContent = "Enter a valid email.";
    return;
  }

  error.textContent = "";
  interactionLocked = true;
  if (form) {
    form.classList.add("is-swiped-right");
  }

  state.lead = { name, email, phone };
  state.identityKey = calculateIdentity(state.answerHistory);
  const identity = IDENTITIES[state.identityKey] || IDENTITIES.sinnerAmateur;
  state.resultVariant = pickResultVariant(identity);

  const payload = {
    timestamp: new Date().toISOString(),
    name,
    email,
    phone,
    identity: identity.title,
    source: "Confessional",
    userAgent: navigator.userAgent
  };

  submitLeadPayload(payload);

  track("lead_submitted", {
    identity: identity.title
  });
  track("identity_assigned", {
    identity: identity.title
  });

  window.setTimeout(() => {
    renderResultTravel();
  }, 420);
}

async function submitLeadPayload(payload) {
  try {
    await fetch(CONFIG.GOOGLE_SCRIPT_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload)
    });
  } catch (submitError) {
    console.error("Lead submission failed", submitError);
  }
}

function renderResultTravel() {
  const identity = IDENTITIES[state.identityKey] || IDENTITIES.sinnerAmateur;
  const imageUrl = CONFIG.IDENTITY_IMAGES[state.identityKey] || "";

  setScreen(`
    <section class="screen result-travel-screen">
      <div class="travel-wrap">
        <div class="travel-card">
          ${imageUrl ? `<img class="identity-image" src="${escapeAttribute(imageUrl)}" alt="">` : ""}
        </div>
      </div>
    </section>
  `);

  Promise.race([
    preloadResultImage(imageUrl),
    new Promise((resolve) => window.setTimeout(resolve, 900))
  ]).finally(() => {
    window.setTimeout(() => renderResult(true), RESULT_REVEAL_DURATION);
  });
}

function preloadResultImage(imageUrl) {
  if (!imageUrl) {
    return Promise.resolve();
  }

  return loadImage(imageUrl).catch((error) => {
    console.error("Result image preload failed", error);
  });
}

function renderResult(showConfetti) {
  if (!state.identityKey) {
    state.identityKey = calculateIdentity(state.answerHistory);
  }

  const identity = IDENTITIES[state.identityKey] || IDENTITIES.sinnerAmateur;
  const imageUrl = CONFIG.IDENTITY_IMAGES[state.identityKey] || "";
  const variant = state.resultVariant || pickResultVariant(identity);
  state.resultVariant = variant;
  interactionLocked = false;

  setScreen(`
    <section class="screen result-screen is-changing">
      <div class="result-panel">
        <p class="result-kicker">You are a</p>
        ${renderResultCard(identity, imageUrl, variant)}
        <p class="identity-description">${escapeHtml(variant.description)}</p>
        <div class="result-actions result-actions-delayed">
          <button class="button button-primary" type="button" id="shareButton">Forward to Someone Worse</button>
          <button class="button button-secondary" type="button" id="playAgainButton">Play Again</button>
        </div>
        ${showConfetti ? renderConfetti() : ""}
      </div>
    </section>
  `, () => {
    const resultCard = document.querySelector(".result-card");
    if (resultCard) {
      resultCard.addEventListener("click", () => flipResultCard(resultCard));
    }
    document.getElementById("shareButton").addEventListener("click", shareResult);
    document.getElementById("playAgainButton").addEventListener("click", playAgain);
  });
}

function renderConfetti() {
  return `
    <div class="confetti" aria-hidden="true">
      ${Array.from({ length: 34 }, (_, index) => {
        const angle = (index / 34) * Math.PI * 2;
        const distance = 110 + (index % 7) * 24;
        const x = Math.round(Math.cos(angle) * distance);
        const y = Math.round(Math.sin(angle) * distance - 80);
        const delay = (index % 6) * 28;
        return `<span style="--x: ${x}px; --y: ${y}px; --r: ${index * 23}deg; --r2: ${index * 71}deg; --d: ${delay}ms"></span>`;
      }).join("")}
    </div>
  `;
}

function setupSwipeCard(card, options) {
  if (!card) {
    return;
  }

  const threshold = 86;
  let startX = 0;
  let startY = 0;
  let currentX = 0;
  let currentY = 0;
  let dragging = false;

  card.addEventListener("pointerdown", (event) => {
    if (options.ignoreInteractive && event.target.closest("input, button, textarea, select, a")) {
      return;
    }

    dragging = true;
    startX = event.clientX;
    startY = event.clientY;
    currentX = 0;
    currentY = 0;
    card.classList.add("is-dragging");
    card.setPointerCapture(event.pointerId);
  });

  card.addEventListener("pointermove", (event) => {
    if (!dragging) {
      return;
    }

    currentX = event.clientX - startX;
    currentY = event.clientY - startY;
    const rotate = currentX / 18;
    card.style.transform = `translate(${currentX}px, ${currentY * 0.12}px) rotate(${rotate}deg)`;
    card.dataset.swipe = currentX < 0 ? "left" : "right";
  });

  card.addEventListener("pointerup", (event) => {
    if (!dragging) {
      return;
    }

    dragging = false;
    card.classList.remove("is-dragging");
    card.releasePointerCapture(event.pointerId);

    if (Math.abs(currentX) >= threshold) {
      if (currentX < 0) {
        if (options.animateOnSwipe !== false) {
          card.classList.add("is-swiped-left");
        }
        options.onLeft();
      } else {
        if (options.animateOnSwipe !== false) {
          card.classList.add("is-swiped-right");
        }
        options.onRight();
      }
      if (options.animateOnSwipe === false && !interactionLocked) {
        card.style.transform = "";
        card.removeAttribute("data-swipe");
      }
      return;
    }

    if (Math.abs(currentX) < 8 && Math.abs(currentY) < 8 && typeof options.onTap === "function") {
      options.onTap();
    }

    card.style.transform = "";
    card.removeAttribute("data-swipe");
  });

  card.addEventListener("pointercancel", () => {
    dragging = false;
    card.classList.remove("is-dragging");
    card.style.transform = "";
    card.removeAttribute("data-swipe");
  });
}

function getCardColor(index) {
  return CARD_COLORS[index % CARD_COLORS.length];
}

function renderResultCard(identity, imageUrl, variant) {
  const textClass = identity.cardText === "black" ? "has-black-text" : "has-white-text";

  return `
    <div class="result-card ${textClass}" style="--card-back: ${escapeAttribute(identity.cardBack)}">
      <div class="result-card-inner">
        <div class="result-card-face result-card-front">
          ${imageUrl ? `<img class="identity-image" src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(identity.title)}" loading="lazy">` : ""}
          ${renderIdentityTitle(identity)}
        </div>
        <div class="result-card-face result-card-back">
          <h3>Previous Offences</h3>
          <ul>
            ${variant.offences.map((offence) => `<li>${escapeHtml(offence)}</li>`).join("")}
          </ul>
        </div>
      </div>
    </div>
  `;
}

function flipResultCard(card) {
  if (!card) {
    return;
  }

  card.classList.toggle("is-flipped");
}

function renderIdentityTitle(identity) {
  const displayTitle = Array.isArray(identity.displayTitle) ? identity.displayTitle : [identity.title, ""];
  return `
    <h2 class="identity-title">
      <span class="identity-title-main">${escapeHtml(formatIdentityMain(displayTitle[0] || ""))}</span>
      <span class="identity-title-script">${escapeHtml(formatIdentityScript(displayTitle[1] || ""))}</span>
    </h2>
  `;
}

async function shareResult() {
  const identity = IDENTITIES[state.identityKey] || IDENTITIES.sinnerAmateur;
  const shareText = `Took a personality test.

Turns out I'm a ${toTitleCase(identity.title)}.

Not Arguing

${CONFIG.SHARE_URL}`;

  track("share_clicked", {
    identity: identity.title
  });

  const shareFile = await createShareCardFile(identity);

  if (navigator.share) {
    try {
      if (shareFile && navigator.canShare && navigator.canShare({ files: [shareFile] })) {
        await navigator.share({
          text: shareText,
          files: [shareFile]
        });
        return;
      }

      await navigator.share({ text: shareText });
      return;
    } catch (error) {
      if (error && error.name === "AbortError") {
        return;
      }
      console.error("Native sharing failed", error);
    }
  }

  try {
    await navigator.clipboard.writeText(shareText);
    showCopiedState();
  } catch (error) {
    console.error("Clipboard sharing failed", error);
    if (copyWithTextarea(shareText)) {
      showCopiedState();
      return;
    }
    showCopiedState("Well, that's embarrassing. Screenshot?");
  }
}

async function createShareCardFile(identity) {
  try {
    const imageUrl = CONFIG.IDENTITY_IMAGES[state.identityKey];
    if (!imageUrl) {
      return null;
    }

    const image = await loadImage(imageUrl);
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1600;

    const context = canvas.getContext("2d");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "#000000";
    context.font = "700 48px Outfit, sans-serif";
    context.textAlign = "center";
    context.fillText("You are a", canvas.width / 2, 155);

    drawCoverImage(context, image, 160, 230, 760, 900);

    const displayTitle = Array.isArray(identity.displayTitle) ? identity.displayTitle : [identity.title, ""];
    context.fillStyle = identity.cardText === "black" ? "#000000" : "#ffffff";
    context.font = "400 88px Outfit, sans-serif";
    context.fillText(formatIdentityMain(displayTitle[0] || ""), canvas.width / 2, 990);
    context.font = "400 86px 'Absolut Handwritten', Outfit, sans-serif";
    context.fillText(formatIdentityScript(displayTitle[1] || ""), canvas.width / 2, 1080);

    context.fillStyle = "#64645f";
    context.font = "400 42px Outfit, sans-serif";
    const variant = state.resultVariant || pickResultVariant(identity);
    wrapCanvasText(context, variant.description, canvas.width / 2, 1245, 840, 54);

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) {
      return null;
    }

    return new File([blob], "daily-sin-result.png", { type: "image/png" });
  } catch (error) {
    console.error("Share image creation failed", error);
    return null;
  }
}

function copyWithTextarea(text) {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
  } catch (error) {
    console.error("Textarea copy failed", error);
    return false;
  }
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

function drawCoverImage(context, image, x, y, width, height) {
  const imageRatio = image.width / image.height;
  const boxRatio = width / height;
  const sourceWidth = imageRatio > boxRatio ? image.height * boxRatio : image.width;
  const sourceHeight = imageRatio > boxRatio ? image.height : image.width / boxRatio;
  const sourceX = (image.width - sourceWidth) / 2;
  const sourceY = (image.height - sourceHeight) / 2;
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

function wrapCanvasText(context, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" ");
  let line = "";

  words.forEach((word, index) => {
    const testLine = line ? `${line} ${word}` : word;
    if (context.measureText(testLine).width > maxWidth && line) {
      context.fillText(line, x, y);
      line = word;
      y += lineHeight;
    } else {
      line = testLine;
    }

    if (index === words.length - 1 && line) {
      context.fillText(line, x, y);
    }
  });
}

function showCopiedState(text) {
  const target = document.getElementById("shareButton");
  if (!target) {
    return;
  }

  const original = target.textContent;
  target.textContent = text || "Copied";
  window.setTimeout(() => {
    target.textContent = original;
  }, 1200);
}

function playAgain() {
  track("play_again");
  startGame();
}

function pickResultVariant(identity) {
  const descriptions = Array.isArray(identity.descriptions) ? identity.descriptions : [identity.description || ""];
  const offenceSets = Array.isArray(identity.previousOffences) ? identity.previousOffences : [[]];

  return {
    description: descriptions[Math.floor(Math.random() * descriptions.length)] || "",
    offences: offenceSets[Math.floor(Math.random() * offenceSets.length)] || []
  };
}

function formatIdentityMain(value) {
  return toTitleCase(value);
}

function formatIdentityScript(value) {
  return toTitleCase(value).toUpperCase();
}

function toTitleCase(value) {
  return String(value)
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function shouldUseBlackCardText(identityKey) {
  const identity = IDENTITIES[identityKey];
  return identity ? identity.cardText === "black" : false;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

initPostHog();
renderLanding();
