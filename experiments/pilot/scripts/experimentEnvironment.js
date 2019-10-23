// Experiment frame, with Matter canvas and surrounding buttons

var imagePath = '../img/';
//const  socket = io.connect();

// TEMPORARY VARIABLES TO BE READ IN

// Aliases for Matter functions
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    MouseConstraint = Matter.MouseConstraint,
    Mouse = Matter.Mouse,
    Sleeping = Matter.Sleeping,
    Runner = Matter.Runner;

// Parameters
var menuHeight = 100;
var menuWidth = 500;
let rotateIcon;
var floorY = 50;
var canvasY = 500;
var canvasX = 500;

// Metavariables
const dbname = 'block_construction';
const colname = 'silhouette';
const iterationName = 'testing';

// Stimulus Display
var stimCanvasX = canvasX;
var stimCanvasY = canvasY;
var stimX = stimCanvasX/2;
var stimY = stimCanvasY/2;

// p5 instances
var p5stim;
var p5env;

// Scaling values
var sF = 20; //scaling factor to change appearance of blocks
var worldScale = 2; //scaling factor within matterjs
var stim_scale = sF;

// Global Variables
var engine;
var ground;
var blocks = [];
var mConstraint; // mouse constraint for moving objects. Will delete?
var blockMenu;
var blockKinds = [];

// Block placement variables
var isPlacingObject = false;
var rotated = false;
var selectedBlockKind = null;

// Task variables
var targets;
var block_data; // data to send to mongodb about every block placement
var trial_data; // data to send to mongodb about every finished block structure
var newSelectedBlockKind; // init this variable so we can inspect it in the console
var newBlock; // init this variable so we can inspect it in the console

var blockDims = [
    [1, 2],
    [2, 1],
    [2, 2],
    [2, 4],
    [4, 2]
];

