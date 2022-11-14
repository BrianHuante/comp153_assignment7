//FileName:		model.js
//Programmer:	Dan Cliburn
//Date:			9/22/2020
//Purpose:		This file defines the code for our WebGL 2 model
//The "model" is all of the WebGL2 code that draws our graphics scene

//These variables can be accessed in any function
let gl;
let phong_tex_program, toon_program, point_sprite_program;
let projection_matrix, view_matrix, model_matrix;
let rotY, eye = [], aim = []; //variables to control movement
let modelMatrixLoc, viewMatrixLoc, projectionMatrixLoc;
let mat4;
let glacierTex, yosemiteTex, tigerTex, starTex, treeTex;
//TODO 4 and 5: create your own texture variables here

//Given a canvas element, return the WebGL2 context
//This function is defined in section "Architecture Updates" of the textbook
function getGLContext(canvas) {
    return canvas.getContext('webgl2') || console.error('WebGL2 is not available in your browser.');
}

//Given an id, extract the content's of a shader script from the DOM and return the compiled shader
//This function is defined in section "Time for Action: Rendering a Square" of the textbook
function getShader(id) {
    const script = document.getElementById(id);
    const shaderString = script.text.trim();
   
    // Assign shader depending on the type of shader  
    let shader;  
    if (script.type === 'shader.vert') 
    {    
        shader = gl.createShader(gl.VERTEX_SHADER);
    }  
    else if (script.type === 'shader.frag') 
    {    
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    }  
    else 
    {    
        return null;  
    }  
    // Compile the shader using the supplied shader code  
    gl.shaderSource(shader, shaderString);
    gl.compileShader(shader);
    // Ensure the shader is valid  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    {
        console.error(gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

//Load all of the shader programs
function initPrograms()
{
    //Load, compile, and link the shader code for the phong_tex_program
    const vertexShader1 = getShader('phong-tex-vertex-shader');
    const fragmentShader1 = getShader('phong-tex-fragment-shader');
    phong_tex_program = gl.createProgram(); //create a program 
      
    gl.attachShader(phong_tex_program, vertexShader1); //Attach the vertex shader to this program
    gl.attachShader(phong_tex_program, fragmentShader1); //Attach the fragment shader to this program
    gl.linkProgram(phong_tex_program);
    if (!gl.getProgramParameter(phong_tex_program, gl.LINK_STATUS))
    {
        console.error('Could not initialize phong_tex_program shaders');
    }
    
    //Load, compile, and link the shader code for the toon_program
    const vertexShader2 = getShader('toon-vertex-shader');
    const fragmentShader2 = getShader('toon-fragment-shader');
    toon_program = gl.createProgram(); //create a program 
      
    gl.attachShader(toon_program, vertexShader2); //Attach the vertex shader to this program
    gl.attachShader(toon_program, fragmentShader2); //Attach the fragment shader to this program
    gl.linkProgram(toon_program);
    if (!gl.getProgramParameter(toon_program, gl.LINK_STATUS))
    {
        console.error('Could not initialize phong_tex_program shaders');
    }

    //Load, compile, and link the shader code for the point_sprite_program
    const vertexShader3 = getShader('point-sprite-vertex-shader');
    const fragmentShader3 = getShader('point-sprite-fragment-shader');
    point_sprite_program = gl.createProgram(); //create a program 
      
    gl.attachShader(point_sprite_program, vertexShader3); //Attach the vertex shader to this program
    gl.attachShader(point_sprite_program, fragmentShader3); //Attach the fragment shader to this program
    gl.linkProgram(point_sprite_program);
    if (!gl.getProgramParameter(point_sprite_program, gl.LINK_STATUS))
    {
        console.error('Could not initialize point_sprite_program shaders');
    }
}

//Find the locations of the matrices in the active shader program
function initMatrices(program)
{
    modelMatrixLoc = gl.getUniformLocation(program, "modelMatrix");
    viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
    projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
}

//Initialize the light for the active shader program
function initLights(program)
{
    //find uniform variable locations for the light
    var globalAmbientLightLoc = gl.getUniformLocation(program, "globalAmbientLight");
    var lightColorLoc = gl.getUniformLocation(program, "light_color");
    var lightPosLoc = gl.getUniformLocation(program, "light_position");

    //set up the light for the scene
    gl.uniform3f(globalAmbientLightLoc, 0.1, 0.1, 0.1);  //minimum light level in the scene
    gl.uniform4f(lightColorLoc, 1.0, 1.0, 1.0, 1.0);  //color of the light (in this case it is white)
    gl.uniform4f(lightPosLoc, 10.0, 4.0, 10.0, 1.0);  //positional light since w = 1
}

//This function was written to assist with changing the active shader program and binding uniform locations to correct values
function changeShaderProgram(program, lights, projection, view, model) {
    gl.useProgram(program); //set the active shader program

    if (lights == 1) initLights(program); //set up lights to work with this shader program if lights == 1

    initMatrices(program); //set up matrices to work with this shader program, then update to current values
    gl.uniformMatrix4fv(projectionMatrixLoc, false, projection);
    gl.uniformMatrix4fv(viewMatrixLoc, false, view);
    gl.uniformMatrix4fv(modelMatrixLoc, false, model);
}

//initialize all of the buffers we need for our program
function initBuffers()
{
    initGround(gl); //defined in ground.js
    initPyramid(gl); //define in pyrmaid.js
    initCube(gl); //defined in cube.js
    initTexSquare(gl); //defined in texsquare.js
    //TODO 3: initialize your own object here
    
}

function initTex(id, tex)
{
    var Image = document.getElementById(id);

    //create a texture object, bind an image to the texture object, and define texture filtering modes
    tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    return tex;
}

//Initialize textures to be used in the program
function initTextures()
{
    glacierTex = initTex('glacier', glacierTex); //the image with id 'glacier' was loaded in Lab10.html
    yosemiteTex = initTex('yosemite', yosemiteTex); //the image with id 'yosemite' was loaded in Lab10.html
    tigerTex = initTex('tiger', tigerTex); //the image with id 'tiger' was loaded in Lab10.html
    starTex = initTex('star', starTex); //the image with id 'star' was loaded in Lab10.html
    treeTex = initTex('tree', treeTex); //the image with id 'tree' was loaded in Lab10.html
    //TODO 4 and 5: initialize your own textures here

    gl.bindTexture(gl.TEXTURE_2D, null);
}

//We call drawModel to render to our canvas
function drawModel() 
{  
    //Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    //define the view orientation transformation matrix based on current values for eye, aim, and up
    const up = [0.0, 1.0, 0];
    view_matrix = mat4.lookAt(view_matrix, eye, aim, up);  //calculate the view orientation matrix
    
    // *** Set the active shader program to the toon shader, then bind uniform variables and update matrices for this shader ***
    changeShaderProgram(toon_program, 1, projection_matrix, view_matrix, mat4.identity(model_matrix));
        //Note that the second parameter of 1 indicates that the light uniforms should be bound for this shader

    drawGround(gl); //draw the model of the ground, defined in ground.js

    //position and then draw the cube
    var vec = [12.0, 1.0, 12.0]; //position of the cube in the scene
    model_matrix = mat4.translate(model_matrix, mat4.identity(model_matrix), vec);
    gl.uniformMatrix4fv(modelMatrixLoc, false, model_matrix); //send current model matrix to the toon shaders
    drawCube(gl); //defined in cube.js

    //position and then draw the pyramid
    var vec = [9.3, 1.0, 9.3]; //position of the pyramid in the scene
    const x_axis = [1.0, 0.0, 0.0];
    model_matrix = mat4.translate(model_matrix, mat4.identity(model_matrix), vec);
    model_matrix = mat4.rotate(model_matrix, model_matrix, 3.14159 / 2.0, x_axis); //NOTE: angle in radians
    gl.uniformMatrix4fv(modelMatrixLoc, false, model_matrix); //send current model matrix to the toon shaders
    drawPyramid(gl); //defined in pyramid.js

    //TODO 3: position and then draw your own object to be shaded with the toon shader

    // *** Set active shader program to phong_tex_program, then bind uniform variables and update matrices for this shader ***
    changeShaderProgram(phong_tex_program, 1, projection_matrix, view_matrix, mat4.identity(model_matrix));
        //Note that the second parameter of 1 indicates that the light uniforms should be bound for this shader
    var samplerLoc = gl.getUniformLocation(phong_tex_program, "tex_image"); //bind samplerLoc for this shader

    //Set up gl.TEXTURE0 as the active texture
    gl.activeTexture(gl.TEXTURE0); //Set the current texture number
    gl.uniform1i(samplerLoc, 0); //tell shaders that the sample variable should be associated with gl.TEXTURE0

    //position and draw the first textured square with the glacier texture
    const y_axis = [0.0, 1.0, 0.0];
    const color = [1.0, 1.0, 1.0];
    vec = [-10.0, 5.0, 10.0]; //position of texsquare #1 in the scene
    var scale = [2.0, 2.0, 2.0];
    model_matrix = mat4.translate(model_matrix, mat4.identity(model_matrix), vec);
    model_matrix = mat4.rotate(model_matrix, model_matrix, 3.14159 / 2.0, y_axis); //NOTE: angle in radians
    model_matrix = mat4.scale(model_matrix, model_matrix, scale);
    gl.uniformMatrix4fv(modelMatrixLoc, false, model_matrix); //send the updated model matrix to the shaders
    gl.bindTexture(gl.TEXTURE_2D, glacierTex); //use the glacierTex for this square
    drawTexSquare(gl, color, 100.0); //defined in texsquare.js

    //position and draw the second textured square with the yosemite texture
    vec = [13.0, 10.0, -13.0]; //position of texsquare #2 in the scene
    scale = [10.0, 10.0, 10.0];
    model_matrix = mat4.translate(model_matrix, mat4.identity(model_matrix), vec);
    model_matrix = mat4.rotate(model_matrix, model_matrix, -3.14159 / 4.0, y_axis); //NOTE: angle in radians
    model_matrix = mat4.scale(model_matrix, model_matrix, scale);
    gl.uniformMatrix4fv(modelMatrixLoc, false, model_matrix); //send the updated model matrix to the shaders
    gl.bindTexture(gl.TEXTURE_2D, yosemiteTex); //use the yosemiteTex for this square
    drawTexSquare(gl, color, 10.0); //defined in texsquare.js

    //position and draw the third textured square with the tiger texture
    vec = [-13.0, 10.0, -13.0]; //position of texsquare #3 in the scene
    var scale = [10.0, 10.0, 10.0];
    model_matrix = mat4.translate(model_matrix, mat4.identity(model_matrix), vec);
    model_matrix = mat4.rotate(model_matrix, model_matrix, 3.14159 / 4.0, y_axis); //NOTE: angle in radians
    model_matrix = mat4.scale(model_matrix, model_matrix, scale);
    gl.uniformMatrix4fv(modelMatrixLoc, false, model_matrix); //send the updated model matrix to the shaders
    gl.bindTexture(gl.TEXTURE_2D, tigerTex); //use the tigerTex for this square
    drawTexSquare(gl, color, 10.0); //the second parameter (color) is the color of the polygon before the texture is applied
                                    //the third parameter (in this case 10.0) is the value to use for the shininess coefficient
    //TODO 4: bind your texture, and position and draw a fourth textured square with your own image as the texture 

    // *** Activate and bind uniform variables for the point_sprite_program shader ***
    changeShaderProgram(point_sprite_program, 0, projection_matrix, view_matrix, mat4.identity(model_matrix));
        //Note that the second parameter of 0 indicates that the light uniforms should NOT be bound for this shader
    samplerLoc = gl.getUniformLocation(point_sprite_program, "tex_image"); //bind samplerLoc for this shader

    gl.bindTexture(gl.TEXTURE_2D, starTex);
    gl.vertexAttrib3f(0, 0, 5.0, 0); //use a static vertex attribute (location == 0) to set the position to (0,5.0,0)
    gl.drawArrays(gl.POINTS, 0, 1); //draw one point sprite at (0,5.0,0)

    gl.bindTexture(gl.TEXTURE_2D, treeTex);
    gl.vertexAttrib3f(0, 12.0, 2.3, 12.0); //use a static vertex attribute (location == 0) to set the position to (12,2.3,12)
    gl.drawArrays(gl.POINTS, 0, 1); //draw one point sprite at (12,2.3,12)

    //TODO 5: bind your texture, then position and draw a point sprite using your own image as the texture

    //Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

//return the WebGL context to the caller
function initModel(view) {
    gl = getGLContext(view); 
    if (gl) {
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.viewport(0.0, 0.0, view.width, view.height);
        gl.enable(gl.DEPTH_TEST); //turn on the depth test

        initPrograms(); //load the shader programs

        //Define mat4
        mat4 = glMatrix.mat4;      

        //Create matrices then define the projection transformation matrix here since it never changes
        model_matrix = mat4.create();
        view_matrix = mat4.create();
        projection_matrix = mat4.create();
        projection_matrix = mat4.frustum(projection_matrix, -0.1, 0.1, -0.1, 0.1, 0.1, 50.0);

        //create buffers for all the objects we want to render and load textures we will use
        initBuffers();
        initTextures();

        //initialize movement variables
        rotY = 3.14159 / 2.0; //initial angle is PI/2 (90 degrees) which is looking down the positive z axis 
        eye.push(0.0);
        eye.push(5.0);
        eye.push(-10.0);
        aim.push(0.0);
        aim.push(0.0);
        aim.push(0.0);
        updateEye(0.1); //will sets aim to be looking down the positive z-axis

        return gl;
    }
    return null;
}

function updateEye(offset)
{
    eye[0] += Math.cos(rotY) * offset;
    eye[2] += Math.sin(rotY) * offset;

    //Adjust the aim position from the new eye position
    aim[0] = eye[0] + Math.cos(rotY);
    aim[1] = eye[1];
    aim[2] = eye[2] + Math.sin(rotY);
}

function updateRotY(offset)
{
    rotY = rotY + offset;

    //Adjust the aim position based on the new rotY
    aim[0] = eye[0] + Math.cos(rotY);
    aim[1] = eye[1];
    aim[2] = eye[2] + Math.sin(rotY);
}

function resetModel() {
    rotY = 3.14159 / 2.0;
    eye[0] = 0.0;
    eye[1] = 5.0;
    eye[2] = -10.0;
    updateRotY(0.0);
}