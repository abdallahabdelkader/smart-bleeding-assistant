// مساعد النزيف والجروح الذكي — منطق التقييم وشنطة الإسعاف

/* ---------- تقييم الحالة ---------- */

var ICON_WARN = '<svg class="icon" viewBox="0 0 24 24"><path d="M12 3 2 21h20z"/><path d="M12 10v5"/><circle class="fill" cx="12" cy="18" r="1"/></svg>';
var ICON_CHECK = '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.5 2.5L16 9"/></svg>';
var ICON_AMBULANCE = '<svg class="icon" viewBox="0 0 24 24"><path d="M3 7h11v9H3z"/><path d="M14 10h4l3 3v3h-7"/><circle cx="7" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/><path d="M8.5 10v4M6.5 12h4"/></svg>';

var QUESTIONS = [
  {
    id: "amount",
    text: "شكل النزيف عامل إزاي؟",
    answers: [
      { label: "دم بيتدفق باستمرار أو بيندفع بقوة، أو كمية كبيرة", value: "severe" },
      { label: "نزيف بسيط أو متوسط وبيوقف", value: "mild" },
      { label: "نزيف من الأنف", value: "nose" }
    ]
  },
  {
    id: "object",
    text: "فيه جسم مغروس في الجرح؟ (زجاج، مسمار، أي حاجة داخلة في الجسم)",
    when: function (a) { return a.amount === "severe" || a.amount === "mild"; },
    answers: [
      { label: "أيوه، فيه جسم مغروس", value: "yes" },
      { label: "لأ، مفيش", value: "no" }
    ]
  },
  {
    id: "limb",
    text: "النزيف في ذراع أو رجل؟",
    when: function (a) { return a.amount === "severe" && a.object === "no"; },
    answers: [
      { label: "أيوه، في ذراع أو رجل", value: "yes" },
      { label: "لأ، في مكان تاني", value: "no" }
    ]
  }
];

var RESULTS = {
  severe_limb: {
    urgent: true,
    title: "نزيف خطير في طرف — تصرف فورًا",
    steps: [
      "اتصل بالإسعاف 123 فورًا أو خلي حد يتصل.",
      "ابدأ الضغط المباشر على الجرح بشاش أو قطعة قماش نظيفة فورًا، والجرح على سطح صلب.",
      "لو متدرب وعندك عاصبة (Tourniquet): اربطها على بعد 5-8 سم فوق الجرح ناحية القلب (مش على مفصل)، وشدّها لحد ما النزيف يقف تمامًا.",
      "سجّل وقت ربط العاصبة، ومتفكهاش أبدًا — فكها للفريق الطبي بس.",
      "لو مفيش عاصبة: استمر في الضغط المباشر من غير ما توقف.",
      "غطّي المصاب ببطانية وخليك معاه وراقب تنفسه لحد ما الإسعاف يوصل."
    ]
  },
  severe_body: {
    urgent: true,
    title: "نزيف خطير — تصرف فورًا",
    steps: [
      "اتصل بالإسعاف 123 فورًا أو خلي حد يتصل.",
      "اضغط مباشرة على الجرح بشاش أو قطعة قماش نظيفة، بقوة وثبات.",
      "لو النزيف في الرقبة أو الكتف أو الأربية أو الضهر ومتدرب: احشُ الجرح بشاش (Wound Packing) واضغط بقوة.",
      "لو الدم بلل الشاش، حط شاش تاني فوقه من غير ما تشيل الأولاني.",
      "مكان زي ده مينفعش معاه عاصبة — الضغط المستمر هو الحل.",
      "غطّي المصاب، طمّنه، وراقب تنفسه ووعيه لحد ما الإسعاف يوصل."
    ]
  },
  embedded: {
    urgent: true,
    title: "جسم مغروس في الجرح — متشيلوش",
    steps: [
      "اتصل بالإسعاف 123 فورًا.",
      "متشيلش الجسم أبدًا — وجوده بيسد النزيف، وشيله ممكن يضاعف النزيف بشكل خطير.",
      "اضغط حوالين الجسم مش عليه.",
      "حط شاش أو قماش سميك حوالين الجسم وثبّته برباط من غير ضغط على الجسم نفسه.",
      "ثبّت الطرف المصاب وخليك مع المصاب لحد ما الإسعاف يوصل."
    ]
  },
  mild: {
    urgent: false,
    title: "جرح بسيط — تقدر تتصرف بنفسك",
    steps: [
      "اغسل إيدك كويس قبل ما تلمس الجرح.",
      "اضغط بشاش نظيف لحد ما النزيف يقف (عادة دقايق قليلة).",
      "اغسل الجرح بمية نظيفة جارية، ونظف حواليه بصابون.",
      "حط مرهم مضاد حيوي لو متاح، وغطّي الجرح ببلاستر أو شاش نظيف.",
      "غيّر الغطاء كل يوم أو لو اتبلل.",
      "روح للدكتور لو الجرح عميق، أو من عضة حيوان، أو ظهر احمرار متزايد أو صديد أو حرارة."
    ]
  },
  nose: {
    urgent: false,
    title: "نزيف أنف — تعامل هادي",
    steps: [
      "اقعد وارجع جسمك لقدام شوية — متارجعش راسك لورا أبدًا.",
      "اضغط على الجزء الطري من الأنف لمدة 10-15 دقيقة متواصلة واتنفس من بؤك.",
      "كمادة باردة على الأنف ممكن تساعد.",
      "بعد ما يقف، متلمسش أنفك ومتنفخهاش لعدة ساعات.",
      "اطلب مساعدة طبية لو النزيف مستمر أكتر من 15-20 دقيقة أو بيتكرر كتير."
    ]
  }
};

