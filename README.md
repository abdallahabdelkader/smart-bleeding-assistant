# Smart Bleeding & Wound Management Assistant

مساعد ذكي للنزيف والجروح — an interactive Arabic web app that helps people give the right
first aid for bleeding and wounds, fast.

**Project 05 — First Aid Skills Course, Faculty of Computers, Information and AI**

## What it does

- **Bleeding assessment (تقييم الحالة):** a short interactive questionnaire that checks how
  severe the bleeding is and gives the correct step-by-step response (direct pressure,
  tourniquet guidance, wound packing, or home care).
- **First aid guide (دليل الإسعافات):** plain-language guides for severe bleeding, minor cuts
  and scrapes, puncture wounds and embedded objects, nosebleeds, and shock — plus the common
  mistakes to avoid.
- **First aid kit checklist (شنطة الإسعاف):** an interactive checklist of what a home/car
  first aid kit should contain, saved on the device with localStorage.
- **Emergency numbers (أرقام الطوارئ):** one-tap calling for Egyptian emergency services
  (Ambulance 123, Ministry of Health 137, Police 122, Civil Defense 180) and a quick link to
  find the nearest hospital on Google Maps.

The medical content follows the 2024 American Red Cross / American Heart Association first aid
guidelines for bleeding control.

## Trained ML model (educational prototype)

The assessment now runs a **multinomial logistic regression (softmax)** model in the
browser. Its weights are genuinely fitted by gradient descent, not handwritten.
`model-weights.js` contains the fitted parameters and `ai-assessment.js` runs inference.
No API, secret, paid service, backend or patient data is used. Answers are not sent to a server.

**Data provenance and limits:** `synthetic-training.csv` contains 12 exhaustively
constructed combinations of three questionnaire features. Labels are generated from
the same existing decision rules. These are NOT patient records, expert-annotated
clinical cases, or a representative medical dataset. The model is a toy demonstration
of learning to imitate rules, not an independent clinical intelligence improvement.
There is no clinical validation, clinical accuracy claim, calibrated confidence score,
or held-out generalisation claim. A good fit to this tiny synthetic table proves
neither diagnostic accuracy nor real-world safety.

**Safety:** the original rules alone choose care instructions. Severe-bleeding answers
always receive emergency guidance independently of any ML prediction. The model's
educational label is shown separately and cannot downgrade or replace emergency
advice. Missing/corrupt model files do not stop the rule-based instructions.
Self-reported answers can miss danger: do not wait for this questionnaire in an emergency.

Reproduce training with standard-library Python: `python train_model.py`.
Run regression checks with Node.js: `node test-model.js`.
See `MODEL_CARD.md` for feature encoding, training procedure and limitations.

## Tech

Plain HTML, CSS, and JavaScript. No frameworks, no build step, no backend — open
`index.html` in a browser and it works.

```
smart-bleeding-assistant/
├── index.html        Home page
├── assessment.html   Interactive bleeding assessment
├── guide.html        First aid guides
├── kit.html          First aid kit checklist
├── css/
│   └── style.css     All styles (RTL, Arabic-first)
├── js/
│   └── app.js        Assessment logic + kit checklist
└── README.md
```

## Run it

Open `index.html` in any browser, or serve the folder:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploy on GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repo: **Settings → Pages → Source: Deploy from a branch → main → / (root) → Save**.
3. The site goes live at `https://<username>.github.io/<repo-name>/` within a minute or two.

## Team (Project 05)

| # | Name | Seat |
|---|------|------|
| 1 | أحمد خالد محمد البرماوي | 25008 |
| 2 | أحمد رضا محمد محمد بلال | 25009 |
| 3 | احمد محمد سامي محمد عبدربه | 25017 |
| 4 | احمد مصطفى يوسف راجح | 25021 |
| 5 | إمام شريف ابراهيم الشافعي | 25030 |
| 6 | روان اسامه الشطلاوي | 25057 |
| 7 | ريم ابوبكر سرور محمود | 25061 |
| 8 | زياد احمد عبد العزيز عبد الحميد (Team Leader) | 25064 |
| 9 | سيف خالد سالمان | 25076 |
| 10 | شروق إبراهيم محمد العطار | 25077 |
| 11 | شوق طه شوق عمار | 25081 |
| 12 | عبدالرحمن محمد محمد ابوتجار | 25100 |
| 13 | عبدالله عبدالمنعم إبراهيم غانم | 25107 |
| 14 | عبدالله محمد عبدالله عبدالقادر | 25110 |
| 15 | مريم رضا محمد الشنوانى | 25185 |
| 16 | مصطفى رأفت عبد العزيز محمد | 25188 |
| 17 | ندى سامي عبد البحيري | 25198 |
| 18 | هديل عماد شوق عبدالله | 25208 |
| 19 | همسه محمد علي السعيد عيد | 25209 |

## Disclaimer

This app is for education and awareness only and is not a substitute for professional medical
care. In an emergency, call an ambulance immediately (123 in Egypt).
