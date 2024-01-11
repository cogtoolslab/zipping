expConfig = {
    "experimentName": "block_construction_build_components",
    "dbname": "block_construction",
    "colname": "build_components",
    "stimColName": "build_components_6_towers_plus_distractors", // same 6 towers across experiments, plus distractors
    "iterationName": "build_components_cogsci_ve_recall_prolific_pilot_0",
    "completionCode": "C1JNYQLZ",
    "devMode": false,
    "experimentParameters": { // parameters for the experiment.
      "learningITI": 1000,
      "nLearningReps": 2,
      "towerColors": [[214, 19, 87, 255],
                      [85, 111, 243, 255],
                      [145, 220, 39, 255],
                      [150, 243, 227, 255],
                      [214, 186, 241, 255],
                      [101, 101, 101, 255]],
      "workingMemoryVersion" : false,
      "encodePreload" : true
    },
    "prolificCompInfo":"<p>Thank you for participating in our experiment. It will take around <strong>20 minutes</strong> total to complete, including the time it takes to read these instructions. You will be paid $5.34 (around $16.00 per hour). You can only perform this experiment one time.</p><p>Note: We recommend maximizing your browser window to ensure everything is displayed correctly. Please do not refresh the page or press the back button.</p>",
    // "compensationInfo":"<p>Thank you for participating in our experiment. It should take a total of <strong>25 minutes</strong>, including the time it takes to read these instructions. You will receive $6.00 for completing this study (approx. $15/hr).</p><p>When you are finished, the study will be automatically submitted to be reviewed for approval. You can only perform this study one time. We take your compensation and time seriously! Please message us if you run into any problems while completing this study, or if it takes much more time than expected.</p></br><p>Note: we recommend using Chrome, and putting your browser in full screen. This study has not been tested in other browsers.</p>",
    "mainInstructions":['<p>In this experiment you will see a series of different colored <i>block towers</i>, that each look something like this: </p><img src="../img/instruction_images/tower_example.png" style="max-width: 150px"><p>Later in the experiment, we will ask you to remember the shape of each tower you saw.</p>'],
    "learnPhaseInstructions":['<p>Your goal in the first part of the experiment is to learn what each tower looks like. To help you remember the shape of the towers, you will be asked to perform one of two <i>activities</i> that scientists believe are helpful for retaining information: "<strong>STUDY</strong>" or "<strong>COPY<y/strong>".</p>',
    '<p>In the "<strong>STUDY</strong>" activity, you should <i>study the shape of the tower</i> for the whole time it is on screen.</p><p>The tower will stay on screen for around 15 seconds, then you will automatically move on to the next one.</p></br><h2>STUDY</h2></br><img src="../img/instruction_images/look_demo_notitle.png" style="max-width: 500px">',
    '<p>In the "<strong>COPY</strong>" activity, your should <strong>perfectly reconstruct</strong> the tower by placing blocks in the window on the right.</p><p>Click to pick up blocks and click again to place them. Blocks can be placed on the ground or on top of other blocks, and will stay where they are when placed. You can undo/redo blocks with the undo/redo buttons or press "Reset" to start building again from scratch. You will move on once you have perfectly copied the tower anywhere in the window.</p></br><h2>COPY</h2><img src="../img/instruction_images/tower_build_demo_undo.gif" style="max-width: 600px">',
    '<p>After completing the first part of the experiment, you will be asked to remember the shape of the towers based on their color. This means you will need to pay attention to both the shape <i>and</i> color of each tower. You may see the same tower more than once, but it will always be the same color.</p><p>That\'s all you need to know! Press Next to start the experiment.</p></br>'],
    "decodePhaseInstructions":['<p>Great job on the first part of the experiment! You saw 6 towers in total, each of a different color. Now we want to see how well you remember these towers.</p>',
    '<p>On the next screen you\'ll be shown a building window. Your task is to build as many towers as you can remember from the previous part of the experiment. Each tower can be made from 8 blocks of a different color. Select a color, place 8 blocks, then press "Submit" to save your tower and start a new one. You may only submit one tower of each color. If you only half-remember a tower, please try your best to submit a tower that is as close as possible to the one remember. Press Next to begin.</p>'],
    "taskParameters": { // parameter for indivudal trial types. Majority of task parameters are set in metadata.
      "build" : {
        afterBuildPauseDuration : 3000,
        prompt : "COPY",
        },
      "view" : {
        towerDuration : 15000, // 15s to match Wammes 2019
        prompt : "STUDY",
        },
      "buildRecall" : {
        iti : 1000,
        prompt : "BUILD",},
    },
    "trialTypes":{
      "build": "block-tower-building-undo", 
      "view": "block-tower-viewing",
      "buildRecall": "block-tower-building-recall-choose-color",
    }
  }
  