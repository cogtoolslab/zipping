# Computational reproducibility check

**Paper:** McCarthy, W., Anderson, S. P., & Fan, J. (2024). *How does assembling an object
affect memory for it?* Proceedings of the 46th Annual Conference of the Cognitive Science
Society. [PDF](https://cogtoolslab.github.io/pdf/mccarthy_cogsci_2024.pdf)

**Goal:** for each of the 4 manuscript experiments, trace **data → preprocessing/exclusions →
analysis → reported statistic**, re-run on the same data, and confirm the reproduced numbers
(especially significance thresholds) match what was reported.

**Status legend:** `[ ]` not yet run · `[~]` run, mismatch · `[x]` run, matches.
For each statistic, paste the reproduced value after `→` and mark the box.

---

## Experiment overview

| Exp | Encoding contrast | Decoding (measure) | Groups | Reported exclusions | Reported final N |
|-----|-------------------|--------------------|--------|---------------------|------------------|
| 1 | Build (copy) vs View | Recognition (old/new) | 1 | 8 (incomplete data) | 50 |
| 2 | Build (copy) vs View | Recall (rebuild towers, IoU) | 1 | 11 (incomplete data) | 50 |
| 3 | Build vs View, ×(Visual-Exposure vs Working-Memory) | Recognition (old/new) | 2 | 11 | 50 / group |
| 4 | Build vs View, ×(Visual-Exposure vs Working-Memory) | Recall (rebuild, IoU) | 2 | 6 + 1 | 50 / group |

Recruitment: E1/E2 recruited until 50 completed without meeting exclusion criteria; E3/E4
until 50 per group completed.

---

## Environment setup

- **Python:** conda env `zipping_repr` (`reproduction_env.yaml`): pymongo, pandas, numpy,
  scipy, scikit-image, scikit-learn, seaborn, matplotlib, jupyter. Used by the
  `*_data_generator.ipynb` and `*_analyses.ipynb` notebooks.
- **R (needed, not in the conda env):** Experiment 2's paired t-test + Cohen's d and all of
  Experiment 4's mixed-effects models live in `build_components_cogsci.Rmd`. Need R with
  `lme4`, `lmerTest`, `tidyverse`, `effsize` (`cohen.d`).
- **MongoDB:** data is fetched from `mongodb://<user>:<pw>@127.0.0.1`, DB `block_construction`,
  collection `build_components`. Credentials live in a gitignored config file
  (`analysis/defaults.conf` or `auth.txt`) the generator notebook reads — create it before
  fetching.
- **Submodules:** `git submodule update --init` (the build-from-memory scoring imports
  `utils.worldify` from `stimuli/block_utils`).

---

## Shared analysis helpers
`analysis/build_components/build_components_cogsci_analyses.ipynb` (top cell, ~cell 4):
- `parallel_bootstrap(df, bootstrap_column='gameID', condition_column=..., value_columns=...,
  n_iter=1000, stat=np.mean)` — resamples participants with replacement (1000 iters).
- `bootstrapped_ci(data, conf_level=0.95)` — 2.5th / 97.5th percentiles.
- `p_val(d1, d2)` — proportion of bootstrap iterations where `d1 < d2`; a reported `p = 0`
  means 0 of 1000 (report as `p < 0.001`).
- `iou(a, b)` via `sklearn.metrics.jaccard_score`; best-match IoU allows horizontal
  translation and uses a maximal target↔reconstruction mapping.

---

## Experiment 1 — Build vs View → recognition

**Data fetch:** `build_components_cogsci_data_generator.ipynb` — set `iteration_name` to the
`build_components_cogsci_ve_old_new_*` iteration (e.g. `..._prolific_pilot_0` or
`..._data_run_through_2`); writes `results/build_components/cogsci24/df_{encode,decode,...}_<iter>.csv`.
⚠️ See **Open questions** — confirm which iteration is the manuscript E1 dataset.

**Preprocessing / exclusions:** `build_components_cogsci_analyses.ipynb`, `exclude_ppts()`.
Criteria: incomplete encode (`<12` trials), incomplete decode (`<12`), key-mashing
(`>90%`/`<10%` same response), `>10 min` between encode and decode.

| Step | Reported | Reproduced |
|------|----------|------------|
| Participants excluded | 8 (incomplete data) | `[ ]` → |
| Final N | 50 | `[ ]` → |

**Analysis** (`cogsci_analyses.ipynb`, bootstrap cells):

| Statement | Statistic | Reported | Reproduced |
|-----------|-----------|----------|------------|
| Participants responded "old" more often to target towers than to foils. | responded "old" → targets vs foils | targets 0.667 [0.62, 0.708] vs foils 0.33 [0.283, 0.377], p=0 | `[ ]` → |
| Participants were more likely to respond "old" to View towers than to Build towers. | "old" → View vs Build | View 0.743 [0.683, 0.793] vs Build 0.59 [0.527, 0.653], p=0 | `[ ]` → |
| Participants took on average 61.1s to complete each Build trial, far longer than the 15s View exposure. | mean Build trial time | 61.1 s [60.8, 61.3] | `[ ]` → |

---

## Experiment 2 — Build vs View → recall

**Data fetch:** `build_components_cogsci_data_generator.ipynb`, `build_components_cogsci_ve_recall_*`
iteration. ⚠️ The R analysis reads `results/recall/csv/df_best_match_recalls_vss.csv` — confirm
whether manuscript E2 uses the cogsci `ve_recall` iteration or the earlier "vss"/pilot recall
data (see **Open questions**).

**Preprocessing / exclusions:** `cogsci_analyses.ipynb` (`exclude_ppts()`, decode threshold
`<1`); recall scoring via `iou()` + best-match mapping; `built_both` filter (participant
recalled ≥1 tower in each condition) applied for the paired t-test.

| Step | Reported | Reproduced |
|------|----------|------------|
| Participants excluded | 11 (incomplete data) | `[ ]` → |
| Final N | 50 | `[ ]` → |

**Analysis** (`cogsci_analyses.ipynb` bootstraps + `build_components_cogsci.Rmd` ~L151–187 for t-test/d):

| Statement | Statistic | Reported | Reproduced |
|-----------|-----------|----------|------------|
| After removing duplicate submissions, participants submitted an average of 4.2 towers. | avg towers submitted | 4.2 [3.7, 4.64] | `[ ]` → |
| On average, 1.46 of these towers were perfect reconstructions of a target tower. | avg perfect reconstructions | 1.46 [1.06, 1.84] | `[ ]` → |
| Fewer Build towers were perfectly recalled than View towers. | perfectly recalled: Build vs View | Build 0.56 [0.34, 0.78] vs View 0.9 [0.62, 1.22], p=0.020 | `[ ]` → |
| No reliable difference was found between the number of towers paired to targets from the Build and View conditions. | towers paired to targets: Build vs View | Build 2.1 [1.82, 2.34] vs View 2.1 [1.8, 2.38], p=0.440 | `[ ]` → |
| Participants who recalled towers from both conditions built more accurate reconstructions of View condition towers. | paired t-test recon IoU (View>Build) | p=0.0208, Cohen's d=0.433 | `[ ]` → |

---

## Experiment 3 — (VE vs WM) × (Build vs View) → recognition

**Data fetch:** `build_components_cogsci_data_generator.ipynb`, `build_components_cogsci_wm_old_new_*`
(Working-Memory group) plus the `ve_old_new` iteration (Visual-Exposure group).

**Preprocessing / exclusions:** `cogsci_analyses.ipynb`, `exclude_ppts()` on both groups
(incomplete encode `<24` for WM, decode `<12`, key-mashing, between-phase time).

| Step | Reported | Reproduced |
|------|----------|------------|
| Participants excluded | 11 | `[ ]` → |
| Final N | 50 / group | `[ ]` → |

**Analysis** (`cogsci_analyses.ipynb`):

| Statement | Statistic | Reported | Reproduced |
|-----------|-----------|----------|------------|
| Participants correctly selected the target tower from 5 distractors on 91.5% of match-to-sample trials. | match-to-sample correct | 91.5% [86.3, 95.8] | `[ ]` → |
| In the build-from-memory task, participants perfectly reconstructed the target tower on 73.3% of trials. | build-from-memory perfect | 73.3% [0.688, 0.774] | `[ ]` → |
| The Visual Exposure group responded "old" to target towers more often than to foils. | VE: targets vs foils | 0.807 [0.76, 0.853] vs 0.29 [0.243, 0.34], p=0 | `[ ]` → |
| (not significant) View towers were remembered marginally more often than Build towers in the Visual Exposure group. | VE: View vs Build | 0.833 [0.753, 0.9] vs 0.78 [0.713, 0.847], p=0.173 | `[ ]` → |
| Recognition performance was stronger overall in the Visual Exposure group relative to Experiment 1. | VE overall correct | 75.8% [71.8, 79.7] | `[ ]` → |
| Recognition performance was marginally more accurate overall in the Working Memory group. | WM overall correct | 80.1% [76.3, 83.8] | `[ ]` → |
| The difference in responses between Build and View was even less distinct in the Working Memory group. | WM: Build vs View | 0.88 [0.827, 0.927] vs 0.873 [0.827, 0.92], p=0.565 | `[ ]` → |

---

## Experiment 4 — (VE vs WM) × (Build vs View) → recall

**Data fetch:** `build_components_cogsci_data_generator.ipynb`, `build_components_cogsci_wm_recall_*`
plus `ve_recall`. Recall scoring in `cogsci_analyses.ipynb` writes
`results/build_components/cogsci24/df_encode_with_recalls_both.csv` (input to the R models).

**Preprocessing / exclusions:** `cogsci_analyses.ipynb` `exclude_ppts()` per group.

| Step | Reported | Reproduced |
|------|----------|------------|
| Participants excluded | 6 + 1 | `[ ]` → |
| Final N | 50 / group | `[ ]` → |

**Analysis** (`build_components_cogsci.Rmd` ~L229–276): relevels `encode_type` ref=`ve`,
`condition` ref=`view`. Model 1: `glmer(perfectly_recalled ~ encode_type*condition +
(1|gameID) + (1|tower_id), family=binomial)`. Model 2: `lmer(score ~ encode_type*condition +
(1|gameID) + (1|tower_id))` (non-reconstructed towers → IoU=0).

| Statement | Statistic | Reported | Reproduced |
|-----------|-----------|----------|------------|
| The Working Memory group correctly selected the target tower on 86.7% of match-to-sample trials. | match-to-sample correct | 86.7% [81.3, 91.7] | `[ ]` → |
| The Working Memory group perfectly reconstructed the target tower on 73.9% of build-from-memory trials. | build-from-memory perfect | 73.9% [0.7, 0.778] | `[ ]` → |
| Participants submitted towers on 3.78 towers on average. | avg towers submitted | 3.78 [3.44, 4.11] | `[ ]` → |
| No evidence that the Working Memory tasks reliably led to a better or worse ability to perfectly recall towers. | glmer perfectly_recalled — WM (encode_type) | b=-0.595, z=-1.35, p=0.177 | `[ ]` → |
| Build towers were recalled less frequently than View towers. | glmer perfectly_recalled — Build (condition) | b=-0.879, z=-2.52, p=0.0117 | `[ ]` → |
| Build towers were recalled more often than View towers when encoded in the Working Memory tasks. | glmer perfectly_recalled — interaction | b=1.62, z=3.33, p<0.001 | `[ ]` → |
| No reliable effect of encoding group (Visual Exposure vs Working Memory) on reconstruction accuracy. | lmer score (IoU) — encode_type | b=-0.09261, t=-1.58, p=0.116 | `[ ]` → |
| A small negative main effect of the Build condition on reconstruction accuracy. | lmer score (IoU) — Build (condition) | b=-0.143, t=-3.00, p=0.00346 | `[ ]` → |
| Build towers were recalled more accurately than View towers in the Working Memory condition. | lmer score (IoU) — interaction | b=0.247, t=3.67, p<0.001 | `[ ]` → |

---

## Open questions / risks to resolve while running

1. **Which MongoDB iteration is manuscript E1 / E2?** The `..._prolific_pilot_0` cogsci
   iterations produced exclusion counts of ~6 (E1) and ~6 (E2), not the reported 8 and 11.
   The Python notebook also reads E1/E2 from older `results/recognition/csv/...` and
   `results/recall/csv/..._vss.csv` files, while E3/E4 read from `cogsci24/`. Use the
   **exclusion counts (8, 11)** as the discriminating signal to confirm the correct dataset
   (candidates include the `..._data_run_through*` iterations and the pre-cogsci recall pilot
   `build_components_build_recall_prolific_pilot_6_towers_2_rep`).
2. **Exclusion-count match.** Confirm reproduced exclusions match 8 / 11 / 11 / (6+1). A
   mismatch most likely points to the wrong iteration above rather than wrong criteria.
3. **`p = 0` reporting.** Bootstrap p-values of 0 mean "0 of 1000 iterations" — report as
   `p < 0.001`.
4. **Notebook versions.** `recognition_vss/` and `recall_vss/` are older analyses; the
   manuscript numbers come from `build_components_cogsci_analyses.ipynb` and
   `build_components_cogsci.Rmd` (dated 2024-01-10). Avoid the VSS copies except to resolve
   question 1.
