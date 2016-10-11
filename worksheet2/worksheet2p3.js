var gl;
var points = [];
var pointColors = [];
var newTriangle = [];
var newTriangleColors = [];
var triangles = [];
var triangleColors = [];
var availableColors = [
		vec4(0.0, 0.0, 0.0, 1.0),
		vec4(1.0, 0.0, 0.0, 1.0),
		vec4(1.0, 1.0, 0.0, 1.0),
		vec4(0.0, 1.0, 0.0, 1.0),
		vec4(0.0, 0.0, 1.0, 1.0),
		vec4(1.0, 0.0, 1.0, 1.0),
		vec4(0.0, 1.0, 1.0, 1.0),
	];
var chosenColor = vec4(0.0, 0.0, 0.0, 1.0);
var mode = "points";
var modeVariable = 0;

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
	
	vPointBuffer = gl.createBuffer();
	cPointBuffer = gl.createBuffer();
	vTriangleBuffer = gl.createBuffer();
	cTriangleBuffer = gl.createBuffer();


	var clearButton = document.getElementById("ClearButton");
	clearButton.addEventListener("click", function(){
		points = [];
		pointColors = [];
		triangles = [];
		triangleColors = [];
		newTriangle = [];
		newTriangleColors = [];

		modeVariable = 0;

		render();
	});

	var pointsButton = document.getElementById("Points");
	pointsButton.addEventListener("click", function(){
		mode = "points";
		modeVariable = 0;
	});

	var triangleButton = document.getElementById("Triangles");
	triangleButton.addEventListener("click", function(){
		mode = "triangles";
		modeVariable = 0;
	});

	var colorSelection = document.getElementById("ColorSelection");
	colorSelection.addEventListener("click", function(){
		chosenColor = availableColors[colorSelection.selectedIndex];
	});

	canvas.addEventListener("click",function(){
		switch(mode){
			case "points":
				var x = event.target.getBoundingClientRect().left;
				var y = event.target.getBoundingClientRect().top;
				points.push(vec2(-1+2*(event.clientX-x)/canvas.width,
							 -1+2*(canvas.height-(event.clientY-y))/canvas.width));
				pointColors.push(chosenColor);
				break;
			case "triangles":
				var x = event.target.getBoundingClientRect().left;
				var y = event.target.getBoundingClientRect().top;
				if(modeVariable < 2){
					points.push(vec2(-1+2*(event.clientX-x)/canvas.width,
							 -1+2*(canvas.height-(event.clientY-y))/canvas.width));
					pointColors.push(chosenColor);
					modeVariable++;
				}else{
					triangles.push(points.pop(), points.pop(), vec2(-1+2*(event.clientX-x)/canvas.width,
							 -1+2*(canvas.height-(event.clientY-y))/canvas.width));
					triangleColors.push(pointColors.pop(), pointColors.pop(), chosenColor);
					modeVariable = 0;
				}
				break;
		}
		render();
	})

	render();
}

function render(){
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	var vColor = gl.getAttribLocation(program, "vColor");

	//Points
	var allPoints = newTriangle.concat(points);

	gl.bindBuffer(gl.ARRAY_BUFFER, vPointBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(allPoints), gl.STATIC_DRAW);

	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	gl.bindBuffer(gl.ARRAY_BUFFER, cPointBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(pointColors), gl.STATIC_DRAW);

	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	gl.drawArrays(gl.POINTS, 0, allPoints.length);

	//Triangles
	gl.bindBuffer(gl.ARRAY_BUFFER, vTriangleBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(triangles), gl.STATIC_DRAW);

	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	gl.bindBuffer(gl.ARRAY_BUFFER, cTriangleBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(triangleColors), gl.STATIC_DRAW);

	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	gl.drawArrays(gl.TRIANGLES, 0, triangles.length);
}