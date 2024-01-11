# Method

## Stimuli

Both experiments use the same stimuli.

Towers constructed from 8 dominoes (i.e. 1x2 square blocks).
Towers are always a combination of 4 horizontal (i.e. 2x1) and 4 vertical blocks (i.e. 1x2), and designed to fit into a 4*6 grid.
We allow only towers that would be stable in a simplified simulated gridworld physical environment where blocks stick together when placed (i.e. blocks must be supported from below by at least one square, but will not fall if only 50% supported).

6 target tower stimuli.
For each target tower, we construct a set of 5 distractors by performing the following transformations:
horizontally flipped
vertically flipped
rotated 180 degrees
lower half swapped with upper half
left half swapped with right half

As towers are fairly homogeneous i.e. are comprised of similar blocks and subparts, we ensure that no distractors overlap with target towers.

Each target tower and its distractors are assigned one of six colors, which are kept consistent throughout the experiment. 

## Experiment 1 Task: Exposure

In experiment 1, the 3 of the target towers were assigned to a View condition, and the other 3 to Build condition. Participants then saw all 6 towers in a pseudo-randomized order (ensuring no runs of 2 or more consecutive conditions) and were asked to perform the respective View or Build task.

### Encoding
View task: target tower is presented to participant for 15000ms. Participants are instructed to “study the shape of the tower” for the entire time it is on screen.

Build task: Participants are instructed to “study the shape of the tower by building it”. The target tower was displayed on the left side of the screen, and participants are presented with an interface on the right side in which they can reconstruct the tower. Participants use the mouse to select from displayed domino blocks (vertical 2x1 and horizontal 1x2) by clicking. After selecting a block participants can move the mouse to select a position to place the block, indicated by a slightly transparent block in the indicated position. After clicking again to place the block, participants cannot undo a block placement. Blocks are the same color as the target tower. Participants can reset the building environment at any time. When they have perfectly reconstructed the target tower, they will automatically proceed to the next trial. 

### Decoding (shared between experiments)
Old-new
Participants are presented with either a tower they saw during the encoding phase or a randomly sampled distractor. They were instructed to indicate whether they had studied the presented tower before by clicking one of two buttons: “old” or “new.” Participants responded accordingly to 12 towers in total.


Build recall
Participants were presented with a building environment, almost identical to the one available to them in the Build encoding task, but without a target tower. Participants were asked to reconstruct as many towers as they could remember from the previous part of the study (not including distractors). They could select any of the 6 block colors from a color swatch and construct a tower of that color. Once they had placed 8 blocks, they could “submit” their tower, after which it disappeared, and the color became unavailable to select.


## Experiment 2 Task: Working Memory

In Experiment 2, both tasks will start with an identical stimulus presentation. Towers will be presented on screen for 8000ms, after which they will see a blank screen (for XXXXms). During presentation participants will not know which of two tasks they would have to perform.

### Encoding
Match-to-sample:
Participants will see a fixation cross, then a circular array of 5 towers: 4 distractor towers plus the target tower.
The 4 distractors will be randomly sampled from the 5 generated for the respective target tower. They will be placed in a random order, circling the fixation cross.
Participants will be instructed to select the tower they had just viewed by clicking on it.


Building WM encoding:
As in experiment 1 Build task, participants were presented with an empty building environment in which they were instructed to construct the target tower. However, in this working memory version of the task, the target tower will not be present on screen during construction. Instead, participants must reconstruct the tower they have just seen from memory. After they place 8 blocks (the total number in each tower) and submitted their tower, they will receive feedback (correct or incorrect) and the target tower will be revealed next to the building window.

### Decoding
The decoding, or ‘test phase’ of the Working Memory Experiment will be identical to that in the the Visual Exposure Experiment.

## Analysis plan

### Exclusion Criteria
We will exclude participants who meet any one of the following criteria:
- did not complete all trials
- indicated that they did not understand the task in the exit survey
- were in the recall condition and did not submit any tower reconstructions
- were in the old new condition and responded to > 90% of trials with the same button
- spent longer than 10 minutes between finishing the final encoding trial and starting the first decoding phase


### Measuring memory strength

Both studies involve two possible test phases: a visual recognition test and a visual recall test, both of which are designed to assess whether building or viewing correspond with greater memory strength.
Measuring visual recognition

To evaluate the participants' ability to recognize towers from the encoding phase of our experiment, we will implement an old-new judgment task. This task is pivotal in determining how well the participants can differentiate between previously seen ('old') and new towers.

Our primary measure of interest will be the d-prime statistic, calculated for each participant under each condition. The d-prime score is a widely recognized measure in signal detection theory, providing a quantifiable measure of an individual's ability to discern signals from noise. It essentially reflects the participant's sensitivity to distinguishing old items from new ones.

The formula for calculating d-prime is d-prime = z(H) - z(F), where:
H (hit rate) is the proportion of 'old' trials correctly identified, calculated as the number of hits divided by the total number of old trials.
F (false alarm rate) is the proportion of 'new' trials incorrectly identified as old, calculated as the number of false alarms divided by the total number of new trials.

It's important to note that the false alarm rate (F) will be constant across different conditions, making the number of hits for each condition the critical variable. However, using d-prime allows us to adjust for any bias a participant might have towards responding 'old' or 'new.'

