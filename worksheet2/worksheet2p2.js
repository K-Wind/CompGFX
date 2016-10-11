var gl;
var points = [];
var pointColors = [];
var availableColors = [
		vec4(0.0, 0.0, 0.0, 1.0),
		vec4(1.0, 0.0, 0.0, 1.0),
		vec4(1.0, 1.0, 0.0, 1.0),
		vec4(0.0, 1.0, 0.0, 1.0),
		vec4(0.0, 0.0, 1.0, 1.0),
		vec4(1.0, 0.0, 1.0, 1.0),
		vec4(0.0, 1.0, 1.0, 1.0),
	];
var chosenColor;

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
	
	vBuffer = gl.createBuffer();
	cBuffer = gl.createBuffer();

	var clearButton = document.getElementById("ClearButton");
	clearButton.addEventListener("click", function(){
		points = [];
		pointColors = [];

		render();
	});

	var colorSelection = document.getElementById("ColorSelection");
	colorSelection.addEventListener("click", function(){
		chosenColor = availableColors[colorSelection.selectedIndex];
	});

	index = 0;
	canvas.addEventListener("click",function(){
		var x = event.target.getBoundingClientRect().left;
		var y = event.target.getBoundingClientRect().top;
		points.push(vec2(-1+2*(event.clientX-x)/canvas.width,
					 -1+2*(canvas.height-(event.clientY-y))/canvas.width));
		pointColors.push(chosenColor);
		index++;
		render();
	})

	render();
}

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(pointColors), gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	gl.drawArrays(gl.POINTS, 0, points.length);

	//window.requestAnimFrame(render, canvas);
}