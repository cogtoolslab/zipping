/*
 * Displays a domain stimuli and prompts subject for language production.
 *
 * Requirements for towers domain.
 *  block Display widget (i.e. import blockConfig.js and blockDisplay.js above this plugin in html)
 */

// const { transform } = require("lodash");

var DEFAULT_IMAGE_SIZE = 200;

jsPsych.plugins["block-tower-match-to-sample"] = (function () {
  var plugin = {};

  jsPsych.pluginAPI.registerPreload('block-tower-match-to-sample', 'target', 'image');
  jsPsych.pluginAPI.registerPreload('block-tower-match-to-sample', 'distractors', 'image');
  jsPsych.pluginAPI.registerPreload('block-tower-match-to-sample', 'fixation_image', 'image');

  // jsPsych.pluginAPI.registerPreload('block-construction', 'stimulus', 'image');

  plugin.info = {
    name: "block-tower-viewing",
    parameters: {
      domain: {
        type: jsPsych.plugins.parameterType.STRING, // Domain to display.
        default: "",
      },
      stimulus: {
        type: jsPsych.plugins.parameterType.OBJECT,
      },
      target: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Target',
        default: undefined,
        description: 'The image to be displayed.'
      },
      distractors: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'distractors',
        default: undefined,
        description: 'Path to image file that is the distractor/distractors.'
      },
      distractorKinds: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'distractor Kinds',
        default: 'not provided',
        description: 'List of labels for kinds of distractor/distractors e.g. swap_wide'
      },
      fixation_image: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Fixation image',
        default: undefined,
        description: 'Path to image file that is a fixation target.'
      },
      set_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Set size',
        default: undefined,
        description: 'How many items should be displayed?'
      },
      stimId: {
        type: jsPsych.plugins.parameterType.STRING,
        default: "None",
      },
      prompt:{
        type: jsPsych.plugins.parameterType.STRING,
        default: "",
      },
      rep: {
        type: jsPsych.plugins.parameterType.INT,
        default: 0
      },
      offset: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Offset",
        default: 0,
        description: "Number of squares to right stim is displaced in stimulus."
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Preamble",
        default: null,
        description:
          "HTML formatted string to display at the top of the page above all the questions.",
      },
      buttonLabel: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Button label",
        default: "Continue",
        description: "The text that appears on the button to finish the trial.",
      },
      nBlocksMax: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: "Number of blocks available",
        default: 4,
        description: "Number of blocks that can be placed before the trial ends or resets",
      },
      dataForwarder: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: "Function to call that forwards data to database (or otherwise)",
        default: (data) => console.log(data),
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when subject makes a response.'
      },
      towerDetails: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: "Additional tower informatiom to append to data",
        default: {},
      },
      towerDuration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Time tower is displayed for',
        default: 1000,
        description: 'Time (ms) tower is displayed for.'
      },
      iti: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'ITI',
        default: 0,
        description: 'Time (ms) in between trials after clearing screen.'
      },
      prompt:{
        type: jsPsych.plugins.parameterType.STRING,
        default: "MATCH",
      },
      trialNum :{
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial Number',
        default: 0,
        description: 'Externally assigned trial number.'
      },
      towerColor: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: "Color to display blocks",
        default: null,
      },
      set_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Set size',
        default: undefined,
        description: 'How many items should be displayed?'
      },
      target_present: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Target present',
        default: true,
        description: 'Is the target present?'
      },
      target_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Target size',
        array: true,
        default: [50, 50],
        description: 'Two element array indicating the height and width of the search array element images.'
      },
      fixation_size: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Fixation size',
        array: true,
        default: [16, 16],
        description: 'Two element array indicating the height and width of the fixation image.'
      },
      circle_diameter: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Circle diameter',
        default: 350,
        description: 'The diameter of the search array circle in pixels.'
      },
      target_present_key: {
        type: jsPsych.plugins.parameterType.KEY,
        pretty_name: 'Target present key',
        default: 'j',
        description: 'The key to press if the target is present in the search array.'
      },
      target_absent_key: {
        type: jsPsych.plugins.parameterType.KEY,
        pretty_name: 'Target absent key',
        default: 'f',
        description: 'The key to press if the target is not present in the search array.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'The maximum duration to wait for a response.'
      },
      fixation_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Fixation duration',
        default: 1000,
        description: 'How long to show the fixation image for before the search array (in milliseconds).'
      }
    },
  };

  plugin.trial = function(display_element, trial) {
    
    var arrayDisplayTime;
    
    var targetImg;

    var selectionMade = false;

    // circle params
    var diam = trial.circle_diameter; // pixels
    var radi = diam / 2;
    var paper_size = diam + trial.target_size[1];

    // stimuli width, height
    var stimh = trial.target_size[0];
    var stimw = trial.target_size[1];
    var hstimh = stimh / 2;
    var hstimw = stimw / 2;

    // fixation location
    var fix_loc = [Math.floor(paper_size / 2 - trial.fixation_size[0] / 2), Math.floor(paper_size / 2 - trial.fixation_size[1] / 2)];

    // possible stimulus locations on the circle
    var display_locs = [];
    var possible_display_locs = trial.set_size;
    var random_offset = Math.floor(Math.random() * 360);
    for (var i = 0; i < possible_display_locs; i++) {
      display_locs.push([
        Math.floor(paper_size / 2 + (cosd(random_offset + (i * (360 / possible_display_locs))) * radi) - hstimw),
        Math.floor(paper_size / 2 - (sind(random_offset + (i * (360 / possible_display_locs))) * radi) - hstimh)
      ]);
    }
    console.log(display_locs)

    // get target to draw on
    display_element.innerHTML += '<h1 id="prompt" style="margin-bottom: 30px">'+trial.prompt+'</h1>';
    display_element.innerHTML += '<div id="jspsych-visual-search-circle-container" style="position: relative; width:' + paper_size + 'px; height:' + paper_size + 'px"></div>';
    var paper = display_element.querySelector("#jspsych-visual-search-circle-container");

    // check distractors - array?
    if(!Array.isArray(trial.distractors)){
      fa = [];
      for(var i=0; i<trial.set_size; i++){
        fa.push(trial.distractors);
      }
      trial.distractors = fa;
    }

    // shuffle distractors
    let indices = _.range(trial.distractors.length);

    // Shuffle the indices array
    indices = _.shuffle(indices);

    // Use the shuffled indices to reorder both lists
    trial.shuffledDistractors = _.map(indices, index => {return trial.distractors[index]});
    trial.shuffledDistractorKinds = _.map(indices, index => {return trial.distractorKinds[index]});

    show_fixation();
    create_search_array();

    function show_fixation() {
      // show fixation
      //var fixation = paper.image(trial.fixation_image, fix_loc[0], fix_loc[1], trial.fixation_size[0], trial.fixation_size[1]);
      paper.innerHTML += "<img class='m2s-fixation' src='"+trial.fixation_image+"' style='width:"+trial.fixation_size[0]+"px; height:"+trial.fixation_size[1]+"px;'></img>";

      // wait
      jsPsych.pluginAPI.setTimeout(function() {
        // after wait is over
        show_search_array();
      }, trial.fixation_duration);
    }

    function clear_display() {
      display_element.innerHTML = '';
    }

    // Define the function to handle image clicks
    function onImageClick(img, selectionData) {
      // 'clickedImage' is the image element that was clicked
      // console.log('Image clicked:', clickedImage.id);
      // You can now use clickedImage or clickedImage.id as needed

      console.log(selectionData);

      // show feedback

      // Show feedback by changing border color
      if (!selectionData.correct) {
        feedback(img, '#cc4646')
      }
      feedback(targetImg, '#58CF76');

      setTimeout(function () {
        clear_display();
        end_trial(selectionData);
      }, 4000);

    }

    function feedback(img, color){
      img.style.borderColor = color;
      img.style.borderWidth = '3px';
      img.style.borderStyle = 'solid';
      img.style.width = trial.target_size[0] + 6 + 'px';
      img.style.height = trial.target_size[1] + 6 + 'px';
      img.style.top = parseInt(img.style.top, 10) - 3 + 'px';
      img.style.left = parseInt(img.style.left, 10)  - 3 + 'px';
    }

    function show_search_array() {

      document.getElementById('images-container').style.display = 'block';
      arrayDisplayTime = Date.now();

    }


    function create_search_array() {

      var search_array_images = [];

      var to_present = [];
      if(trial.target_present){
        to_present.push(trial.target);
      }
      to_present = to_present.concat(trial.shuffledDistractors);

      // for (var i = 0; i < display_locs.length; i++) {

      //   paper.innerHTML += "<img class='sample-img' src='"+to_present[i]+"' style='position: absolute; top:"+display_locs[i][0]+"px; left:"+display_locs[i][1]+"px; width:"+trial.target_size[0]+"px; height:"+trial.target_size[1]+"px;'></img>";

      // }

      // Create a div to hold the images
      var imagesContainer = document.createElement('div');
      imagesContainer.id = 'images-container';
      imagesContainer.style.display = 'none'; // Start off as hidden
      imagesContainer.style.position = 'relative'; // Ensure it doesn't affect the layout


      for (let i = 0; i < display_locs.length; i++) {
        // Create an image element
        let img = document.createElement('img');

        if (i == 0){
          targetImg = img;
        };

        img.className = 'sample-img';
        img.src = to_present[i];
        img.style.position = 'absolute';
        img.style.top = display_locs[i][0] + 'px';
        img.style.left = display_locs[i][1] + 'px';
        img.style.width = trial.target_size[0] + 'px';
        img.style.height = trial.target_size[1] + 'px';

        // Set an ID or some other identifier if needed
        img.id = 'image-' + i;

        // Add an event listener
        img.addEventListener('click', function() {

          if(!selectionMade){

            selectionMade = true;

            // Call a function with the clicked image or its ID
            let selectionData = {
              img_src : to_present[i],
              img_position : display_locs[i],
              correct : i == 0,
              response_kind : i == 0 ? 'target' : trial.shuffledDistractorKinds[i-1]
            }

            onImageClick(img, selectionData); 
          }
        });

        // Append the image to the paper element
        imagesContainer.appendChild(img);

      }

      paper.appendChild(imagesContainer);


      var trial_over = false;

      // var after_response = function(info) {

      //   trial_over = true;

      //   var correct = false;

      //   if ((jsPsych.pluginAPI.compareKeys(info.key, trial.target_present_key)) && trial.target_present ||
      //       (jsPsych.pluginAPI.compareKeys(info.key, trial.target_absent_key)) && !trial.target_present) {
      //     correct = true;
      //   }

      //   clear_display();

      //   end_trial(info.rt, correct, info.key);

      // }

      // var valid_keys = [trial.target_present_key, trial.target_absent_key];

      // key_listener = jsPsych.pluginAPI.getKeyboardResponse({
      //   callback_function: after_response,
      //   valid_responses: valid_keys,
      //   rt_method: 'performance',
      //   persist: false,
      //   allow_held_key: false
      // });

      // if (trial.trial_duration !== null) {

      //   jsPsych.pluginAPI.setTimeout(function() {

      //     if (!trial_over) {

      //       jsPsych.pluginAPI.cancelKeyboardResponse(key_listener);

      //       trial_over = true;

      //       var rt = null;
      //       var correct = 0;
      //       var key_press = null;

      //       clear_display();

      //       end_trial(rt, correct, key_press);
      //     }
      //   }, trial.trial_duration);

      // }

    }


    function end_trial(data) {

      let timeNow = Date.now();

      // data saving
      var trial_data = _.extend({}, data, {
        absolute_time: timeNow,
        trial_start_time: trial.trialStartTime,
        relative_time: timeNow - arrayDisplayTime,
        rt: timeNow - arrayDisplayTime,
        locations: display_locs,
        set_size: trial.set_size,
        trial_num: trial.trialNum,
        stimulus: trial.stimulus,
        condition: trial.condition,
        distractor_imgs: trial.shuffledDistractors,
        target_img: trial.target,
        stim : trial.stimId,
        distractor_kinds: trial.shuffledDistractorKinds,
        towerColor : trial.towerColor

      });

      setTimeout(function () {
        // move on to the next trial
        jsPsych.finishTrial(trial_data);
      }, trial.iti);
    }
  };

  // helper function for determining stimulus locations

  function cosd(num) {
    return Math.cos(num / 180 * Math.PI);
  }

  function sind(num) {
    return Math.sin(num / 180 * Math.PI);
  }

  return plugin;
})();
