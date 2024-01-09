/*
 * Displays a domain stimuli and prompts subject for language production.
 *
 * Requirements for towers domain.
 *  block Display widget (i.e. import blockConfig.js and blockDisplay.js above this plugin in html)
 */

// const { transform } = require("lodash");

var DEFAULT_IMAGE_SIZE = 200;

jsPsych.plugins["block-tower-building-recall-choose-color"] = (function () {
  var plugin = {};

  // jsPsych.pluginAPI.registerPreload('block-construction', 'stimulus', 'image');

  plugin.info = {
    name: "block-tower-building-recall-choose-color",
    parameters: {
      domain: {
        type: jsPsych.plugins.parameterType.STRING, // Domain to display.
        default: "",
      },
      // stimURL: {
      //   type: jsPsych.plugins.parameterType.STRING, // BOOL, STRING, INT, FLOAT, FUNCTION, KEYCODE, SELECT, HTML_STRING, IMAGE, AUDIO, VIDEO, OBJECT, COMPLEX
      //   default: "",
      // },
      // stimulus: {
      //   type: jsPsych.plugins.parameterType.OBJECT,
      //   // default: {
      //   //   'blocks': [{ 'x': 0, 'y': 0, 'height': 2, 'width': 1 },
      //   //   { 'x': 2, 'y': 0, 'height': 2, 'width': 1 },
      //   //   { 'x': 0, 'y': 2, 'height': 1, 'width': 2 },
      //   //   { 'x': 2, 'y': 2, 'height': 1, 'width': 2 }]
      //   // },
      // },
      // stimId: {
      //   type: jsPsych.plugins.parameterType.STRING,
      //   default: "None",
      // },
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
        default: 8,
        description: "Number of blocks that can be placed before the trial ends or resets",
      },
      dataForwarder: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: "Function to call that forwards data to database (or otherwise)",
        default: (data) => console.log(data),
      },
      iti: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'ITI',
        default: 0,
        description: 'Time (ms) in between trials after clearing screen.'
      },
      trialNum :{
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial Number',
        default: 0,
        description: 'Externally assigned trial number.'
      },
      towerDetails: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: "Additional tower informatiom to append to data",
        default: {},
      },
      towerColor: {
        type: jsPsych.plugins.parameterType.OBJECT,
        pretty_name: "Color to display blocks",
        default: null,
      }
    },
  };

  plugin.trial = function (display_element, trial) {

    trial.nBlocksPlaced = 0;
    trial.finished = false;
    const undoredoManager = new UndoRedoManager();

    // extra controls
    function controlHandler(event) {
      switch (event.keyCode) {
        case 68: // d: switch selected block
          // switchSelectedBlock();
          break;
        case 32: // space: switch selected block
          event.preventDefault(); //stop spacebar scrolling 
          // switchSelectedBlock();
          break;
        case 27: // escape: stop placing block
          // stopPlacingBlock();
          break;
        case 90: // z: undo
          if (event.ctrlKey) {
            if (event.shiftKey){
              undoredoManager.redo();
            } else {
            undoredoManager.undo();
            }
          } else if (event.metaKey){
            if (event.shiftKey){
              undoredoManager.redo();
            } else {
            undoredoManager.undo();
            }
          }
          break;
        case 89: // y: redo
          if (event.ctrlKey) {
            undoredoManager.redo();
          } else if (event.metaKey){
            event.preventDefault();
            undoredoManager.redo();
          }
          break;
        default:
          break;
      }
    };

    // if (trial.trialNum == 1) { // hack to avoid handlers being added more than once
    //   $(document).on("keydown", controlHandler);
    // };

    $(document).on("keydown", controlHandler);

    window.currTrialNum += 1;
  
    display_element.innerHTML = "";

    var html_content = "";

    // show preamble text

    html_content += '<h1 id="prompt">'+trial.prompt+'</h1>';
    
    html_content += '<div class="container" id="experiment">';

    /** Create building canvases **/

    // building window
    html_content += '<div class="row env-row">';
    html_content += '<div class=" col env-div env-flex" id="environment-canvas" style="flex-basis: 0; margin: auto"><p id="block-counter" style="margin-top: 10px">' + trial.nBlocksPlaced + ' of ' + trial.nBlocksMax + ' blocks placed</p>';
    html_content += '<div id="colorPicker"></div>';
    html_content += '</div>';
    // html_content += '</div>';


    html_content += '<div class="col button-col">';
    html_content += '<div class="button-div">';
    html_content += '<button id="undo-button" type="button" title="undo" class="btn btn-light">↩</button>';
    html_content += '<button id="redo-button" type="button" title="redo" class="btn btn-light">↪</button>';
    html_content += '<button id="submit-button" type="button" class="btn btn-primary" style="float:right;" disabled=true>Submit</button>';
    html_content += '</div>'
    html_content += '<button id="reset-button" type="button" class="btn btn-warning">Reset</button>';


    // html_content += '<p class="build-recall-prompt"></p>';
    // html_content += '<p id="block-counter">' + trial.nBlocksPlaced + ' of ' + trial.nBlocksMax + ' blocks placed</p>';
    html_content += '<p class="build-recall-prompt">Build the towers you remember from the previous part of the experiment. Select a color from the palette underneath the building window. You can submit one tower of each color.</br></br>Each tower has tower has 8 blocks. Once you have placed 8 blocks, press Submit to save your tower.  </br></br>Press "No more towers" when you can\'t remember any more towers.</p>';

    html_content += '</div>';

    html_content += '</div>';

    // html_content += '<div class="row pt-3 button-row">';
    // html_content += '<button id="reset-button" type="button" class="btn btn-warning">Reset</button>';
    // html_content += '<button id="submit-button" type="button" class="btn btn-primary">Submit</button>';
    // html_content += '</div>';

    html_content += '<div class="row pt-1 button-row">';
    html_content += '<button id="finish-button" type="button" class="btn btn-danger">No more towers</button>';
    html_content += '</div>';

    html_content += "</div>";
    // html_content += '<p>Use ctrl/cmd + minus-sign (-) if windows do not fit on the screen at the same time.</p>';

    display_element.innerHTML = html_content;


    document.getElementById("reset-button").disabled = false;
    

    let handleUndo = function (blockData) {

      console.log('undo handled');
      console.log('undo from:', trial.trialNum);

      let timeNow = Date.now();
      trial.nBlocksPlaced -= 1;
      document.getElementById('block-counter').innerText = '' + trial.nBlocksPlaced + ' of ' + trial.nBlocksMax + ' blocks placed';
      if (trial.nBlocksPlaced==trial.nBlocksMax){
        document.getElementById("submit-button").disabled = false;
      } else {
        document.getElementById("submit-button").disabled = true;
      }

      trial.dataForwarder(
        _.extend(
          {},
          blockData,
          {
            trial_num: trial.trialNum,
            trial_type: plugin.info.name,
            absolute_time: timeNow,
            datatype: 'block_undo_placement',
            relative_time: timeNow - trial.trialStartTime
          })
      );
    };
    undoredoManager.addEventListener("undo", handleUndo);
    
    let handleRedo = function (blockData) {

      let timeNow = Date.now();
      trial.nBlocksPlaced += 1;
      document.getElementById('block-counter').innerText = '' + trial.nBlocksPlaced + ' of ' + trial.nBlocksMax + ' blocks placed';
      if (trial.nBlocksPlaced==trial.nBlocksMax){
        document.getElementById("submit-button").disabled = false;
      } else {
        document.getElementById("submit-button").disabled = true;
      }

      trial.dataForwarder(
        _.extend(
          {},
          blockData,
          {
            trial_num: trial.trialNum,
            trial_type: plugin.info.name,
            absolute_time: timeNow,
            datatype: 'block_redo_placement',
            relative_time: timeNow - trial.trialStartTime
          })
      );
    };

    undoredoManager.addEventListener("redo", handleRedo);

    // if (trial.stimulus !== null) {

    trial.trialStartTime = Date.now();

    let constructionTrial = {
      // stimulus: trial.stimulus.blocks,
      endCondition: 'submit-pressed',
      blocksPlaced: 0,
      nResets: -1, // start minus one as reset env at beginning of new trial
      // nBlocksMax: trial.nBlocksMax,
      offset: trial.offset,
      blockSender: blockSender,
      resetSender: resetSender,
      endBuildingTrial: endTrial,
      towerColor: trial.towerColor // overrides config if not null
    };

    trial.constructionTrial = constructionTrial;

    var showStimulus = false;
    var showBuilding = true;

    blockSetup(constructionTrial, showStimulus, showBuilding);
    blockUniverse.disabledBlockPlacement = false;

    $("#submit-button").click(() => {
      blockUniverse.endBuilding();
    });

    // UI
    $("#reset-button").click(() => {
      resetBuilding();
    });

    $("#finish-button").click(() => {
      jsPsych.endCurrentTimeline();
      endTrial({
        endReason : 'give-up'
      });
    });

    $("#undo-button").click(() => {
      undoredoManager.undo();
    });

    $("#redo-button").click(() => {
      undoredoManager.redo();
    });

    resetBuilding = function () {
      undoredoManager.redostack = [];
      let nBlocksWhenReset = trial.nBlocksPlaced;
      constructionTrial.nResets += 1;
      trial.nBlocksPlaced = 0;
      document.getElementById('block-counter').innerText = '' + trial.nBlocksPlaced + ' of ' + trial.nBlocksMax + ' blocks placed';

      if (trial.nBlocksPlaced!=trial.nBlocksMax){
        document.getElementById("submit-button").disabled = true;
      }

      resetSender({
        n_blocks_when_reset: nBlocksWhenReset,
      });

      if (_.has(blockUniverse, 'p5env') ||
        _.has(blockUniverse, 'p5stim')) {
        blockUniverse.removeEnv();
        // blockUniverse.removeStimWindow();
      };

      blockSetup(constructionTrial, showStimulus, showBuilding);

    };

    resetBuilding(); // call once to clear from previous trial


    function generateColorPicker(colors) {
      console.log(colors);
      const container = document.getElementById("colorPicker");
      container.innerHTML = ""; // Clear existing buttons if any

      for (let i = 0; i < colors.length; i++) {
          let color = colors[i]

          let btn = document.createElement("button");
          btn.classList.add("color-btn");
          let rgbaString = `rgba(${color[0]},${color[1]},${color[2]},${color[3] / 255})`;
          btn.style.backgroundColor = rgbaString;

          btn.addEventListener("click", function() {
              // Clear previous selection
              let buttons = container.getElementsByClassName("color-btn");
              for (let button of buttons) {
                  button.classList.remove("selected");
              }

              // Mark the clicked button as selected
              btn.classList.add("selected");

              // Call function with the selected color
              onColorSelected(color);
          });

          // select first color as default
          if (i == 0) {
            // Mark the clicked button as selected
            btn.classList.add("selected");
            constructionTrial.towerColor = color;
            resetBuilding();
          }

          container.appendChild(btn);
      }
    }

    function onColorSelected(color) {
        // This function gets called with the color when a button is clicked
        console.log("Selected color:", color);
        constructionTrial.towerColor = color;
        // if (_.has(blockUniverse, 'p5env') ||
        //   _.has(blockUniverse, 'p5stim')) {
        //   blockUniverse.removeEnv();
        //   // blockUniverse.removeStimWindow();
        // };

        resetBuilding();
    }

    // generateColorPicker(expConfig.experimentParameters.towerColors);
    generateColorPicker(expConfig.experimentParameters.remainingColors);


    function endTrial(trial_data) { // called by block_widget when trial ends

      $(document).off("keydown", controlHandler);
      undoredoManager.redostack = [];
      undoredoManager.removeEventListener("undo", handleUndo);
      undoredoManager.removeEventListener("redo", handleRedo);
      document.getElementById("reset-button").disabled = true;

      blockUniverse.disabledBlockPlacement = true;

      // remove selected color from future color picker
      expConfig.experimentParameters.remainingColors = _.filter(expConfig.experimentParameters.remainingColors, (color) => color != constructionTrial.towerColor);

      trial_data = _.extend(trial_data, trial.towerDetails, {
        trial_start_time: trial.trialStartTime,
        relative_time: Date.now() - trial.trialStartTime,
        // stimulus: trial.stimulus,
        color: constructionTrial.towerColor,
        rep: trial.rep,
        // condition: trial.condition,
        phase: trial.phase,
        fixation_duration: trial.fixationDuration,
        gap_duration: trial.gapDuration,
        n_resets: trial.constructionTrial.nResets,
        trial_num: trial.trialNum
      });

      var env_divs = document.getElementsByClassName("env-div");
      Array.prototype.forEach.call(env_divs, env_div => {
        env_div.style.backgroundColor = "#58CF76";
      });
      trial.finished = true;

      // window.blockUniverse.blockMenu.blockKinds = [];
      setTimeout(function () {
        display_element.innerHTML = '';
        setTimeout(function () {
          // move on to the next trial
          jsPsych.finishTrial(trial_data);
        }, trial.iti);

      }, trial.afterBuildPauseDuration);

    };

    function blockSender(block_data) { // called by block_widget when a block is placed

      undoredoManager.redostack = [];


      if (!trial.finished){
        //console.log(block_data);
        trial.nBlocksPlaced += 1;
        document.getElementById('block-counter').innerText = '' + trial.nBlocksPlaced + ' of ' + trial.nBlocksMax + ' blocks placed';
        if (trial.nBlocksPlaced==trial.nBlocksMax){
          document.getElementById("submit-button").disabled = false;
        } else {
          document.getElementById("submit-button").disabled = true;
        }

        if (trial.nBlocksPlaced >= trial.nBlocksMax) {
          // update block counter element

          // setTimeout(resetBuilding, 300); 
          // resetBuilding();
        }

        curr_data = _.extend(
          block_data, 
          trial.towerDetails, 
          {
            trial_num: trial.trialNum,
            trial_type: plugin.info.name,
            trial_start_time: trial.trialStartTime,
            relative_time: Date.now() - trial.trialStartTime,
            datatype: 'block_placement',
            // stimulus: trial.stimulus,
            // condition: trial.condition,
            n_block: trial.nBlocksPlaced,
            n_resets: trial.constructionTrial.nResets
        });

        trial.dataForwarder(curr_data);
      };

    };

    function resetSender(reset_data) { // called by block_widget when a block is placed

      let timeNow = Date.now();

      if (!trial.finished){
        curr_data = _.extend(
          reset_data, 
          trial.towerDetails, 
          {
            trial_num: trial.trialNum,
            trial_type: plugin.info.name,
            absolute_time: timeNow,
            trial_start_time: trial.trialStartTime,
            relative_time: timeNow - trial.trialStartTime,
            datatype: 'reset',
            // stimulus: trial.stimulus,
            // condition: trial.condition,
            n_block: trial.nBlocksPlaced,
            n_resets: trial.constructionTrial.nResets
        });

        trial.dataForwarder(curr_data);

      };
    };

  };

  return plugin;
})();



