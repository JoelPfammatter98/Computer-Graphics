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
    uColorId: -1
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1
};

/**
 * Startup function to be called when the body is loaded
 */
function startup() {
    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);
    initGL();
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
    /*var vertices = [
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5];*/



    for(var i = 0; i < numberOfTriangles; i++) {
        var index = i * 3;
        var angle = degreesPerTriangle * i;
        var scaleX = 40;
        var scaleY = 25;
        vertices[index] = Math.cos(angle) / scaleX ;               // x
        vertices[index + 1] = Math.sin(angle) / scaleY + centerX; // y
                                        // z
    }

    vertices.push(
        -0.5, -0.5,
        0.5, -0.5,
        0.5, 0.5,
        -0.5, 0.5);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    //gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    gl.uniform4f(ctx.uColorId, 0, 1, 0, 1);
    //gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);

    gl.vertexAttribPointer(ctx.aVertexPositionId, 3, gl.FLOAT, false, 0, 0);

    //gl.drawArrays(gl.TRIANGLES, numberOfTriangles, 10);

    gl.drawArrays(gl.TRIANGLE_FAN, 0, numberOfTriangles -4); // draw the `O`
}
