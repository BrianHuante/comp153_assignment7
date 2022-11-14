//FileName:		cube.js
//Programmer:	Dan Cliburn
//Date:			9/22/2020
//Purpose:		This file defines the code for our colored cube model

//These variables can be accessed in any function
let cubeVAO, left_face, top_face, bottom_face;

//Set up the buffers and VAO we need for rendering the objects for our scene
function initCube(gl)
{
    //Vertex position data for the cube
    const positions = [ -1.0, 1.0, 1.0,     //top left of front face
                        -1.0, -1.0, 1.0,    //bottom left of front face
                        1.0, 1.0, 1.0,      //top right of front face
                        1.0, -1.0, 1.0,     //bottom right of front face
                        1.0, 1.0, -1.0,
                        1.0, -1.0, -1.0,
                        -1.0, 1.0, -1.0,
                        -1.0, -1.0, -1.0 ];
    const left_indices = [6, 7, 0, 1];
    const top_indices = [6, 0, 4, 2];
    const bottom_indices = [1, 7, 3, 5];
    
    //Set up Vertex Array Object
    cubeVAO = gl.createVertexArray(); 
    gl.bindVertexArray(cubeVAO);

    //Set up the VBO for the vertex positions 
    var vertexPB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPB);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0

    //Set up the IBO for left side of the cube
    left_face = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, left_face);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(left_indices), gl.STATIC_DRAW);

    //Set up the IBO for top of the cube
    top_face = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, top_face);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(top_indices), gl.STATIC_DRAW);

    //Set up the IBO for bottom of the cube
    bottom_face = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bottom_face);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(bottom_indices), gl.STATIC_DRAW);

    //Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}


//We call drawcube to render the cube
function drawCube(gl) 
{  
    //bind the VAO for the cube
    gl.bindVertexArray(cubeVAO);

    //draw the front face pink
    gl.vertexAttrib3f(1, 1, 0, 1); //use a static vertex attribute (location == 1) to set the color to white
    gl.vertexAttrib3f(2, 0, 0, 1); //use a static vertex attribute (location == 2) to set the normal vector
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    
    //draw the right face green
    gl.vertexAttrib3f(1, 0, 1, 0); //use a static vertex attribute (location == 1) to set the color to green
    gl.vertexAttrib3f(2, 1, 0, 0);  //use a static vertex attribute (location == 2) to set the normal vector
    gl.drawArrays(gl.TRIANGLE_STRIP, 2, 4);

    //draw the back face blue
    gl.vertexAttrib3f(1, 0, 0, 1); //use a static vertex attribute (location == 1) to set the color to blue
    gl.vertexAttrib3f(2, 0, 0, -1);  //use a static vertex attribute (location == 2) to set the normal vector
    gl.drawArrays(gl.TRIANGLE_STRIP, 4, 4);

    //draw the left face red
    gl.vertexAttrib3f(1, 1.0, 0.0, 0.0); //use a static vertex attribute (location == 1) to set the color to red
    gl.vertexAttrib3f(2, -1, 0, 0);  //use a static vertex attribute (location == 2) to set the normal vector
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, left_face);
    gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0); //use index rendering to draw the left face

    //draw the top face cyan
    gl.vertexAttrib3f(1, 0.0, 1.0, 1.0); //use a static vertex attribute (location == 1) to set the color to cyan
    gl.vertexAttrib3f(2, 0, 1, 0);  //use a static vertex attribute (location == 2) to set the normal vector
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, top_face);
    gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0); //use index rendering to draw the left face

    //draw the bottom face yellow
    gl.vertexAttrib3f(1, 1.0, 1.0, 0.0); //use a static vertex attribute (location == 1) to set the color to cyan
    gl.vertexAttrib3f(2, 0, -1, 0);  //use a static vertex attribute (location == 2) to set the normal vector
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, bottom_face);
    gl.drawElements(gl.TRIANGLE_STRIP, 4, gl.UNSIGNED_SHORT, 0); //use index rendering to draw the left face

    //Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}