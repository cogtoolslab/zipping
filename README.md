# How does building an object affect memory for it?

## Paper
Find our paper from the Cognitive Science conference 2024 here:
https://cogtoolslab.github.io/pdf/mccarthy_cogsci_2024.pdf













# Setup
- pull submodules:
  - `git submodule update --init`
- download node requirements:
  - `cd experiments/`
  - `npm install`


# Running experiments
A full breakdown of the experiment versions can be found in the README in the `experiments` folder.

- `cd experiments/`
- In two tmux panes run `node app.js` and `node store.js`.
- http://localhost:PORTNUM/ will then serve your experiment files.
  - e.g. http://localhost:PORTNUM/index.html should reach the experiment. Or you can direct to a specific page e.g. http://localhost:PORTNUM/static/html/consent.html
- When pointing to an experiment from e.g. Prolific, MTURK, specify urlParams with http://localhost:PORTNUM/static/html/consent.html?WorkerId=test&... etc.
  - These need to be forwarded manually across webpages. 



# Navigating the repo
- `experiments/` contains the code for behavioral experiments.
  - as the block building interface is used in multiple projects, we keep it in a submodule repo `building_widget`.
- `stimuli/` contains the code for generating stimuli. Similar stimuli are used in different experiments, so we keep them in the submodule repo `block_utils`.
- `analysis/` contains the analysis code, organized by project.
  - Typically we break down the task of generating dataframes `*_dataframe_generator.ipynb` and running analyses `*_analysis.ipynb`.
- `results/` contains the results of the analysis, organized by project. 
  - `csv/` contains dataframes outputted by dataframe generators
