//
// DI Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;

// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1,
    aVertexPositionId: -1,
    uColorId: -1,
    uProjectionMatId: -1,
    uModelMatId: -1
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1
};

var posLeft = 0;
var posRight = 0;
var posBall = {x: 0, y: 0, direction: "left"};
var startBall = 0;

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
    window.addEventListener('keyup', onKeyup, false);
    window.addEventListener('keydown', onKeydown, false);



    draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();
    
    gl.clearColor(0.1, 0.1, 0.1, 1);
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getUniformLocation(ctx.shaderProgram, "uColor");

    ctx.uProjectionMatId = gl.getUniformLocation(ctx.shaderProgram, "uProjectionMat");
    ctx.uModelMatId = gl.getUniformLocation(ctx.shaderProgram, "uModelMat");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";
    rectangleObject.buffer = gl.createBuffer();
    var vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5];
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    /*drawShape(0.03, 0.3, 0.9, 0);
    drawShape(0.03, 0.3, -0.9, 0);
    drawShape(0.01, 2, 0, 0);*/


    drawShape(25/gl.drawingBufferWidth, 0.3, -750/gl.drawingBufferWidth, posLeft);
    //drawShape(25/gl.drawingBufferWidth, 200/gl.drawingBufferHeight, 750/gl.drawingBufferWidth, 200/gl.drawingBufferHeight);
    drawShape(25/gl.drawingBufferWidth, 0.3, 750/gl.drawingBufferWidth, posRight);
    drawShape(5/gl.drawingBufferWidth, 1200/gl.drawingBufferHeight, 0, 0);
    drawShape(0.05, 0.06, posBall.x, posBall.y);

    /*drawShape(25.0/ gl.drawingBufferWidth,150.0/gl.drawingBufferHeight, 30, 0/gl.drawingBufferHeight)
    drawShape(25.0/ gl.drawingBufferWidth,150.0/gl.drawingBufferHeight, -30, 0/gl.drawingBufferHeight)
    drawShape(5.0/ gl.drawingBufferWidth,1200.0/gl.drawingBufferHeight, 0, 0/gl.drawingBufferHeight)*/


    gl.uniform4f(ctx.uColorId, 0, 1, 0, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    if(startBall == 0) {
        window.requestAnimationFrame(animateBall)
        startBall = 1;
    }
}

function drawShape(width, height, x, y) {

    var projectionMat = mat3.create();
    mat3.fromTranslation(projectionMat, [x,y]);
    mat3.scale(projectionMat, projectionMat, [width, height]);
    gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMat);

    /*var projectionMat = mat3.create();
    mat3.fromScaling(projectionMat, [width, height]);
    mat3.translate(projectionMat, projectionMat, [x,y]);
    gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMat);*/


    gl.uniform4f(ctx.uColorId, 0, 1, 0, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
}

function draw1() {

}

// Key Handling
var key = {
    _pressed: {},

    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40
};

function isDown (keyCode) {
    return key._pressed[keyCode];
}

function onKeydown(event) {
    key._pressed[event.keyCode] = true;
}

function onKeyup(event) {
    delete key._pressed[event.keyCode];
}

/*window.addEventListener('keydown', function (event)
{
    if (event.keyCode === 87) {
        console.log(posLeft)
        if(posLeft <= 0.8) {
            posLeft = posLeft + 0.05;
        }
        draw();
    }
    else if (event.keyCode === 83) {
        if(posLeft >= -0.8) {
            posLeft = posLeft - 0.05;
        }
        draw();
    }

});*/

var animationLeftUpV;
var animationLeftDownV;
var animationRightUpV;
var animationRightDownV;

window.addEventListener('keydown', function (event)
{
    if (event.keyCode === 87) {
        window.requestAnimationFrame(animationLeftUp)
    }
    else if (event.keyCode === 83) {
        animationLeftDownV = requestAnimationFrame(animationLeftDown)
    }
    else if (event.keyCode === 38) {
        animationRightUpV = requestAnimationFrame(animationRightUp)
    }
    else if (event.keyCode === 40) {
        animationRightDownV = requestAnimationFrame(animationRightDown)
    }

});

window.addEventListener('keyup', function (event)
{
    if (event.keyCode === 87) {
        cancelAnimationFrame(animationLeftUpV);
    }
    else if (event.keyCode === 83) {
        cancelAnimationFrame(animationLeftDownV);
    }
    else if (event.keyCode === 38) {
        cancelAnimationFrame(animationRightUpV);
    }
    else if (event.keyCode === 40) {
        cancelAnimationFrame(animationRightDownV);
    }

});

function animationLeftUp() {
    if(posLeft <= 0.8) {
        posLeft = posLeft + 0.01;
        draw();
        animationLeftUpV = requestAnimationFrame(animationLeftUp);
    }
}

function animationLeftDown() {
    if(posLeft >= -0.8) {
        posLeft = posLeft - 0.01;
        draw();
        animationLeftDownV = requestAnimationFrame(animationLeftDown);
    }
}

function animationRightUp() {
    if(posRight <= 0.8) {
        posRight = posRight + 0.01;
        draw();
        animationRightUpV = requestAnimationFrame(animationRightUp);
    }
}

function animationRightDown() {
    if(posRight >= -0.8) {
        posRight = posRight - 0.01;
        draw();
        animationRightDownV = requestAnimationFrame(animationRightDown);
    }
}

function checkCollision() { //posBall.x <= 0.5 &&
    if(posBall.x <= -0.9 && posBall.direction == "left" && (posBall.y > (posLeft - 0.175) && posBall.y < (posLeft + 0.175))) {
        posBall.direction = "right";
    }
    else if(posBall.direction == "right" && posBall.x >= 0.9 && (posBall.y > (posRight - 0.175) && posBall.y < (posRight + 0.175))) {
        posBall.direction = "left";
    }
    else if(posBall.direction == "right") {
        posBall.x = posBall.x + 0.01;
    }
    else if(posBall.direction == "left"){
        posBall.x = posBall.x - 0.01;
    }
    /*else {
        posBall.direction = "right";
        posBall.x = posBall.x - 0.01;
    }*/
}

function updateBall() {

}

function animateBall() {
    //posBall.x = posBall.x + 0.01;
    checkCollision();
    draw();
    window.requestAnimationFrame(animateBall);
}




