//
// Computer Graphics
//
// WebGL Exercises
//

// Register function to call after document has loaded
window.onload = startup;



// the gl object is saved globally
var gl;

// we keep all local parameters for the program in a single object
var ctx = {
    shaderProgram: -1, //wird unten wieder überschrieben
    aVertexPositionId : -1,
    uColorId: -1,
    aVertexTextureCoordId: -1,
    uSamplerId: -1
};

// we keep all the parameters for drawing a specific object together
var rectangleObject = {
    buffer: -1
};

// keep texture parameters in an object so we can mix textures and objects
var lennaTxt = {
    textureObj : {}
};

/* *
* Initialize a texture from an image
* @param image the loaded image
* @param textureObject WebGL Texture Object
*/
function initTexture (image, textureObject) {
// create a new texture
    gl.bindTexture(gl.TEXTURE_2D, textureObject);
// set parameters for the texture
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.generateMipmap(gl.TEXTURE_2D);
// turn texture off again
    gl.bindTexture(gl.TEXTURE_2D, null);
}

/* *
* Load an image as a texture
*/
function loadTexture() {
    var image = new Image();
// create a texture object
    lennaTxt.textureObj = gl.createTexture();
    image.onload = function() {
        initTexture(image, lennaTxt.textureObj);
// make sure there is a redraw after the loading of the texture
        draw();
    };
// setting the src will trigger onload
    image.src = "lena512.png";
}




/**
 * Startup function to be called when the body is loaded
 */
function startup() {


    "use strict";
    var canvas = document.getElementById("myCanvas");
    gl = createGLContext(canvas);

    initGL();
    loadTexture();
    //draw();
}

/**
 * InitGL should contain the functionality that needs to be executed only once
 */
function initGL() {
    "use strict";
    ctx.shaderProgram = loadAndCompileShaders(gl, 'VertexShader.glsl', 'FragmentShader.glsl');
    setUpAttributesAndUniforms();
    setUpBuffers();

    // set the clear color here
    gl.clearColor(0,0,0,1); //-> damit wird alles übermalen (erst wenn clear)
    
    // add more necessary commands here
}

/**
 * Setup all the attribute and uniform variables
 */
function setUpAttributesAndUniforms(){
    "use strict";
    // finds the index of the variable in the program
	ctx.aVertexPositionId = gl.getAttribLocation(ctx.shaderProgram, "aVertexPosition");
    ctx.uColorId = gl.getAttribLocation(ctx.shaderProgram, "aVertexColor");
    ctx.aVertexTextureCoordId = gl.getAttribLocation(ctx.shaderProgram, "aVertexTextureCoord");
    ctx.uSamplerId = gl.getUniformLocation(ctx.shaderProgram, "uSampler");
}

/**
 * Setup the buffers to use. If more objects are needed this should be split in a file per object.
 */
function setUpBuffers(){
    "use strict";

    rectangleObject.buffer = gl.createBuffer();


    var verticesColor = [
        -0.5,-0.5,      1.0,    0.0,    0.0,    1.0,
        0.5,-0.5,       0.0,    1.0,    0.0,    1.0,
        0.5,0.5,        0.0,    1.0,    1.0,    1.0,
        -0.5,0.5,       0.0,    0.0,    1.0,    1.0
    ];


    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesColor), gl.STATIC_DRAW);

    var textureCoord = [
        0.0,    0.0,
        1.0,    0.0,
        1.0,    1.0,
        0.0,    1.0
    ]
    rectangleObject.textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoord), gl.STATIC_DRAW);

}

/**
 * Draw the scene.
 */
function draw() {
    "use strict";
    console.log("Drawing");
    gl.clear(gl.COLOR_BUFFER_BIT);
    // add drawing routines here

    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.buffer);

    //Position
    gl.vertexAttribPointer(ctx.aVertexPositionId, 2, gl.FLOAT, false, 24,0);
    gl.enableVertexAttribArray(ctx.aVertexPositionId);

    //color
    gl.vertexAttribPointer(ctx.uColorId, 4, gl.FLOAT, false, 24, 8);
    gl.enableVertexAttribArray(ctx.uColorId);

    //enable texture coordinates from the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, rectangleObject.textureBuffer);
    gl.vertexAttribPointer(ctx.aVertexTextureCoordId, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(ctx.aVertexTextureCoordId);

    //enable the texture mapping
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, lennaTxt.textureObj);
    gl.uniform1i(ctx.uSamplerId, 0)


    gl.drawArrays(gl.TRIANGLE_FAN, 0,4);
    console.log("done");

}