function pickResult(answers) {
  if (answers.amount === "nose") return "nose";
  if (answers.object === "yes") return "embedded";
  if (answers.amount === "severe") {
    return answers.limb === "yes" ? "severe_limb" : "severe_body";
  }
  return "mild";
}

function initAssessment() {
  var qArea = document.getElementById("question-area");
  var rArea = document.getElementById("result-area");
  if (!qArea) return;

  var answers = {};
  var step = 0;

  function visibleQuestions() {
    return QUESTIONS.filter(function (q) { return !q.when || q.when(answers); });
  }

  function renderQuestion() {
    var list = visibleQuestions();
    if (step >= list.length) { renderResult(); return; }
    var q = list[step];
    var html = '<div class="stepper">سؤال ' + (step + 1) + ' من ' + list.length + '</div>';
    html += '<div class="question-title">' + q.text + '</div>';
    html += '<div class="answers">';
    q.answers.forEach(function (a) {
      html += '<button class="btn btn-outline" data-value="' + a.value + '">' + a.label + '</button>';
    });
    html += '</div>';
    qArea.innerHTML = html;

    qArea.querySelectorAll("button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        answers[q.id] = btn.getAttribute("data-value");
        step++;
        renderQuestion();
      });
    });
  }

  function renderResult() {
    var key = pickResult(answers);
    var r = RESULTS[key];
    qArea.innerHTML = "";
    rArea.classList.remove("hidden");
    var html = '<div class="result-card ' + (r.urgent ? "urgent" : "calm") + '">';
    html += '<span class="badge">' + (r.urgent ? ICON_WARN + " حالة طارئة" : ICON_CHECK + " حالة بسيطة") + '</span>';
    html += "<h2>" + r.title + "</h2><ol>";
    r.steps.forEach(function (s) { html += "<li>" + s + "</li>"; });
    html += "</ol>";
    if (r.urgent) {
      html += '<div class="result-actions"><a class="btn btn-emergency" href="tel:123">' + ICON_AMBULANCE + ' اتصل بالإسعاف 123</a></div>';
    }
    html += '<div class="result-actions">';
    html += '<button class="btn btn-outline" id="restart-btn">ابدأ تقييم جديد</button>';
    html += '<a class="btn btn-outline" href="guide.html">افتح دليل الإسعافات</a>';
    html += "</div></div>";
    rArea.innerHTML = html;

    document.getElementById("restart-btn").addEventListener("click", function () {
      answers = {};
      step = 0;
      rArea.classList.add("hidden");
      rArea.innerHTML = "";
      renderQuestion();
    });
  }

  renderQuestion();
}

/* ---------- شنطة الإسعاف ---------- */

var KIT_ITEMS = [
  "شاش معقم (أكياس مختلفة المقاسات)",
  "رباط ضاغط (لفة شاش)",
  "بلاستر جروح بمقاسات مختلفة",
  "عاصبة نزيف (Tourniquet)",
  "جوانتيات طبية (للاتكس إن أمكن)",
  "مقص طبي وملقاط",
  "مطهر (بيتادين أو كحول 70%)",
  "كمادات لاصقة معقمة",
  "مرهم مضاد حيوي",
  "مسكن ألم (باراسيتامول)",
  "ترمومتر",
  "كمادات باردة فورية",
  "مية نظيفة أو محلول ملح للغسيل",
  "بطانية طوارئ (حرارية)",
  "مثلث ربط (لتثبيت الكسور)",
  "كارت بأرقام الطوارئ وبياناتك الطبية"
];

var KIT_KEY = "firstaid-kit-v1";

function loadKitState() {
  try {
    var raw = localStorage.getItem(KIT_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveKitState(state) {
  try {
    localStorage.setItem(KIT_KEY, JSON.stringify(state));
  } catch (e) { /* private mode */ }
}

function initKit() {
  var listEl = document.getElementById("kit-list");
  if (!listEl) return;

  var state = loadKitState();

  function render() {
    var html = "";
    KIT_ITEMS.forEach(function (item, i) {
      var checked = state[i] ? " checked" : "";
      html += '<label class="kit-item' + (state[i] ? " checked" : "") + '">';
      html += '<input type="checkbox" data-index="' + i + '"' + checked + '>';
      html += '<span class="kit-label">' + item + "</span></label>";
    });
    listEl.innerHTML = html;
    updateProgress();

    listEl.querySelectorAll("input").forEach(function (box) {
      box.addEventListener("change", function () {
        var i = box.getAttribute("data-index");
        state[i] = box.checked;
        saveKitState(state);
        box.closest(".kit-item").classList.toggle("checked", box.checked);
        updateProgress();
      });
    });
  }

  function updateProgress() {
    var total = KIT_ITEMS.length;
    var done = Object.keys(state).filter(function (k) { return state[k]; }).length;
    var bar = document.getElementById("kit-progress-bar");
    var text = document.getElementById("kit-progress-text");
    var pct = total ? Math.round((done / total) * 100) : 0;
    if (bar) bar.style.width = pct + "%";
    if (text) text.textContent = done + " من " + total + " (" + pct + "%)";
  }

  var resetBtn = document.getElementById("kit-reset");
  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      state = {};
      saveKitState(state);
      render();
    });
  }

  render();
}

/* ---------- تشغيل ---------- */

document.addEventListener("DOMContentLoaded", function () {
  initAssessment();
  initKit();
});
