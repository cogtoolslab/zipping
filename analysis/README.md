# original content
This directory contains analysis scripts, organized by venue.

It also contains a /results/ directory with preprocessed CSVs of behavioural data, suffixed with the name of each experiment. Data for CogSci 2020 contains string 'Exp2Pilot3_all'

# reproducibility check (May, 2026)
A (computational) reproducibility check:
data -> analyses -> stats and plots in manuscript

manuscript layout is 4 experiments, some likely run in 2023 or 2024, others run before then.

guessed mapping between manuscript experiments and terms in this repo:
| manuscript exp name              | cogsci24 num recruited | cogsci24 N after exclusions | repo exp name |
|----------------------------------|----------------------|---------------|-----------------|
| Exp 1 (copy/view -> recog)       |  58?                 |  50?          |                 |
| Exp 2 (copy/view -> recall)      |  61?                 | 50?           |                 |
| Exp 3 (wm build/match -> recog)  |  61                  | 50            |                 |
| Exp 4 (wm build/match -> recall) | 57                   |  50           |                 |

## fetch data
Let's try `analysis/build_components/build_components_cogsci_data_generator.ipynb`.
Says it was last edited 2/5/24.
trying with basic conda environment (python 3.10)

1. fetch submodules (see root README)
2. running notebook
    * no module 'skimage'
3. make new python environment
    * stored as `reproduction_env.yaml`, python 3.14, scikit-learn, scikit-image, jupyter, etc.
4. try running again
    * update config (mongo login info) path
