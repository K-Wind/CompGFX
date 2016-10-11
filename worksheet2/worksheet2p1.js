var gl;
var points = [];
var triangles = [];
var circles = [];

window.onload = function init(){
	canvas = document.getElementById("gl-canvas");

	//gl = WebGLUtils.setupWebGL(canvas);
	gl = canvas.getContext('webgl');

	if(!gl){
		alert("WebGL is not available");
		return;
	}

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);

	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	index = 0;
	canvas.addEventListener("click",function(){
		gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
		var x = event.target.getBoundingClientRect().left;
		var y = event.target.getBoundingClientRect().top;
		points.push(vec2(-1+2*(event.clientX-x)/canvas.width,
					 -1+2*(canvas.height-(event.clientY-y))/canvas.width));
		gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);
		index++;
	})

	render();
}

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawArrays(gl.POINTS, 0, points.length);

	window.requestAnimFrame(render, canvas);
}