var gl;
var points = [];
var pointColors = [];
var triangles = [];
var triangleColors = [];
var circles = [];
var circleColors = [];
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
	vCircleBuffer = gl.createBuffer();
	cCircleBuffer = gl.createBuffer();


	var clearButton = document.getElementById("ClearButton");
	clearButton.addEventListener("click", function(){
		points = [];
		pointColors = [];
		triangles = [];
		triangleColors = [];
		circles = [];
		circleColors = [];

		modeVariable = 0;

		render();
	});

	var pointsButton = document.getElementById("Points");
	pointsButton.addEventListener("click", function(){
		mode = "points";
		modeVariable = 0;
	});

	var trianglesButton = document.getElementById("Triangles");
	trianglesButton.addEventListener("click", function(){
		mode = "triangles";
		modeVariable = 0;
	});

	var circleButton = document.getElementById("Circles");
	circleButton.addEventListener("click", function(){
		mode = "circles";
		modeVariable = 0;
	});

	var colorSelection = document.getElementById("ColorSelection");
	colorSelection.addEventListener("click", function(){
		chosenColor = availableColors[colorSelection.selectedIndex];
	});

	canvas.addEventListener("click",function(){
		var x = event.target.getBoundingClientRect().left;
		var y = event.target.getBoundingClientRect().top;
		var newVertex = vec2(-1+2*(event.clientX-x)/canvas.width,
							 -1+2*(canvas.height-(event.clientY-y))/canvas.width);
		switch(mode){
			case "points":
				points.push(newVertex);
				pointColors.push(chosenColor);
				break;
			case "triangles":
				if(modeVariable < 2){
					points.push(newVertex);
					pointColors.push(chosenColor);
					modeVariable++;
				}else{
					triangles.push(points.pop(), points.pop(), newVertex);
					triangleColors.push(pointColors.pop(), pointColors.pop(), chosenColor);
					modeVariable = 0;
				}
				break;
			case "circles":
				if(modeVariable < 1){
					points.push(newVertex);
					pointColors.push(chosenColor);
					modeVariable++;
				}else{
					var center = points.pop();
					var radius = Math.sqrt(Math.pow(newVertex[0] - center[0],2)+Math.pow(newVertex[1] - center[1],2));
					circles.push(center);
					circleColors.push(pointColors.pop());
					for (i = 0; i <= 100; i++){
						circles.push(vec2(center[0] + radius*Math.cos(i*2.0*Math.PI/100), center[1] + radius*Math.sin(i*2.0*Math.PI/100)));
						circleColors.push(chosenColor);
					}
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
	gl.bindBuffer(gl.ARRAY_BUFFER, vPointBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	gl.bindBuffer(gl.ARRAY_BUFFER, cPointBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, flatten(pointColors), gl.STATIC_DRAW);

	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	gl.drawArrays(gl.POINTS, 0, points.length);

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

	//Circles
	for(i = 0; i <= circles.length % 101; i++){
		var circle = circles.slice(i * 102, i * 102 + 102);
		var circleColor = circleColors.slice(i * 102, i * 102 + 102);

		var vtCircleBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vtCircleBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(circle), gl.STATIC_DRAW);

		gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vPosition);

		var ctCircleBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, ctCircleBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, flatten(circleColor), gl.STATIC_DRAW);

		gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(vColor);

		gl.drawArrays(gl.TRIANGLE_FAN, 0, circle.length);
	}
}