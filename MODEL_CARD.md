# Educational bleeding-scenario classifier, v1

## Purpose
A student demonstration of real supervised learning and local inference.
Not a diagnostic, triage or treatment model. Do not use to decide medical care.

## Data
12 synthetic rows: Cartesian product of amount (mild/nose/severe), embedded object
(no/yes) and limb (no/yes). The training script fits labels stored in the included CSV.
Labels were assigned by the existing questionnaire rules. Some fields are irrelevant
for some rows; these rows are illustrative combinations, not plausible patient records.
No patient records, scraped clinical data or third-party dataset was used.
No clinician annotation or approval is claimed.

## Model and reproducibility
Multinomial logistic regression: 7 one-hot features, 5 classes, 35 learned weights
and 5 learned biases. Deterministic zero initialization, full-batch gradient descent,
4000 epochs, learning rate 0.3, cross-entropy loss, no regularization.
Feature order and class order are exported with the weights.
No/nil for unasked object/limb answers is encoded as no, matching the UI's branches.
Run `python train_model.py` with standard-library Python, then `node test-model.js`.
Model files are local JavaScript, no network inference or API credentials.

## Evaluation
Regression checks cover all 12 enumerated input combinations, all 6 reachable
questionnaire paths, emergency overrides with an intentionally wrong model, and
missing/malformed weights. This is software behaviour testing on a tiny known table,
NOT a held-out medical evaluation. No accuracy metric is presented as medical evidence.
There is no external validation, patient cohort, sensitivity/specificity measurement,
calibration analysis or demographic fairness evaluation.

## Deployment guard
Rules alone select the instructional result. ML classification is separately labelled
educational. Severe answers always get urgent instructions; missing/corrupt model
weights do not remove the rules. This cannot detect danger the questionnaire never
asks about, nor correct inaccurate answers. Seek emergency help for severe bleeding.

## Future work
A clinically supervised project would need consented, appropriate data, expert review,
external validation and applicable approvals before any medical deployment.
