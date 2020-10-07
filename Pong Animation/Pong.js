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
var posBall = {x: 0, y: 0, direction: ["left","mid"]};
var startBall = 0;
var player = 1;
var playerHP = 1;
var player1HP = playerHP;
var player2HP = playerHP;
var ballColor = [];
var ballSpeedX = 0.02;
var ballSpeedY = 0.01;

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


    HP();
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

var vertices = [];
var numberOfTriangles = 100;
var degreesPerTriangle = (4 * Math.PI) / numberOfTriangles;
var centerX = 0;


function setUpBuffers(){
    "use strict";
    rectangleObject.buffer = gl.createBuffer();

    for(var i = 0; i < numberOfTriangles; i++) {
        var index = i * 3;
        var angle = degreesPerTriangle * i;
        var scaleX = 40;
        var scaleY = 25;
        vertices[index] = Math.cos(angle) / scaleX ;               // x
        vertices[index + 1] = Math.sin(angle) / scaleY + centerX; // y
        vertices[index + 2] = 0;                                 // z
    }

    vertices.push(
        -0.5, -0.5, 0.0,
        0.5, -0.5, 0.0,
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0
    )

    /*var vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5];*/
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

    drawCircle(1, 1, posBall.x, posBall.y, ballColor);
    drawShape(25/gl.drawingBufferWidth, 0.3, -750/gl.drawingBufferWidth, posLeft, [0,1,0,1]);
    //drawShape(25/gl.drawingBufferWidth, 200/gl.drawingBufferHeight, 750/gl.drawingBufferWidth, 200/gl.drawingBufferHeight);
    drawShape(25/gl.drawingBufferWidth, 0.3, 750/gl.drawingBufferWidth, posRight, [1,0,1,1]);
    drawShape(5/gl.drawingBufferWidth, 1200/gl.drawingBufferHeight, 0, 0, [1,1,1,1]);
    //drawShape(0.05, 0.06, posBall.x, posBall.y, ballColor);


    /*drawShape(25.0/ gl.drawingBufferWidth,150.0/gl.drawingBufferHeight, 30, 0/gl.drawingBufferHeight)
    drawShape(25.0/ gl.drawingBufferWidth,150.0/gl.drawingBufferHeight, -30, 0/gl.drawingBufferHeight)
    drawShape(5.0/ gl.drawingBufferWidth,1200.0/gl.drawingBufferHeight, 0, 0/gl.drawingBufferHeight)*/

    gl.uniform4f(ctx.uColorId, 0, 1, 0, 1);
    //gl.drawArrays(gl.TRIANGLE_FAN, numberOfTriangles, 4);

    /*if(startBall == 0) {
        animateBallV = requestAnimationFrame(animateBall)
        startBall = 1;
    }*/
}

function drawCircle(width, height, x, y, color) {
    gl.vertexAttribPointer(ctx.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);

    var projectionMat = mat3.create();
    mat3.fromTranslation(projectionMat, [x,y]);
    mat3.scale(projectionMat, projectionMat, [width, height]);
    gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMat);

    gl.uniform4f(ctx.uColorId, color[0], color[1], color[2], color[3]);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, numberOfTriangles -8); // draw the `O`
}

function drawShape(width, height, x, y, color) {

    var projectionMat = mat3.create();
    mat3.fromTranslation(projectionMat, [x,y]);
    mat3.scale(projectionMat, projectionMat, [width, height]);
    gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMat);

    /*var projectionMat = mat3.create();
    mat3.fromScaling(projectionMat, [width, height]);
    mat3.translate(projectionMat, projectionMat, [x,y]);
    gl.uniformMatrix3fv(ctx.uProjectionMatId, false, projectionMat);*/

    gl.uniform4f(ctx.uColorId, color[0], color[1], color[2], color[3]);
    gl.drawArrays(gl.TRIANGLE_FAN, numberOfTriangles, 8);
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
var animateBallV;
var keyLeftDown = 0;
var keyRightDown = 0;
window.addEventListener('keydown', function (event)
{
    if (event.keyCode === 87) {
        if(keyLeftDown == 0) {
            window.requestAnimationFrame(animationLeftUp);
            keyLeftDown = 1;
        }
    }
    else if (event.keyCode === 83) {
        if(keyLeftDown == 0) {
            animationLeftDownV = requestAnimationFrame(animationLeftDown);
            keyLeftDown = 1;
        }
    }
    else if (event.keyCode === 38 && player == 2) {
        if(keyRightDown == 0) {
            animationRightUpV = requestAnimationFrame(animationRightUp);
            keyRightDown = 1;
        }
    }
    else if (event.keyCode === 40 && player == 2) {
        if(keyRightDown == 0) {
            animationRightDownV = requestAnimationFrame(animationRightDown);
            keyRightDown = 1;
        }
    }
});

