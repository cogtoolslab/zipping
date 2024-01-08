# build_components

This experiment explores the components of building activity that affect memory.

## Decisions
- Trial randomization
  - Done in js
  - Learning phase
    - Random shuffle, rejecting sequences with >3 of same condition in a row
  - Recall phase
    - Random shuffle, rejecting sequences with >3 of same condition in a row
- 



# Recognition (Old-New task)

Plugins:
- `block-tower-build`
- `block-tower-viewing`
- `block-tower-old-new`

## pilot
- initially tried psuedorandom assignments to conditions (8 build, 8 view, 8 foil)

## pilot_2
- true random assignment to conditions (6 build, 6 view, 12 foil)
  - assigned in: building_components_build_recall_stimuli_backup.ipynb
  - stimuli in: `build_components_pilot` collection
  - assignments stored in: `df_build_components_pilot_2_assignments.csv`
- Ran 50 ppts
- Presented at VSS 2023


# Recall (rebuild task)

- New config: experimentConfigBuildRetrieval
- New iteration names: building_components_build_recall_*
- New plugin for free recall building (allows undo): `block-tower-build-recall`
- New plugin for build encoding (adding in undo): `block-tower-building-undo`

## build_components_build_recall_prolific_pilot_12_towers
- n=10
- Started using exact same stimuli (and metadata) as oldnew version
  - 12 stimuli (6 build, 6 view) taken using same assignments as pilot_2 above.
  - Selected with: building_components_build_recall_stimuli_backup.ipynb
- Participants can submit up to 14 towers (number of target towers +2)


## build_components_build_recall_prolific_pilot_6_towers
- Smaller stimulus set
  - Take first half of set of towers
  - Regenerate assignments: 3 build, 3 view, 6 foil (foils not used in recall experiment, but are generated for future use in old-new version)
  - stimuli in: `build_components_6_towers` collection
  - assignments stored in: `df_build_components_6_tower_assignments.csv`
  - participants can submit up to 6 towers (number of target towers)


## build_components_build_recall_prolific_pilot_6_towers_2_rep
- config: experimentConfigBuildRetrieval.js
- Same as above but 2 repetitions of each encoding trial
  - Added in rep functionality to experimentSetup
- N=50 (i.e. 50 completed) on Prolific
- Presented at VSS 2023


## build_components_build_recall_6_towers_3_rep_color_pilot_0
- config: experimentConfigBuildRecallOld.js
- Intended as replication of prior recall results but with stronger memories i.e. by assigning each stimulus a unique color and using 3 repetitions of each stimulus.
- 3 reps
- Each stimulus is assigned a unique color
- n = 30 (25 completed) on SONA
- BUG: Wasn't saving colors in learn trials so no way to match (could run the analysis from prev study but not the point)
- FEEDBACK: A couple of participants explicitly said that they thought they only had to remmeber the LOOK towers >> Edit instructions for next version



## build_components_build_recall_6_towers_3_rep_color_pilot_1
- config: experimentConfigBuildRecall.js


Issue with iteration names here- see below
## build_components_build_recall_6_towers_3_rep_color_sona_pilot_1_datatest (aka build_components_build_recall_6_towers_3_rep_color_sona_2)
- config: experimentConfigBuildRecall.js
- changed instructions to push people away from thinking that they were only meant to 'study' in the view task 
- ran on SONA (unfortunately forgot to change this iterationName before making a new version of the experiment, so it will take some cleaning up front. Start by finding the ones with workerID, which should be short because they're from SONA. I also think studyLocation is being saved which will help).
