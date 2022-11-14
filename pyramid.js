//FileName:		pyramid.js
//Programmer:	Dan Cliburn
//Date:			9/24/2020
//Purpose:		This file defines the code for the pyramid

//This variables can be accessed in any function
let pyramidVAO, pyramidIB;

//Set up the buffer and VAO we need for rendering the ground
function initPyramid(gl)
{
    //Vertex position data for the pyramid
    const positions = [-0.5, 0.5, 1.0,  -0.5, -0.5, 1.0,  0.5, -0.5, 1.0,  0.5, 0.5, 1.0,  0.0, 0.0, 0.5];
    
    //Set up Vertex Array Object
    pyramidVAO = gl.createVertexArray(); 
    gl.bindVertexArray(pyramidVAO);

    //Set up the VBO for the pyramid vertex positions 
    var pyramidVPB = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVPB);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);  
    gl.enableVertexAttribArray(0); //vertex position will be passed to the vertex shader in location 0
    
    //Set up the IBO for the pyramid
    pyramidIB = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramidIB);

    //Clean  
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);  
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function drawPyramid(gl)
{
    //Bind the VAO for our pyramid
    gl.bindVertexArray(pyramidVAO);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, pyramidIB);

    //TODO: change the shininess coefficient
    gl.vertexAttrib1f(3, 1.0); //use a static vertex attribute (location == 3) to set shininess for all sides to 1.0

    //Draw the pyramid - side 1
    const indices1 = [0, 1, 4]; //Indices for side 1. Define in a counter-clockwise order.
    gl.vertexAttrib3f(1, 1, 0, 0); //use a static vertex attribute (location == 1) to set the color to red
    gl.vertexAttrib3f(2, -1, 0, -1); //use a static vertex attribute (location == 2) to set the normal vector
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices1), gl.DYNAMIC_DRAW);
    gl.drawElements(gl.TRIANGLES, indices1.length, gl.UNSIGNED_SHORT, 0);

    //Draw the pyramid - side 2
    const indices2 = [1, 2, 4]; //Indices for side 2. Define in a counter-clockwise order.
    gl.vertexAttrib3f(1, 0, 1, 1); //use a static vertex attribute (location == 1) to set the color to cyan
    gl.vertexAttrib3f(2, 0, -1, -1); //use a static vertex attribute (location == 2) to set the normal vector
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices2), gl.DYNAMIC_DRAW);
    gl.drawElements(gl.TRIANGLES, indices1.length, gl.UNSIGNED_SHORT, 0);

    //Draw the pyramid - side 3
    const indices3 = [2, 3, 4]; //Indices for side 3. Define in a counter-clockwise order.
    gl.vertexAttrib3f(1, 0, 0, 1); //use a static vertex attribute (location == 1) to set the color to blue
    gl.vertexAttrib3f(2, 1, 0, -1); //use a static vertex attribute (location == 2) to set the normal vector
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices3), gl.DYNAMIC_DRAW);
    gl.drawElements(gl.TRIANGLES, indices1.length, gl.UNSIGNED_SHORT, 0);

    //Draw the pyramid - side 4
    const indices4 = [3, 0, 4]; //Indices for side 4. Define in a counter-clockwise order.
    gl.vertexAttrib3f(1, 1, 1, 1); //use a static vertex attribute (location == 1) to set the color to white
    gl.vertexAttrib3f(2, 0, 1, -1); //use a static vertex attribute (location == 2) to set the normal vector
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices4), gl.DYNAMIC_DRAW);
    gl.drawElements(gl.TRIANGLES, indices1.length, gl.UNSIGNED_SHORT, 0);

    //Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}