window.addEventListener('keyup', function (event)
{
    if (event.keyCode === 87) {
        cancelAnimationFrame(animationLeftUpV);
        keyLeftDown = 0;
    }
    else if (event.keyCode === 83) {
        cancelAnimationFrame(animationLeftDownV);
        keyLeftDown = 0;
    }
    else if (event.keyCode === 38) {
        cancelAnimationFrame(animationRightUpV);
        keyRightDown = 0;
    }
    else if (event.keyCode === 40) {
        cancelAnimationFrame(animationRightDownV);
        keyRightDown = 0;
    }

});

function animationLeftUp() {
    if(posLeft <= 0.8) {
        posLeft = posLeft + 0.035;
        draw();
        animationLeftUpV = requestAnimationFrame(animationLeftUp);
    }
}

function animationLeftDown() {
    if(posLeft >= -0.8) {
        posLeft = posLeft - 0.035;
        draw();
        animationLeftDownV = requestAnimationFrame(animationLeftDown);
    }
}

function animationRightUp() {
    if(posRight <= 0.8) {
        posRight = posRight + 0.035;
        draw();
        animationRightUpV = requestAnimationFrame(animationRightUp);
    }
}

function animationRightDown() {
    if(posRight >= -0.8) {
        posRight = posRight - 0.035;
        draw();
        animationRightDownV = requestAnimationFrame(animationRightDown);
    }
}

function checkCollision() {
    if(posBall.x < -0.92) {
        //console.log("Right wins");
        /*posBall.y = 0;
        posBall.x = 0;
        posBall.direction[0] = "left";
        posBall.direction[1] = "mid";
        if(player == 1) {
            posRight = 0;
        }*/
        gameEnd(2);
    }
    else if(posBall.x > 0.92) {
        //console.log("Left wins")
        /*posBall.y = 0;
        posBall.x = 0;
        posBall.direction[0] = "right";
        posBall.direction[1] = "mid";
        if(player == 1) {
            posRight = 0;
        }*/
        gameEnd(1)
    }
    else if(posBall.x <= -0.9 && posBall.direction[0] == "left" && (posBall.y > (posLeft - 0.175) && posBall.y < (posLeft + 0.175))) {
        posBall.direction[0] = "right";
        if(posBall.direction[1] == "mid") {
            posBall.direction[1] = "down";
        }
    }
    else if(posBall.direction[0] == "right" && posBall.x >= 0.9 && (posBall.y > (posRight - 0.175) && posBall.y < (posRight + 0.175))) {
        posBall.direction[0] = "left";
        if(posBall.direction[1] == "mid") {
            posBall.direction[1] = "down";
        }
    }
    else if(posBall.y >= 0.97 || posBall.y <= -0.97) {
        if(posBall.direction[1] == "up") {
            posBall.direction[1] = "down";
            posBall.y = posBall.y - ballSpeedY;
        }
        else {
            posBall.direction[1] = "up";
            posBall.y = posBall.y + ballSpeedY;
        }
    }
    else if(posBall.direction[0] == "right" && posBall.direction[1] == "mid") {
        posBall.x = posBall.x + ballSpeedX;
    }
    else if(posBall.direction[0] == "left" && posBall.direction[1] == "mid") {
        posBall.x = posBall.x - ballSpeedX;
    }
    else if(posBall.direction[0] == "right" && posBall.direction[1] == "up") {
        posBall.x = posBall.x + ballSpeedX;
        posBall.y = posBall.y + ballSpeedY;
    }
    else if(posBall.direction[0] == "right" && posBall.direction[1] == "down") {
        posBall.x = posBall.x + ballSpeedX;
        posBall.y = posBall.y - ballSpeedY;
    }
    else if(posBall.direction[0] == "left" && posBall.direction[1] == "up"){
        posBall.x = posBall.x - ballSpeedX;
        posBall.y = posBall.y + ballSpeedY;
    }
    else if(posBall.direction[0] == "left" && posBall.direction[1] == "down"){
        posBall.x = posBall.x - ballSpeedX;
        posBall.y = posBall.y - ballSpeedY;
    }

    if(posBall.x > 0) {
        ballColor = [0,1,0,1];
    }
    else if(posBall.x < 0) {
        ballColor = [1,0,1,1];
    }
}