var setupEnvironment = function (env, disabledEnvironment = false) {

    // Processing JS Function, defines initial environment.
    env.setup = function() {

        // Create Experiment Canvas
        environmentCanvas = env.createCanvas(canvasX, canvasY); // creates a P5 canvas (which is a wrapper for an HTML canvas)
        environmentCanvas.parent('environment-window'); // add parent div 

        // Set up Matter Physics Engine
        engineOptions = {
            enableSleeping: true,
            velocityIterations: 24,
            positionIterations: 12
        }

        world = World.create({
            gravity: {
                y: 2
            }
        })
        engine = Engine.create(engineOptions);
        engine.world = world;
        //engine.world.gravity.y= 2;



        // Create block kinds that will appear in environment/menu. Later on this will need to be represented in each task.

        blockDims.forEach(dims => {
            w = dims[0]
            h = dims[1]
            blockKinds.push(new BlockKind(w, h, [15, 139, 141, 100]));
        });

        //TEMP: first block kind is selected
        selectedBlockKind = blockKinds[0]; //should really be first in list

        // Create Block Menu
        blockMenu = new BlockMenu(menuHeight, blockKinds);

        // Add things to the physics engine world
        ground = new Boundary(canvasX/2, (environmentCanvas.height - menuHeight)*1.15, canvasX*1.5, canvasY/3);
        //box1 = new Box(200, 100, 30, 30);

        // Runner- use instead of line above if changes to game loop needed

        runner = Matter.Runner.create({
            isFixed: true
        });
        Runner.run(runner, engine);

        // Set up interactions with physics objects
        // TO DO: stop interactions with menu bar rect
        var canvasMouse = Mouse.create(environmentCanvas.elt); //canvas.elt is the html element associated with the P5 canvas
        canvasMouse.pixelRatio = env.pixelDensity(); // Required for mouse's selected pixel to work on high-resolution displays

        var options = {
            mouse: canvasMouse // set object to mouse object in canvas
        }
        /* set up constraint between mouse and block- used to move around blocks with mouse click
        mConstraint = MouseConstraint.create(engine, options); // Create 'constraint' (like a spring) between mouse and 'body' object. 'body' is defined when mouse clicked.
        mConstraint.constraint.stiffness = 0.2; // can change properties of mouse interaction by playing with this constraint
        mConstraint.constraint.angularStiffness = 1;
        World.add(engine.world, mConstraint); // add the mouse constraint to physics engine world    
        */

    }


    env.draw = function() { // Called continuously by Processing JS 
        env.background(51);
        ground.show(env);

        // Menu
        blockMenu.show(env);
        /*
        // Rotate button
        env.noFill();
        env.stroke(200);
        env.arc(canvasX - 50, 50, 50, 50, env.TWO_PI, env.PI + 3 * env.QUARTER_PI);
        env.line(canvasX - 50 + 25, 50 - 23, canvasX - 50 + 25, 40);
        env.line(canvasX - 50 + 12, 40, canvasX - 50 + 25, 40);
        */

        blocks.forEach(b => {
            b.show(env);
        });
        /* For moving blocks with mouse drag
        if (mConstraint.body) { //if the constraint exists
            var pos = mConstraint.body.position;
            var offset = mConstraint.constraint.pointB;
            var m = mConstraint.mouse.position;
            stroke(0, 255, 0);
            line(pos.x + offset.x, pos.y + offset.y, m.x, m.y); // draw line of mouse constraint
        }*/
        if (isPlacingObject) {
            env.noCursor(); //feel like this is horribly ineffecient...
            selectedBlockKind.showGhost(env,env.mouseX, env.mouseY, rotated);
        }

    }

    env.mouseClicked = function() {
        //check to see if in env

        /* //Is clicking in top right of environment
        if (env.mouseY < 80 && env.mouseX > canvasX - 80 && isPlacingObject) {
            rotated = !rotated;
        }
        */
        
        if (!disabledEnvironment){ //environment will be disabled in some conditions
            
            // if mouse in main environment
            if (env.mouseY > 0 && (env.mouseY < canvasY - menuHeight) && (env.mouseX > 0 && env.mouseX < canvasX)) {
                if (isPlacingObject) {
                    blocks.forEach(b => {
                        Sleeping.set(b.body, false);
                    });
                    
                    blocks.push(new Block(selectedBlockKind, env.mouseX, env.mouseY, rotated));
                    selectedBlockKind = null;
                    env.cursor();
                    isPlacingObject = false;
                    rotated = false;
                    
                    /*
                    // test out sending newBlock info to server/mongodb
                    propertyList = Object.keys(newBlock.body); // extract block properties;
                    propertyList = _.pullAll(propertyList,['parts','plugin','vertices','parent']);  // omit self-referential properties that cause max call stack exceeded error
                    blockProperties = _.pick(newBlock['body'],propertyList); // pick out all and only the block body properties in the property list

                    // custom de-borkification
                    vertices = _.map(newBlock.body.vertices, function(key,value) {return _.pick(key,['x','y'])});
                    
                    
                    block_data = {dbname: dbname,
                                    colname: colname,
                                    iterationName: iterationName,
                                    dataType: 'block',
                                    gameID: 'GAMEID_PLACEHOLDER', // TODO: generate this on server and send to client when session is created
                                    time: performance.now(), // time since session began
                                    timeAbsolute: Date.now(),  
                                    blockWidth: newBlock['w'],
                                    blockHeight: newBlock['h'],
                                    blockCenterX: newBlock['body']['position']['x'],
                                    blockCenterY: newBlock['body']['position']['y'],
                            blockVertices: vertices,
                                    blockBodyProperties: blockProperties,
                                };            
                    console.log('block_data',block_data);
                    socket.emit('block',block_data);
                    */
                }
            }
            else if (env.mouseY > 0 && (env.mouseY < canvasY) && (env.mouseX > 0 && env.mouseX < canvasX)){ //or if in menu then update selected blockkind
                // is mouse clicking a block?
                newSelectedBlockKind = blockMenu.hasClickedButton(env.mouseX, env.mouseY, selectedBlockKind);
                if (newSelectedBlockKind) {
                    if (newSelectedBlockKind == selectedBlockKind) {
                        
                        //rotated = !rotated; // uncomment to allow rotation by re-selecting block from menu
                    } else {
                        rotated = false;
                    }
                    selectedBlockKind = newSelectedBlockKind;
                    isPlacingObject = true;
                }
            }
        }
    }

}

