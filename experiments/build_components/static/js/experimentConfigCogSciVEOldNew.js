expConfig = {
    "experimentName": "block_construction_build_components",
    "dbname": "block_construction",
    "colname": "build_components",
    "stimColName": "build_components_6_towers_plus_distractors", // same 6 towers across experiments, plus distractors
    "iterationName": "build_components_ve_old_new_cogsci_dev",
    "completionCode": "C1JNYQLZ",
    "devMode": true,
    "experimentParameters": { // parameters for the experiment.
      "learningITI": 1000,
      "nLearningReps": 2,
      "towerColors": [[214, 19, 87, 255],
                      [85, 111, 243, 255],
                      [145, 220, 39, 255],
                      [150, 243, 227, 255],
                      [214, 186, 241, 255],
                      [101, 101, 101, 255]],
      "workingMemoryVersion" : true,
      "encodePreload" : true,
      "decodePreload" : true,// might not need if encode preload works
      "foilsFromDistractors": true,
      "distractorKinds" : ['horizontal_flip', 'vertical_flip', 'both_flip', 'tall_swap', 'wide_swap'],
      "distractorPath": '../img/cogsci_towers/cogsci_towers_'
    },
    "prolificCompInfo":"<p>Thank you for participating in our experiment. It will take around <strong>20 minutes</strong> total to complete, including the time it takes to read these instructions. You will be paid $5.17 (around $15.50 per hour). You can only perform this experiment one time.</p><p>Note: We recommend maximizing your browser window to ensure everything is displayed correctly. Please do not refresh the page or press the back button.</p>",
    // "compensationInfo":"<p>Thank you for participating in our experiment. It should take a total of <strong>25 minutes</strong>, including the time it takes to read these instructions. You will receive $6.00 for completing this study (approx. $15/hr).</p><p>When you are finished, the study will be automatically submitted to be reviewed for approval. You can only perform this study one time. We take your compensation and time seriously! Please message us if you run into any problems while completing this study, or if it takes much more time than expected.</p></br><p>Note: we recommend using Chrome, and putting your browser in full screen. This study has not been tested in other browsers.</p>",
    "mainInstructions":['<p>In this experiment you will be presented with a series of <i>block towers</i> that look like this: </p><img src="../img/instruction_images/tower_example.png" style="max-width: 150px"><p>Later in the experiment, we will ask you to remember what these towers looked like.</p> '],
    "learnPhaseInstructions":['<p>For each tower you see, you will first get some time to STUDY the shape of the tower. Look at the tower and try to remember its shape.</p></br><img src="../img/instruction_images/wm_study_demo.png" style="max-width: 500px"></br><p>After looking a tower, you will be asked to perform one of two <i>activities</i> that scientists believe are helpful for retaining information: "<strong>MATCH</strong>" or "<strong>BUILD<y/strong>".</p>',
    '<p>In the "<strong>MATCH</strong>" activity, you will <i>select the tower you have just seen from a group of other, similar towers</i>.</p><p>Once you have clicked on a tower, we will tell you if you were correct and, if you were wrong, show you which tower was correct (by highlighting it in a green box).</p></br><img src="../img/instruction_images/wm_match_demo.png" style="max-width: 500px">',
    '<p>In the "<strong>BUILD</strong>" activity, you will <i>build the tower you have just seen out of blocks</i>. You should try to copy the tower from memory as accurately as you can.</p></br><img src="../img/instruction_images/wm_build_demo.gif" style="max-width: 600px"></br><p>Click on blocks in the menu to pick them up, and click again to place them. Blocks can be placed on on the ground or on top of other blocks. Blocks will stick to wherever you place them; they will not fall and you will not be able to move them. However you can undo/redo blocks with the undo/redo buttons or press "Reset" to start building again from scratch.</p> <p>All towers consist of 8 blocks. Once you have placed 8 blocks you can compare your tower to the actual tower by pressing submit.</p>',
    '<p>One final thing you need to know: each new tower you see will be a different color. Later in the experiment, you will be asked to remember the shape the towers based on their color, so make sure you pay attention to both their color and shape. You may see the same tower more than once, but it will always be the same color. </em></p><p>That\'s all you need to know! Press Next to start the experiment.</p>'],
    "decodePhaseInstructions":['<p>Great job on the first part of the experiment! Now we want to see how well you remember the towers you have just studied.</p><p>On the next screen you\'ll be shown a building window, like the one you used in the BUILD activity. Your task now is to build as many towers as you can remember from the previous part of the experiment.</p>',
    '<p>You were shown 6 unique towers, each made from 8 blocks of a different color. Select a color, place 8 blocks, then press "Submit" to save your tower and start a new one. You may only submit one tower of each color. If you only half-remember a tower, please try your best to submit a tower that is as close as possible to the one remember. Press Next to begin.</p>'],
    "taskParameters": { // parameter for indivudal trial types. Majority of task parameters are set in metadata.
      "build" : {
        afterBuildPauseDuration : 3000,
        prompt : "BUILD",
        },
      "view" : {
        towerDuration : 15000, // 15s to match Wammes 2019
        prompt : "LOOK",
        },
      "oldNew" : {
        imagePath : '../img/cogsci_towers/cogsci_towers_',
        iti : 1000,
        prompt : "old or new?"
      }
    },
    "trialTypes":{
      "build": "block-tower-building-undo",
      "view": "block-tower-viewing",
      "oldNew": "block-tower-old-new-img",
    }
  }
  