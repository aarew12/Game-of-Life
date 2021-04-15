//global variables
var size = 20;
var height = 700;  //you can change it, if canvas on your device is too big or too small
var cellSize = Math.floor(height/size); //calculate 
var grid = create2DArray(size, size);
var steps;

function setSize(){ //change grid size
	size = document.getElementById("size").value; 
	cellSize = Math.floor(height/size);
	grid = create2DArray(size, size);
	draw();
}
function draw() {  //draw gray squares if cell is dead and red if cell is alive
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
	ctx.fillStyle = 'rgba(255, 255, 255)';
	ctx.fillRect(0,0,height,height);
	for (let i=0;i<size;i++) {
		for (let j=0;j<size;j++) {
			if (grid[i][j] == 0)
				ctx.fillStyle = 'rgba(200, 200, 200)';
			else
				ctx.fillStyle = 'rgba(200, 0, 0)';
			ctx.fillRect(i*cellSize, j*cellSize, cellSize * 0.9, cellSize * 0.9);
		}
    }
}
	
function clickCanvas(){ // handle clicking on cells
    var ctx = canvas.getContext('2d');
	var x = Math.floor(event.offsetX/cellSize);
    var y = Math.floor(event.offsetY/cellSize);
    console.log("x coords: " + x + ", y coords: " + y);
	grid[x][y] = 1-grid[x][y]; //make dead cell alive and vice versa
    draw();
}

function create2DArray(rows, cols) {  //create 2D array with zeros
  var arr = [];
  for (let i=0;i<rows;i++) {
	 arr[i] = [];
     for (let j=0;j<cols;j++) {
     arr[i][j] = 0; 
	}
  }
  return arr;
}

function copy2DArray(oldArr) {  //copy array by value (needed because JS copy variables and object by reference)
  var arr = [];
  var rows = oldArr.length;
  var cols = oldArr[0].length;
  for (let i=0;i<rows;i++) {
	 arr[i] = [];
     for (let j=0;j<cols;j++) {
     arr[i][j] = oldArr[i][j]; 
	}
  }
  return arr;
}

function neighboursNumber(x, y) {  //returns number of neighbours of cell with coors [x][y] 
  var arr = [];
  var neighbours = 0;
  for (let i=-1;i<=1;i++) {
     for (let j=-1;j<=1;j++) {
		neighbours += (i!=0 || j!=0) && i+x>=0 && j+y>=0 && i+x<size && j+y<size && grid[x+i][y+j]; 
	}
  }
  return neighbours;
}

function step() {  //do one step
  var newGrid = create2DArray(size, size);
  for (let i=0;i<size;i++) {
    for (let j=0;j<size;j++) {
		let neighbours = neighboursNumber(i, j);
		newGrid[i][j] = (!!(grid[i][j]) && neighbours == 2) || neighbours == 3 ? 1 : 0;
	}
  }

  grid = copy2DArray(newGrid);
  draw();
}

function makeSteps(){ 
	var delay = document.getElementById("delay").value; 
	steps = setInterval(step, delay); //doing constantly function step with period delay
}

function stopSteps(){
	clearInterval(steps) //disable constantly steps
}

function loadCSV(){
	var file = document.getElementById('input').files[0];
	var reader = new FileReader();
	reader.readAsText(file);
    reader.onload = function(e) {  //onload because reader works asynchronic
		var textCSV = reader.result;
		var array = csvToIntArray(textCSV);
		grid = copy2DArray(array);
		size = grid[0].length;
		cellSize = Math.floor(height/size);
		draw();
    };
}

function csvToArray (csv) {  //map CSV file to 2D string array
    var rows = csv.split("\n");
    return rows.map(function (row) {
    	return row.split(",");
    });
};

function csvToIntArray (csv) { //map CSV file to 2D int array
    var arr = csvToArray (csv);
	var intArr = [];
	var rows = arr.length;
	var cols = arr[0].length;
	for (let i=0;i<rows;i++) {
		intArr[i] = [];
		for (let j=0;j<cols;j++) {
			intArr[i][j] = parseInt(arr[i][j]); 
		}
	};
	return intArr;
}