// class UndoRedoManager {
//   constructor() {
//     // undo stack is implicitly stored in window.blockUniverse
//     this.redostack = [];
    
//     this.events = {
//       "redo": [],
//       "undo": []
//     };
//   }

//   redo() {
//     if (this.redostack.length > 0) {
//       const block = this.redostack.pop();
//       window.blockUniverse.blocks.push(block);
//       var blockTop = block.y_index + block.blockKind.h;
//       var blockRight = block.x_index + block.blockKind.w;
//       for (let y = block.y_index; y < blockTop; y++) {
//         for (let x = block.x_index; x < blockRight; x++) {
//           window.blockUniverse.discreteWorld[x][y] = false;
//         }
//       }
//       this.events["redo"].forEach(f => f(this.getBlockData(block)));
//     }
//   }

//   undo() {
//     if (window.blockUniverse.blocks.length == 0) return;
//     const block = window.blockUniverse.blocks.pop();
//     var blockTop = block.y_index + block.blockKind.h;
//     var blockRight = block.x_index + block.blockKind.w;
//     for (let y = block.y_index; y < blockTop; y++) {
//       for (let x = block.x_index; x < blockRight; x++) {
//         window.blockUniverse.discreteWorld[x][y] = true;
//       }
//     }
//     this.redostack.push(block);
//     this.events["undo"].forEach(f => f(this.getBlockData(block)));
//   }

//   getBlockData(block) {
//     return _.extend({},
//       window.blockUniverse.getCommonData(),
//       {
//         block: block.getDiscreteBlock()
//       });
//   }

//   addEventListener(name, handler) {
//     this.events[name].push(handler);
//   }

//   removeEventListener(name, handler) {
//     if (!this.events.hasOwnProperty(name)) return;
//     const index = this.events[name].indexOf(handler);
//     if (index != -1) {
//       this.events[name].splice(index, 1)
//     }
//   }
// };/