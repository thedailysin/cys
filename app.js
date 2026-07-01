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
  startedAt: null,
  isMuted: false
};

let audio = null;
let posthogReady = false;
let posthogFailed = false;
const pendingPostHogEvents = [];
const RETORT_DURATION = 2160;

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
    <button class="mute-button" type="button" id="muteButton" aria-label="${label}">
      ${state.isMuted ? "Sound Off" : "Sound On"}
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
    muteButton.textContent = state.isMuted ? "Sound Off" : "Sound On";
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
  state.lead = { name: "", email: "", phone: "" };
  state.startedAt = new Date().toISOString();

  startMusic();
  track("game_started");
  renderQuiz();
}

function renderQuiz() {
  const question = QUESTIONS[state.currentQuestionIndex];
  const progress = (state.currentQuestionIndex / QUESTIONS.length) * 100;

  setScreen(`
    <section class="screen is-changing">
      <div class="quiz-shell">
        <div class="quiz-content" id="quizContent">
          <h2 class="question">${escapeHtml(question.question)}</h2>
          <div class="answers">
            ${question.answers.map((answer, index) => `
              <button
                class="answer-button"
                type="button"
                data-answer-index="${index}"
                aria-label="${escapeHtml(answer.text)}"
              >${escapeHtml(answer.text)}</button>
            `).join("")}
          </div>
        </div>
        ${renderProgress(progress)}
      </div>
    </section>
  `, () => {
    app.querySelectorAll(".answer-button").forEach((button) => {
      button.addEventListener("click", () => selectAnswer(Number(button.dataset.answerIndex)));
    });
  });
}

function renderProgress(progress) {
  return `
    <div class="progress" aria-hidden="true">
      <div class="progress-fill" style="width: ${progress}%"></div>
    </div>
  `;
}

function selectAnswer(answerIndex) {
  const question = QUESTIONS[state.currentQuestionIndex];
  const answer = question.answers[answerIndex];

  if (!answer) {
    return;
  }

  state.answerHistory.push(answer.traits);
  track("question_answered", {
    questionId: question.id,
    questionIndex: state.currentQuestionIndex,
    answerText: answer.text,
    identityTraits: answer.traits
  });

  const quizContent = document.getElementById("quizContent");
  quizContent.classList.add("is-fading");

  window.setTimeout(() => {
    quizContent.innerHTML = `<p class="retort">${escapeHtml(answer.retort)}</p>`;
    quizContent.classList.remove("is-fading");
  }, 240);

  window.setTimeout(() => {
    state.currentQuestionIndex += 1;

    if (state.currentQuestionIndex >= QUESTIONS.length) {
      renderLeadForm();
      return;
    }

    renderQuiz();
  }, RETORT_DURATION);
}

function renderLeadForm() {
  setScreen(`
    <section class="screen is-changing">
      <form class="lead-form" id="leadForm" novalidate>
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
        <button class="button button-primary" type="submit" id="leadSubmit">Reveal Result</button>
      </form>
    </section>
  `, () => {
    document.getElementById("leadForm").addEventListener("submit", submitLead);
  });
}

async function submitLead(event) {
  event.preventDefault();

  const name = document.getElementById("leadName").value.trim();
  const email = document.getElementById("leadEmail").value.trim();
  const phone = document.getElementById("leadPhone").value.trim();
  const error = document.getElementById("formError");
  const button = document.getElementById("leadSubmit");

  if (!name) {
    error.textContent = "Name is required.";
    return;
  }

  if (!email || !email.includes("@")) {
    error.textContent = "Enter a valid email.";
    return;
  }

  error.textContent = "";
  button.disabled = true;
  button.textContent = "Thinking...";

  state.lead = { name, email, phone };
  state.identityKey = calculateIdentity(state.answerHistory);
  const identity = IDENTITIES[state.identityKey] || IDENTITIES.sinnerAmateur;

  const payload = {
    timestamp: new Date().toISOString(),
    name,
    email,
    phone,
    identity: identity.title,
    source: "Confessional",
    userAgent: navigator.userAgent
  };

  try {
    await fetch(CONFIG.GOOGLE_SCRIPT_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: JSON.stringify(payload)
    });
  } catch (submitError) {
    console.error("Lead submission failed", submitError);
  }

  track("lead_submitted", {
    identity: identity.title
  });
  track("identity_assigned", {
    identity: identity.title
  });

  renderResult();
}

function renderResult() {
  if (!state.identityKey) {
    state.identityKey = calculateIdentity(state.answerHistory);
  }

  const identity = IDENTITIES[state.identityKey] || IDENTITIES.sinnerAmateur;
  const imageUrl = CONFIG.IDENTITY_IMAGES[state.identityKey] || "";

  setScreen(`
    <section class="screen is-changing">
      <div class="result-panel">
        <p class="result-kicker">You are a</p>
        ${renderResultCard(identity, imageUrl)}
        <p class="identity-description">${escapeHtml(identity.description)}</p>
        <div class="button-row">
          <button class="button button-primary" type="button" id="shareButton">Forward to Someone Worse</button>
          <button class="button button-secondary" type="button" id="playAgainButton">Play Again</button>
        </div>
      </div>
    </section>
  `, () => {
    document.getElementById("shareButton").addEventListener("click", shareResult);
    document.getElementById("playAgainButton").addEventListener("click", playAgain);
  });
}

function renderResultCard(identity, imageUrl) {
  return `
    <div class="result-card">
      ${imageUrl ? `<img class="identity-image" src="${escapeAttribute(imageUrl)}" alt="${escapeAttribute(identity.title)}" loading="lazy">` : ""}
      ${renderIdentityTitle(identity)}
    </div>
  `;
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

  try {
    const shareFile = await createShareCardFile(identity);
    if (navigator.share) {
      if (shareFile && navigator.canShare && navigator.canShare({ files: [shareFile] })) {
        await navigator.share({
          text: shareText,
          files: [shareFile]
        });
        return;
      }

      await navigator.share({ text: shareText });
      return;
    }

    await navigator.clipboard.writeText(shareText);
    showCopiedState();
  } catch (error) {
    console.error("Sharing failed", error);
    showCopiedState("Copy failed");
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
    context.fillStyle = "#ffffff";
    context.font = "400 88px Outfit, sans-serif";
    context.fillText(formatIdentityMain(displayTitle[0] || ""), canvas.width / 2, 990);
    context.font = "400 86px 'Absolut Handwritten', Outfit, sans-serif";
    context.fillText(formatIdentityScript(displayTitle[1] || ""), canvas.width / 2, 1080);

    context.fillStyle = "#64645f";
    context.font = "400 42px Outfit, sans-serif";
    wrapCanvasText(context, identity.description, canvas.width / 2, 1245, 840, 54);

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
  const button = document.getElementById("shareButton");
  if (!button) {
    return;
  }

  const original = button.textContent;
  button.textContent = text || "Copied";
  window.setTimeout(() => {
    button.textContent = original;
  }, 1200);
}

function playAgain() {
  track("play_again");
  startGame();
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
