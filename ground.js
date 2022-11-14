//FileName:		ground.js
//Programmer:	Dan Cliburn
//Date:			9/24/2020
//Purpose:		This file defines the code for our colored background model

//These variables can be accessed in any function
let groundVAO;

//Set up the buffer and VAO we need for rendering the ground
function initGround(gl) {
    //Vertex position data for the ground
    const positions = [-20.0, 0.0, -20.0,   //base
                        -20.0, 0.0, 20.0,
                        20.0, 0.0, -20.0,
                        20.0, 0.0, 20.0,
                        -20.0, 20.0, -20.0, //back
                        -20.0, 0.0, -20.0,
                        20.0, 20.0, -20.0,
                        20.0, 0.0, -20.0,
                        20.0, 20.0, 20.0, //front
                        20.0, 0.0, 20.0,
                        -20.0, 20.0, 20.0,
                        -20.0, 0.0, 20.0,
                        20.0, 20.0, -20.0, //right
                        20.0, 0.0, -20.0,
                        20.0, 20.0, 20.0,
                        20.0, 0.0, 20.0,
                        -20.0, 20.0, 20.0, //left
                        -20.0, 0.0, 20.0,
                        -20.0, 20.0, -20.0,
                        -20.0, 0.0, -20.0,
    ];

    //Set up Vertex Array Object for the ground
    groundVAO = gl.createVertexArray();
    gl.bindVertexArray(groundVAO);

    //Set up the VBO for the vertex positions 
    var vertexPB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPB);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0

    //Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}


//We call drawGround to render the background model
function drawGround(gl) 
{  
    //bind the VAO for the ground
    gl.bindVertexArray(groundVAO);

    gl.vertexAttrib3f(1, 0, 1, 0); //use a static vertex attribute (location == 1) to set the color to green
    gl.vertexAttrib3f(2, 0, 1, 0); //use a static vertex attribute (location == 2) to set the normal vector
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); //floor
    gl.vertexAttrib3f(1, 0, 0, 1); //use a static vertex attribute (location == 1) to set the color to blue
    gl.vertexAttrib3f(2, 0, 0, 1); //use a static vertex attribute (location == 2) to set the normal vector
    gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4); //back
    gl.vertexAttrib3f(1, 0, 0, 1); //use a static vertex attribute (location == 1) to set the color to blue
    gl.vertexAttrib3f(2, 0, 0, -1); //use a static vertex attribute (location == 2) to set the normal vector
    gl.drawArrays(gl.TRIANGLE_STRIP, 8, 4); //front
    gl.vertexAttrib3f(1, 1, 0, 0); //use a static vertex attribute (location == 1) to set the color to red
    gl.vertexAttrib3f(2, -1, 0, 0); //use a static vertex attribute (location == 2) to set the normal vector
    gl.drawArrays(gl.TRIANGLE_STRIP, 12, 4); //right
    gl.vertexAttrib3f(1, 1, 0, 0); //use a static vertex attribute (location == 1) to set the color to red
    gl.vertexAttrib3f(2, 1, 0, 0); //use a static vertex attribute (location == 2) to set the normal vector
    gl.drawArrays(gl.TRIANGLE_STRIP, 16, 4); //left

    //Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
}