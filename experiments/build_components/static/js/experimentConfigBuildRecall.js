expConfig = {
    "experimentName": "block_construction_build_components",
    "dbname": "block_construction",
    "colname": "build_components",
    "stimColName": "build_components_6_towers", // these are the old stims, now with colors added below
    "iterationName": "build_components_build_recall_6_towers_3_rep_color_sona_pilot_1_datatest",
    "completionCode": "CWRO95FQ",
    "devMode": false,
    "experimentParameters": { // parameters for the experiment.
      "learningITI": 1000,
      "nLearningReps": 3,
      // "towerColors": [[100, 200, 0, 255],
      //                 [0, 100, 200, 255],
      //                 [200, 0, 100, 255],
      //                 [200, 100, 0, 255],
      //                 [0, 200, 100, 255],
      //                 [100, 0, 200, 255]]
      "towerColors": [[214, 19, 87, 255],
                      [85, 111, 243, 255],
                      [145, 220, 39, 255],
                      [150, 243, 227, 255],
                      [214, 186, 241, 255],
                      [101, 101, 101, 255]]
    },
    "prolificCompInfo":"<p>Thank you for participating in our experiment. It will take around <strong>15 minutes</strong> total to complete, including the time it takes to read these instructions. You will be paid $3.88 (around $15.50 per hour). You can only perform this experiment one time.</p><p>Note: We recommend maximizing your browser window to ensure everything is displayed correctly. Please do not refresh the page or press the back button.</p>",
    // "compensationInfo":"<p>Thank you for participating in our experiment. It should take a total of <strong>25 minutes</strong>, including the time it takes to read these instructions. You will receive $6.00 for completing this study (approx. $15/hr).</p><p>When you are finished, the study will be automatically submitted to be reviewed for approval. You can only perform this study one time. We take your compensation and time seriously! Please message us if you run into any problems while completing this study, or if it takes much more time than expected.</p></br><p>Note: we recommend using Chrome, and putting your browser in full screen. This study has not been tested in other browsers.</p>",
    "mainInstructions":['<p>In this experiment you will be presented with a series of <i>block towers</i> that look like this: </p><img src="../img/instruction_images/tower_example.png" style="max-width: 150px"><p>Later in the experiment, we\'re going to ask you to remember what these towers looked like.</p> '],
    "learnPhaseInstructions":['<p>To help you remember the towers, you will be asked to perform one of two <i>study tasks</i> for each tower: "<strong>LOOK</strong>" or "<strong>BUILD</strong>".</p>',
    '<p>In the "<strong>LOOK</strong>" task, you should <i>study the shape of the tower by looking at it carefully</i>.</p><p>Please focus on the tower for the entire time it is on screen (around 15 seconds). You will automatically move on to the next tower.</p></br><img src="../img/instruction_images/look_demo.png" style="max-width: 300px">',
    '<p>In the "<strong>BUILD</strong>" task, you should <i>study the shape of the tower by building it out of blocks</i>. You should try to copy the tower as accurately as possible in the window on the right.</p><p>Click on blocks in the menu to pick them up, and click again to place them. Blocks can be placed on on the ground or on top of other blocks. Blocks will stick to wherever you place them; they will not fall and you will not be able to move them. However you can undo/redo blocks with the undo/redo buttons or press "Reset" to start building again from scratch. You will move on once you have perfectly copied the tower anywhere in the building window.</p></br><img src="../img/instruction_images/tower_build_demo_undo.gif" style="max-width: 600px">',
    '<p>You may see the same tower more than once. Remember to pay close attention to all of the towers, as you will be asked to remember them later!</em></p><p>That\'s all you need to know for now. Press Next to start.</p>'],
    "decodePhaseInstructions":['<p>Great job! Now we want to see how well you remember the towers you have just seen and built.</p><p>On the next screen you\'ll be shown a building window. Your task is to build as many towers as you can remember from the previous part of the experiment.</p>',
    '<p>You saw 6 unique towers. Each tower can be made from 8 blocks of a different color. Select a color, place 8 blocks, then press "Submit" to save your tower and start a new one. You may only submit one tower of each color. If you only half-remember a tower, please try your best to submit a tower that is as close as possible to the one remember. Press Next to begin.</p>'],
    "taskParameters": { // parameter for indivudal trial types. Majority of task parameters are set in metadata.
      "build" : {
        afterBuildPauseDuration : 3000,
        prompt : "BUILD",
        },
      "view" : {
        towerDuration : 15000, // 15s to match Wammes 2019
        prompt : "LOOK",
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
  