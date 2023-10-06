# Consequences of building experience ("zipping")


# Setup
- pull submodules:
  - `git submodule update --init`
- download node requirements:
  - `cd experiments/`
  - `npm install`


# Running experiments
- `cd experiments/`
- `npm run build`
  - This compiles javascript code into a series of bundles, that are read into experiment webpages. It then runs `app.js`, which creates a server at a specified port or the default in `app.js`.
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