function KIAnimation() {
    if(posBall.y < posRight) {
        if((Math.round(posRight * 100)/100) == 0.81) {
            posRight = posRight - 0.01;
        }
        else if((Math.round(posRight * 100)/100) <= 0.8 && (Math.round(posRight * 100)/100) >= -0.8) {
            posRight = posRight - 0.01;
        }
    }
    else if( posBall.y > posRight) {
        if((Math.round(posRight * 100)/100) == -0.81) {
            posRight = posRight + 0.01;
        }
        else if((Math.round(posRight * 100)/100) <= 0.8 && (Math.round(posRight * 100)/100) >= -0.8) {
            posRight = posRight + 0.01;
        }
    }
}

function animateBall() {
    animateBallV = requestAnimationFrame(animateBall);
    checkCollision();
    if(player == 1) {
        KIAnimation();
    }
    draw();
}

function gameEnd(winner) {
    cancelAnimationFrame(animateBallV);
    posBall.y = 0;
    posBall.x = 0;
    posBall.direction[0] = "left";
    posBall.direction[1] = "mid";
    ballColor = [1,1,1,1];
    posRight = 0;
    posLeft = 0;
    var count = 3;

    if(winner == 1) {
        if(player2HP > 1) {
            player2HP--;
            $("#player2HP img").last().remove();
            $("#winner").text("Player 1 wins this round");
            $("#winner").show();
        }
        else {
            player2HP = 0;
            $("#player2HP img").last().remove();
            $("#winner").text("Player 1 wins the Game");
            $("#winner").show();
            return
        }
    }
    else if(winner == 2){
        if(player1HP > 1) {
            player1HP--;
            $("#player1HP img").last().remove();
            if (player == 1) {
                $("#winner").text("Computer wins this round");
            } else {
                $("#winner").text("Player 2 wins this round");
            }
            $("#winner").show();
        }
        else {
            player1HP = 0;
            $("#player1HP img").last().remove();
            $("#winner").text("Player 2 wins the Game");
            $("#winner").show();
            return
        }
    }


    $("#start").text(count);
    $("#start").show();

        setTimeout(function () {
            count--;
            $("#start").text(count);

            setTimeout(function () {
                count--;
                $("#start").text(count);

                setTimeout(function () {
                    $("#start").text("GO");
                    animateBallV = requestAnimationFrame(animateBall);

                    setTimeout(function () {
                        $("#start").hide();
                        $("#winner").hide();
                    }, 1000);
                }, 1000);
            }, 1000);
        }, 1000);
}

function playerNumber(num) {
    player = num;
}

function startGame() {
    $("#start").hide();
    $("#winner").hide();
    $("#player1HP").empty();
    $("#player2HP").empty();
    HP();
    player1HP = playerHP;
    player2HP = playerHP;
    animateBallV = requestAnimationFrame(animateBall)
}

function HP() {
    for(var i = 0; i < playerHP; i++) {
        $("#player1HP").prepend('<img class=\"HPIcon\" src=\"player1HP.png\">');
        $("#player2HP").prepend('<img class=\"HPIcon\" src=\"player2HP.png\">');
    }
}