Estimates of d’ are likely to be noisy given the small number of trials for each condition. We therefore also plan to create a mixed effects logistic regressions predicting participants response (old or new). Stimuli in the old-new task may foils or targets, where targets can be split into condition (build and view, or build WM and match-to-sample). As our main question is whether condition has an effect on response, we intend to run one model in which we subset our data to only include target stimuli:

response ~ condition + (1 | towerID) + (1 | participantID). 

However, as it is also important for us to establish that participants respond differently to target stimuli than to foils, we will also define a model that distinguishes foils and both kinds of targets in a single variable:

response ~ stimulus_type + (1 | towerID) + (1 | participantID),

where stimulus_type can be {foil, build, view} (or foil plus the other encoding conditions).

In cases where this model fails to converge, our approach will be to simplify the model iteratively. We will begin by dropping the random intercepts, followed by the interaction term, and finally, the trialNumber variable if necessary. To select the most appropriate model, we will compute the Akaike Information Criterion (AIC) for each version. Our selection criterion will be based on identifying the most complex model that leads to a substantial decrease in AIC compared to the next simpler model.

### Measuring visual recall
To assess participants' ability to recall towers from the encoding phase of our experiment, we will employ a visual recall task. In this task, participants will reconstruct each target tower out of blocks. This free-response test is structured so that participants can only construct one tower of each color, providing a clear mechanism for matching reconstructions with their corresponding target towers.

#### Reconstruction accuracy
We will evaluate reconstruction accuracy using the F1 Score, a widely used metric in machine learning for spatial reconstruction accuracy, applied to bitmaps of the target tower and reconstruction. We will allow for horizontal translation of the reconstruction, selecting the highest possible F1 Score. We treat towers for which participants did not submit a tower as F1=0.

To understand the impact of condition on reconstruction accuracy, we will run a linear mixed effects model,
F1Score ~ condition + (1 | gameID) + (1 | tower_id).

For participants who submitted towers from both conditions we will also ask whether F1 scores were on average higher for one of the conditions, by running a paired t-test between the mean F1 score for each condition.


#### Successful recall analysis
As well as a continuous measure of accuracy, we intend to ask, more discretely, whether towers from either condition were or were not remembered. We will fit a mixed effects logistic regression model with the following structure:

recalled ~ condition + (1 | gameID) + (1 | tower_id)

In this model, 'recalled' indicates whether a participant constructed a tower of the target color. Recognizing that not all reconstructions are equally accurate, we will refine this analysis by considering only reconstructions that meet certain accuracy thresholds. We will test various thresholds: F1 = 1 (perfect reconstructions), and decreasingly lower thresholds (F1 > 0.95, F1 > 0.9, F1 > 0.8, F1 > 0.7). This approach allows us to balance the need for stringent accuracy criteria against the risk of missing smaller but significant effects. Consistent results across these thresholds will reinforce the validity of any observed effects.


### Secondary Analyses

Number of towers recalled
Finally, we will compare the number of towers recalled by each participant for each condition. We'll calculate a distribution of differences between condition counts at various accuracy thresholds. A t-test will be conducted to determine if this distribution significantly differs from zero. Additionally, we will calculate Cohen’s d to measure the effect size.

Accounting for encoding task performance
Decoding performance (i.e. memory for the tower) may be contingent on performance in the various encoding tasks. We will include additional predictors (and interactions) in additional models, to assess the impact of these tasks. 

build: number of resets, time to complete structure
view: none to measure
build from working memory: number of resets, time to complete structure, F1 score, perfect-reconstruction
match-to-sample: correct-response, distractor-type-selected,

Recency bias
Pilot experiments suggested a recency bias, whereby participants are more likely to recall towers they have recently seen. To account for recency bias, we will run the above models with an additional predictors measuring how long ago:
negative_trial_index: index of final encoding trial counting backwards from last trial
trial_gap: number of trials between final encoding trial and recalled tower (counting each recalled tower as a single tower).
time_between_trials: time (in ms between last encoding trial and recall trial)

# Settings for experiments

# Participants
We aim to collect data from 50 participants for each of the following 4 experiments, after accounting for participants excluded according to the following criteria.

- did not complete all encode trials
- indicated that they did not understand the task in the exit survey
- were in the recall condition and 
  - did not submit any tower reconstructions
- were in the old new condition and
  - responded to > 90% of trials with the same button
  - spent longer than 10 minutes between finishing the final encoding trial and starting the first decoding phase

We will additionally flag participants who meet the following criteria
- were in the working memory version and failed to correctly match any towers
- were in the working memory version and failed to rebuild any tower on the first attempt


## build_components_cogsci_ve_old_new_dev
- 6 target stimuli
- encode phase:
  - 2 reps
  - BUILD COPY or VIEW
- decode phase:
  - OLD/NEW (with random distractor)

## build_components_cogsci_ve_recall_dev
- 6 target stimuli
- encode phase:
  - 2 reps
  - BUILD COPY or VIEW
- decode phase:
  - BUILD RECALL

## build_components_cogsci_wm_old_new_dev
- 6 target stimuli
- encode phase:
  - 2 reps
  - STUDY followed by either BUILD or MATCH (with 4 of 5 generated distractors)
- decode phase:
  - OLD/NEW (with held-out 5th distractor)

## build_components_cogsci_wm_recall_dev
- 6 target stimuli
- encode phase:
  - 2 reps
  - STUDY followed by either BUILD or MATCH (with 4 of 5 generated distractors)
- decode phase:
  - BUILD RECALL