// Sketch Two
var setupStimulus = function (p5stim) {

    p5stim.setup = function () {
        stimulusCanvas = p5stim.createCanvas(stimCanvasX,stimCanvasX);
        stimulusCanvas.parent('stimulus-window'); // add parent div 
    };

    p5stim.draw = function () {
        p5stim.background(200);
        var testStim = {"blocks": [{"width": 2, "height": 1, "x": 1, "y": 0}, {"width": 4, "height": 2, "x": 4, "y": 0}, {"width": 4, "height": 2, "x": 0, "y": 1}, {"width": 2, "height": 1, "x": 6, "y": 2}, {"width": 2, "height": 1, "x": 0, "y": 3}, {"width": 4, "height": 2, "x": 3, "y": 3}, {"width": 1, "height": 2, "x": 7, "y": 3}, {"width": 2, "height": 1, "x": 0, "y": 4}, {"width": 2, "height": 2, "x": 0, "y": 5}, {"width": 2, "height": 1, "x": 2, "y": 5}, {"width": 2, "height": 1, "x": 5, "y": 5}, {"width": 1, "height": 2, "x": 2, "y": 6}, {"width": 1, "height": 2, "x": 3, "y": 6}, {"width": 2, "height": 2, "x": 5, "y": 6}, {"width": 2, "height": 1, "x": 0, "y": 7}]};
        showStimulus(p5stim,testStim)

    };
};

var trial = function(condition='external') {
    if (condition=='external'){
        explore()
    }
    else if (condition=='internal'){
        simulate()
    }
    else {
        console.log('Unrecognised condition type, use `external` or `internal`')
    }
    //wait until returned, then
    /*
    p5stim = new p5(setupStimulus,'stimulus-canvas');
    p5env = new p5(setupEnvironment,'environment-canvas');*/

    // then
    //resetStimWindow()

}

var setupEnvironmentCurried = function(disabledEnvironment) {
    //p5 constructor takes a one argument function, but we want to pass multiple arguments to our setup function
    // can think of it the place to put environment variables for a given trial or stage
    return (env) => {
        setupEnvironment(env, disabledEnvironment)
    }
}

var setupStimulusCurried = function() {
    // p5 constructor takes a one argument function, but we want to pass multiple arguments to our setup function
    // can think of it the place to put stimulus variables for a given trial

    return (env) => {
        setupStimulus(env)
    }
}

var simulate = function() {
    p5stim = new p5(setupStimulusCurried(),'stimulus-canvas');
    p5env = new p5(setupEnvironmentCurried(disabledEnvironment = true),'environment-canvas');
    hideEnvButtons();
}

var explore = function() {
    p5stim = new p5(setupStimulusCurried(),'stimulus-canvas');
    p5env = new p5(setupEnvironmentCurried(disabledEnvironment = false),'environment-canvas');
    hideDoneButton();
}

var buildStage = function() {
    p5stim = new p5(setupStimulusCurried(),'stimulus-canvas');
    p5env = new p5(setupEnvironmentCurried(disabledEnvironment = false),'environment-canvas');
}

var resetEnv = function(){
    
    // remove environment
    p5env.remove(); 
    
    // Update variables
    blocks = [];
    blockKinds = [];
    isPlacingObject = false;
    rotated = false;
    selectedBlockKind = null;
    // setup new environment   
}

var resetStimWindow = function(){
    // remove environment
    p5stim.remove(); 

}

function hideEnvButtons() {
    window.onload = function(){
        var envButtons = document.getElementById("env-buttons");
        envButtons.style.display = "none";
    };
    
}

function hideDoneButton() {
    window.onload = function(){
        var envButtons = document.getElementById("done");
        envButtons.style.display = "none";
    };
    
}

function revealEnvButtons() {
    window.onload = function(){
        var envButtons = document.getElemgitentById("env-buttons");
        envButtons.style.display = "inline-block";
    };
}


buildStage();