var gl;
var vertices;
var theta = 0.0;
var thetaLoc;

window.onload = function init(){
	canvas = document.getElementById("gl-canvas");

	gl = WebGLUtils.setupWebGL(canvas);

	if(!gl){
		alert("WebGL is not available");
		return;
	}

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.clearColor(0.3921, 0.5843, 0.9294, 1.0);

	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	vertices = [
	vec2(0.0, -0.5),
	vec2(-0.5, 0.0),
	vec2(0.5, 0.0),
	vec2(0.0, 0.5)
	];

	var vBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	thetaLoc = gl.getUniformLocation(program, "theta");
	gl.uniform1f(thetaLoc, theta);

	setInterval(render(), 16);
}

function render(){
	setTimeout(function() {
		requestAnimFrame(render);
		gl.clear(gl.COLOR_BUFFER_BIT);
		theta += 0.1;
		gl.uniform1f(thetaLoc, theta);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length);
	}, 60);
}