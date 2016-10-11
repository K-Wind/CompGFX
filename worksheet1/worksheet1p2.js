var gl;
var vertices;

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

	var buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	vertices = [
	vec2(0.0, 0.0),
	vec2(1.0, 0.0), 
	vec2(1.0, 1.0),
	];

	gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);


	render();



}

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawArrays(gl.POINTS, 0, vertices.length);
}