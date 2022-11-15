/** experimentSetup.js | Credit : WPM, YF, CW.
 * Sets up experiments from a config. Serving tihs expects a config with the following URL parameters:
  - configId: the name of the config file for the experiment.
  - experimentGroup: the name of the subdirectory containing the configs.
  - batchIndex: which batch of data to use when shuffling any stimuli.
 */

function setupExperiment() {
    var urlParams = getURLParams();
    var socket = io.connect();

    // var workerID = urlParams.PROLIFIC_PID;
    var workerID = urlParams.PROLIFIC_PID ? urlParams.PROLIFIC_PID : (urlParams.SONA_ID ? urlParams.SONA_ID : null)
    var studyLocation = urlParams.PROLIFIC_PID ? 'Prolific' : (urlParams.SONA_ID ? 'SONA' : null)
    const gameID = UUID();

    var metadata;

    getStimListFromMongo();

    function getStimListFromMongo(config, callback) { //called in experiments where stimulus subsets are stored in mongo database


        socket.emit('getStim',
            {
                gameID: gameID,
                stimColName: expConfig.stimColName, // should check if exists (but could do above when choosing whether or not to call this function)
            });


        socket.on('stimulus', data => {
            console.log('received metadata', data);
            metadata = data;
            var trialList = [];

            // randomize key assignments
            metadata.response_key_list = _.shuffle(['m','z']);
            metadata.response_key_dict = {
                'valid': metadata.response_key_list[0],
                'invalid':metadata.response_key_list[1]
            }
            // console.log(metadata.response_key_dict);

            setTimeout(() =>{
                sendMetadata(metadata);
            }, 500);

            setupLearnlPhase(trialList, trialList => {
                setupRecallPhase(trialList, trialList => {
                    setupOtherTrials(trialList);
                });
            });
        });
    };

    setupLearnPhase = function (trialList, callback){
        /**
         * Create different trial types based on metadata received plus additional parameters in config
         * Towers from all conditions except foil should be converted into trials
         */

        // TODO: create trials
        // find non-foil trials

        let learnTrialMetadata; // TODO FILL IN

        // map metadatumToTrial
        recallTrials = _.map(learnTrialMetadata, trialMetadatum => {
            metadatumToTrial(trialMetadatum, "learn")
        });

        // TODO: randomize order learning trials

        // TODO: append learning trials to (empty) trialList

        // forward trial list to next setup function
        callback(trialList);
    }

    metadatumToTrial = function(metadatum, phase) {
        /**
         * Augments trial information from metadatum with parameters in config
         */

        // trial type determined by condition when learning, otherwise it is an oldNew trial
        trialType = phase == "learn" ? condition : "oldNew";

        // select plugin based on trialType
        let trialPlugin = expConfig["trialTypes"][trialType];

        // create trial and add parameters for trial type from config
        let trial = _.extend({
            type: trialPlugin,
            trialType: trialType,
            condition: metadatum.condition,
        }, expConfig["taskParameters"][trialType]);

        return(trial);
    }

    setupRecallPhase = function (trialList, callback){
        /**
         * Create recall trials from metadata
         * Towers from all conditions.
         */

        // map over all trials
        recallTrials = _.map(metadatum.trials, trialMetadatum => {
            metadatumToTrial(trialMetadatum, "recall")
        });

        // TODO: randomize recall trials

        // TODO: append recall trials to END of current trial list

        // forward trial list to next setup function
        callback(trialList);
    }



    setupBuildingTrials = function (trialList, callback) {
        /**
         * Set up building trials
         * Grabs list of ids from metadata
         * Converts to URLs
         * Loads jsons
         * 
         * TODO: 
         * - add multiple building repetitions
         * - shuffle each rep
         */


        stimURLs = _.map(metadata.building_chunks, chunk_name => {
            return metadata.chunk_building_url_stem + chunk_name.slice(-3) + '.json'
        });

        window.buildTrialNum = 0;
        window.totalBuildTrials = metadata.building_chunks.length * expConfig.buildingReps;

        // load stimulus jsons
        getTowerStimuliJSONsFromUrls(stimURLs, stimURLsToJSONs => {

            for (let rep = 0; rep < expConfig.buildingReps; rep++) {

                // create trial objects
                var repTrials = _.map(metadata.building_chunks, chunk_name => {

                    stimURL = metadata.chunk_building_url_stem + chunk_name.slice(-3) + '.json'
                    return {
                        type: expConfig.experimentParameters.workingMemoryVersion ? 'block-construction-wm' : 'block-construction',
                        wmBuildingParams : expConfig.experimentParameters.wmBuildingParams,
                        stimulus: stimURLsToJSONs[stimURL],
                        condition: metadata.condition,
                        stimId: chunk_name.slice(-3), // number stim in S3
                        chunk_id: chunk_name, //experiment specific
                        chunk_type: chunk_name.substring(0, 4),
                        stimURL: stimURL,
                        condition: metadata.condition,
                        rep: rep,
                        prompt: "Please build the tower on the left by clicking to pick up and place blocks on the right.",
                        offset: chunk_name.substring(0, 4) == 'tall' ? 5 : 4,
                        dataForwarder: () => dataForwarder
                    }

                });

                _.map(_.shuffle(repTrials), buildingTrial => {
                    trialList.push(buildingTrial);
                });

            };

            let buildingInstructionPages = [];

            if (expConfig.buildingIntro) {buildingInstructionPages.push(expConfig.buildingIntro)};
            if (expConfig.buildingInstructions) {buildingInstructionPages.push(expConfig.buildingInstructions)};

            let buildingInstructionsTrials = {
                type: 'instructions',
                pages: buildingInstructionPages,
                show_clickable_nav: true
            };

            trialList.unshift(buildingInstructionsTrials);

            // console.log('building trials:', trialList);

            // send to next trial setup function (setupZippingTrials)
            callback(trialList);

        });

    }

    mapKeys = function(zipInst) {
        return zipInst.replace(/yes_key/i,metadata.response_key_dict['valid'].toUpperCase()).replace(/no_key/i,metadata.response_key_dict['invalid'].toUpperCase())
    }

    setupPrePostZippingTrials = function (trialList, callback) {
        /**
         * Sets up zipping blocks either end of current trial list
         */

        var zippingBlocks = {};

        var trialNum = 0;

        let phases = expConfig.experimentParameters.postOnly ? ['post_zipping_trials'] : ['pre_zipping_trials','post_zipping_trials'];

        // unlike previous versions, we don't iterate over stim durations.
        // blocks are defined in metadata.

        phases.forEach(phase => {

            metadata[phase].forEach((zipping_trial) => {

                stimURL = metadata.composite_url_stem + zipping_trial.composite + '.png';

                var maskURL;
                // add random mask
                if (expConfig.useMasks){
                    maskID = String(_.random(99)).padStart(3, '0'); //random mask between one and 100
                    maskURL = expConfig.maskURLStem + maskID + '.png'
                }

                let trialObj = {
                    type: expConfig.experimentParameters.workingMemoryVersion ? 'tower-zipping-wm' : 'tower-zipping',
                    stimulus: stimURL,
                    stimURL: stimURL,
                    composite_id: zipping_trial.composite,
                    practice: false,
                    miniBlock: zipping_trial.mini_block,
                    validity: zipping_trial.validity,
                    condition: zipping_trial.condition,
                    composite_talls_name: zipping_trial.composite,
                    // composite_wides_name: zipping_trial.composite_wides_name,
                    actual_tall_parts: zipping_trial.actual_tall_parts,
                    actual_wide_parts: zipping_trial.actual_wide_parts,
                    part_type: zipping_trial.part_type,
                    part_a_id: zipping_trial.part_a,
                    part_a_stimulus: metadata.chunk_zipping_url_stem + zipping_trial.part_a.slice(-3) + '.png',
                    part_a_url: metadata.chunk_zipping_url_stem + zipping_trial.part_a.slice(-3) + '.png',
                    part_b_id: zipping_trial.part_b,
                    part_b_url: metadata.chunk_zipping_url_stem + zipping_trial.part_b.slice(-3) + '.png',
                    part_b_stimulus: metadata.chunk_zipping_url_stem + zipping_trial.part_b.slice(-3) + '.png',
                    mask: expConfig.useMasks ? maskURL : null,
                    participantCondition: metadata.condition,
                    participantRotationName: metadata.rotation_name,
                    participantRotation: metadata.rotation,
                    stimVersion: metadata.version,
                    stimVersionInd: metadata.versionInd,
                    compatibleCondition: zipping_trial.compatible_condition,
                    compositeDuration: metadata.stimDuration,
                    gapDuration: expConfig.chunkOnset - metadata.stimDuration,
                    chunkDuration: expConfig.chunkDuration,
                    fixationDuration: expConfig.fixationDuration ? expConfig.fixationDuration : 1500, //used in place of ITI
                    choices: metadata.response_key_list,
                    valid_key: metadata.response_key_dict['valid'],
                    invalid_key: metadata.response_key_dict['invalid'],
                    phase: phase,
                    block: zipping_trial.block,
                    zippingTrialNum: trialNum
                };

                if (zippingBlocks[zipping_trial.block]) {
                    zippingBlocks[zipping_trial.block].push(trialObj);
                } else {
                    zippingBlocks[zipping_trial.block]  = [trialObj];
                };

                trialNum += 1;
                
            });
        });

        let preInstructions = {
            type: 'instructions',
            pages: [expConfig.preIntro,
                mapKeys(expConfig.zippingInstructions)],
            show_clickable_nav: true
        };

        let postInstructions = {
            type: 'instructions',
            pages: [expConfig.postIntro,
                mapKeys(expConfig.zippingInstructions)],
            show_clickable_nav: true
        };

        let zippingPre = [];
        let zippingPost = [];

        for (const [zippingBlockName, zippingBlock] of Object.entries(zippingBlocks)) {

            // select pre or post depending on block name
            zippingPhaseName = zippingBlockName.includes("pre") ? "pre" : "post";
            zippingPhase = zippingBlockName.includes("pre") ? zippingPre : zippingPost;
            
            // add things common to all zipping blocks
            var blockIntro = {
                type: 'instructions',
                pages: [
                    '<p></p>'+ mapKeys('<p>Reminder: press <strong>"NO_KEY" if the small towers cannot</strong> be combined to make the large one, press <strong>"YES_KEY" if they can</strong>.</p><p>Press Next when you are ready to start the next set of trials.</p>')
                ],
                show_clickable_nav: true
            };
           
            zippingBlock.unshift(blockIntro);

            zippingPhase.push(zippingBlock);

        }

        // PRACTICE TRIALS
        if (expConfig.zippingPracticeTrials){ //& !expConfig.devMode) {

            let zippingPracticeBlock = setupZippingPracticeTrials(); //setupZippingPracticeTrials(trialList);

            var zippingPracticeOutro = {
                type: 'instructions',
                pages: [
                    '<p>Great job! In the trials you\'ve just completed, you were shown the same large tower in every trial, but in the actual trials these will vary from trial to trial, so make sure you pay attention to their shape. They will also be a lot faster! Press Next to move on to the actual experiment.</p>',
                ],
                show_clickable_nav: true
            };

            zippingPracticeBlock.push(zippingPracticeOutro);

            console.log('expConfig.postOnly', expConfig.experimentParameters.postOnly);

            if(! expConfig.experimentParameters.postOnly) {
                zippingPre.unshift(zippingPracticeBlock);
            } else {
                zippingPost.unshift(zippingPracticeBlock);
            };
        }


        // CONSTRUCT PRE AND POST BLOCKS
        if (!expConfig.experimentParameters.postOnly) {
            let flatPre = _.flatten(zippingPre);
            flatPre.unshift(preInstructions);
            trialList = _.concat(flatPre, trialList)
        };


        trialList.push(postInstructions);
        zippingPost.forEach((postBlock) => {
            postBlock.forEach((trial) => {
                trialList.push(trial);
            });
        });


        callback(trialList);
    };


    setupZippingTrials = function (trialList, callback) {
        /**
         * Set up zipping/ perceptual test trials
         * Grabs list of ids from metadata
         * Converts to URLs
         * 
         */

        var zippingInstructions = {
            type: 'instructions',
            pages: [expConfig.zippingBlockIntro,
                mapKeys(expConfig.zippingInstructions)],
            show_clickable_nav: true
        };

        // trialList.push(zippingInstructions);

        if (expConfig.zippingPracticeTrials ){ //& !expConfig.devMode) {
            

            let zippingPracticeBlock = setupZippingPracticeTrials(trialList);
            
            // trialList.push(zippingPracticeIntro);

            zippingPracticeBlock.forEach((trial) => {
                trialList.push(trial);
            })   

            var zippingPracticeOutro = {
                type: 'instructions',
                pages: [
                    '<p>Great job! In the trials you\'ve just completed, you were shown the same large tower in every trial, but in the actual trials these will vary from trial to trial, so make sure you pay attention to their shape. They will also be a lot faster! Press Next to move on to the actual experiment.</p>',
                ],
                show_clickable_nav: true
            };

            trialList.push(zippingPracticeOutro);

        }

        var zippingBlocks = [];

        var trialNum = 0;

        // stimDurations is a list of durations provided in metadata (of the same length e.g. [32,32,32])
        // each of these is a BLOCK (set of ~48 trials, that may contain mini-blocks within it)
        metadata.stimDurations.forEach((stimDuration, i) => {


            var zippingTrialsInBlock = [];

            const miniBlocks = {};

            // create trial objects for this block
            metadata.zipping_trials.forEach(zipping_trial => {

                stimURL = metadata.composite_url_stem + zipping_trial.composite_talls_name + '.png';

                var maskURL;
                // random mask
                if (expConfig.useMasks){
                    maskID = String(_.random(99)).padStart(3, '0'); //random mask between one and 100
                    maskURL = expConfig.maskURLStem + maskID + '.png'
                }

                let trialObj = {
                    type: expConfig.experimentParameters.workingMemoryVersion ? 'tower-zipping-wm' : 'tower-zipping',
                    stimulus: stimURL,
                    stimURL: stimURL,
                    composite_id: zipping_trial.composite_talls_name,
                    practice: false,
                    miniBlock: zipping_trial.mini_block,
                    validity: zipping_trial.validity,
                    condition: zipping_trial.condition,
                    composite_talls_name: zipping_trial.composite_talls_name,
                    composite_wides_name: zipping_trial.composite_wides_name,
                    part_type: zipping_trial.part_type,
                    part_a_id: zipping_trial.part_a,
                    part_a_stimulus: metadata.chunk_zipping_url_stem + zipping_trial.part_a.slice(-3) + '.png',
                    part_a_url: metadata.chunk_zipping_url_stem + zipping_trial.part_a.slice(-3) + '.png',
                    part_b_id: zipping_trial.part_b,
                    part_b_url: metadata.chunk_zipping_url_stem + zipping_trial.part_b.slice(-3) + '.png',
                    part_b_stimulus: metadata.chunk_zipping_url_stem + zipping_trial.part_b.slice(-3) + '.png',
                    mask: expConfig.useMasks ? maskURL : null,
                    participantCondition: metadata.condition,
                    participantRotationName: metadata.rotation_name,
                    participantRotation: metadata.rotation,
                    stimVersion: metadata.version,
                    stimVersionInd: metadata.versionInd,
                    compatibleCondition: zipping_trial.compatible_condition,
                    compositeDuration: stimDuration,
                    gapDuration: expConfig.chunkOnset - stimDuration,
                    chunkDuration: expConfig.chunkDuration,
                    fixationDuration: expConfig.fixationDuration ? expConfig.fixationDuration : 1500, //used in place of ITI
                    choices: metadata.response_key_list,
                    valid_key: metadata.response_key_dict['valid'],
                    invalid_key: metadata.response_key_dict['invalid'],
                }

                // if shuffling is needed at a sub-block level division, add trials to this division
                if(expConfig.experimentParameters.miniBlocksWithinBlock){
                    if (!miniBlocks[trialObj.miniBlock]) {
                        miniBlocks[trialObj.miniBlock] = [trialObj];
                    } else {
                        miniBlocks[trialObj.miniBlock].push(trialObj);
                    };
                } else { // otherwise just add the trial to the block
                    zippingTrialsInBlock.push(trialObj)
                }
                
            });

            // shuffle zipping trials within mini-block
            if(expConfig.experimentParameters.miniBlocksWithinBlock){
                // miniblocks remains constant (minus replacing the miniblock with a shuffled version)

                // shuffle order of miniblocks (miniblocknum is an id rather than an order)
                let miniblockOrder = expConfig.experimentParameters.shuffleMiniBlockOrder ? _.shuffle(Object.entries(miniBlocks)) : Object.entries(miniBlocks);

                for (const [miniBlockNum, miniBlock] of miniblockOrder){

                    if (expConfig.experimentParameters.shuffleWithinMiniBlock){
                        var miniBlockTrialsShuffled = _.shuffle(miniBlock);
                        miniBlocks[miniBlockNum] = miniBlockTrialsShuffled;
                        zippingTrialsInBlock = zippingTrialsInBlock.concat(miniBlockTrialsShuffled);
                    } else {
                        zippingTrialsInBlock = zippingTrialsInBlock.concat(miniBlocks[miniBlockNum]);
                    }
                };
            } else {
                // do nothing
            };
            
            zippingBlocks.push(zippingTrialsInBlock);
        });
        
        // shuffle order of blocks
        if (expConfig.experimentParameters.shuffleBlocksInJS){ 
            zippingBlocks = _.shuffle(zippingBlocks);
        } 

        zippingBlocks.forEach((zippingBlock, i) => {

            // add block intro
            var blockIntro = {
                type: 'instructions',
                pages: [
                    '<p>Block ' + (i + 1) + ' of ' + zippingBlocks.length + mapKeys('.</p><p>Press <strong>"NO_KEY" if the small towers cannot</strong> be combined to make the big one, press <strong>"YES_KEY" if they can</strong>.</p><p>Press Next when you are ready to start.</p>')
                ],
                show_clickable_nav: true
            };

            // add preload
            var zippingPreload = {
                type: 'preload',
                auto_preload: true,
                trials: [zippingBlock]
            };

            trialList.push(zippingPreload);
            trialList.push(blockIntro)

            // add to trial list
            zippingBlock.forEach((trial) => {
                trialNum += 1;
                trial.blockNumber = i;
                trialList.push(_.extend(trial, { 'trialNum': trialNum }));
            });

        });
        console.log(trialList);

        callback(trialList);
    };

    setupZippingPracticeTrials = function () {
        zippingPracticeTrials = _.map(expConfig.zippingPracticeTrials, (practiceTrial) => {

            var maskURL;
            // random mask
            if (expConfig.useMasks){
                maskID = String(_.random(99)).padStart(3, '0'); //random mask between one and 100
                maskURL = expConfig.maskURLStem + maskID + '.png'
            }

            let trialObj = {
                type: expConfig.experimentParameters.workingMemoryVersion ? 'tower-zipping-wm' : 'tower-zipping',
                stimulus: practiceTrial.stimURL,
                stimURL: practiceTrial.stimURL,
                practice: true,
                composite_id: practiceTrial.composite_talls_name,
                miniBlock: practiceTrial.mini_block,
                validity: practiceTrial.validity,
                composite_talls_name: practiceTrial.composite_talls_name,
                composite_wides_name: practiceTrial.composite_wides_name,
                part_type: practiceTrial.part_type,
                part_a_stimulus: practiceTrial.part_a_stimulus,
                part_a_url: practiceTrial.part_a_stimulus,
                mask: expConfig.useMasks ? maskURL : null,
                part_b_url: practiceTrial.part_b_stimulus,
                part_b_stimulus: practiceTrial.part_b_stimulus,
                participantCondition: 'practice',
                participantRotationName: metadata.rotation_name,
                participantRotation: metadata.rotation,
                stimVersion: metadata.version,
                stimVersionInd: metadata.versionInd,
                compatibleCondition:  'practice',
                compositeDuration: practiceTrial.stimDuration,
                gapDuration: practiceTrial.chunkOnset - practiceTrial.stimDuration,
                chunkDuration: practiceTrial.chunkDuration,
                fixationDuration: expConfig.fixationDuration ? expConfig.fixationDuration : 1500,
                choices: metadata.response_key_list,
                valid_key: metadata.response_key_dict['valid'],
                invalid_key: metadata.response_key_dict['invalid'],
            };
            return(trialObj)}
            );
        
        var zippingPracticePreload = {
            type: 'preload',
            auto_preload: true,
            trials: [zippingPracticeTrials]
        };

        var zippingPracticeIntro = {
            type: 'instructions',
            pages: [ mapKeys(
                '<p>Now you will have a chance to practice this task. </br> Place one finger over \"NO_KEY\" (no! ❌)  and one over \"YES_KEY\" (yes! ✅), then press Next to continue.</p>'),
            ],
            show_clickable_nav: true
        };

        let zippingPracticeBlock = []
        zippingPracticeBlock.push(zippingPracticePreload);
        zippingPracticeBlock.push(zippingPracticeIntro);
        zippingPracticeTrials.forEach((trial) =>{
            zippingPracticeBlock.push(trial)
        });

        return (zippingPracticeBlock)
    }


    /* Set up trials */

    // Instructions

    setupOtherTrials = function (trialList) {

        if (!expConfig.devMode) {

            var consent = {
                type: "external-html",
                url: "../html/consent-ucsd.html",
                cont_btn: "start",
            };

            var instructionPages = []

            if (expConfig.compensationInfo && studyLocation != 'SONA'){
                instructionPages.push(expConfig.compensationInfo);
            };

            if (studyLocation == 'SONA'){
                instructionPages.push(expConfig.sonaInfo);
            }

            if (expConfig.mainInstructions){
                instructionPages.push(expConfig.mainInstructions);
            }

            // if (expConfig.buildingInstructions) {instructionPages.push(expConfig.buildingInstructions)}
            // if (expConfig.zippingInstructions) {instructionPages.push(mapKeys(expConfig.zippingInstructions))}

            // instructionPages.push('That\'s all you need to know! Press Next to start Part 1.')

            var instructions = {
                type: 'instructions',
                pages: instructionPages,
                show_clickable_nav: true
            };

            trialList.unshift(instructions);
            trialList.unshift(consent); // add consent before instructions


            // Exit survey
            var cc = studyLocation == 'Prolific' ? expConfig.completionCode :
                (studyLocation == 'SONA' ? workerID : null)

            var exitSurvey = constructDefaultExitSurvey(studyLocation, cc);

            trialList.push(exitSurvey) //push

        };

        // initialize jspsych with timeline
        constructExperimentTimeline(trialList);

    };

    let commonData = {
        experimentName: expConfig.experimentName,
        dbname: expConfig.dbname,
        colname: expConfig.colname,
        iterationName: expConfig.iterationName ? expConfig.iterationName : 'none_provided_in_config',
        configId: expConfig.configId,
        workerID: workerID,
        gameID: gameID,
        studyLocation: studyLocation
    };

    let sendMetadata = function (meta) {
        var postData = _.extend(
          {datatype: 'metadata'},
          commonData,
          meta
        );
        console.log('meta', postData);
        socket.emit("currentData", postData);
    };

    let dataForwarder = function (withinTrialData) {
        var postData = _.extend(
          {},
          commonData,
          withinTrialData
        );
        socket.emit("currentData", postData);
    };

    // Add all trials to timeline

    function constructExperimentTimeline(trialList) {

        /* #### Initialize jsPsych with complete experimental timeline #### */
        jsPsych.init({
            timeline: trialList,
            show_progress_bar: true,
            default_iti: 600, //up from 600 in zipping_calibration_sona_pilot
            on_trial_finish: function (trialData) {
                console.log('Trial data:', trialData);
                // Merge data from a single trial with
                // variables to be uploaded with all data
                var packet = _.extend({}, trialData, commonData, {
                    // prolificId(s): TODO: Hash and store prolific ID(s) in other file
                    datatype: 'trial_end',
                    response_key_dict: metadata.response_key_dict
                });

                // console.log(trialData);
                socket.emit("currentData", packet); //save data to mongo
            },
            on_finish: function () {
                window.experimentFinished = true;
                //console.log(jsPsych.data.get().values());
            },

        });
    };

}