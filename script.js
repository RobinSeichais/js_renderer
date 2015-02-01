// GLOBAL VAR
var cv;

var cam;
var light	

var width;
var height;

var object = [];

var background_color;

// CLASSES
function vec(x, y, z){

	this.x = x;
	this.y = y;
	this.z = z;
}

function Sphere(x, y, z, r){

	// constructor
	this._x = x;
	this._y = y;
	this._z = z;
	this._r = r;
	this.R = 100;
	this.G = 100;
	this.B = 100;
	this.name = "Sphere";
}

Sphere.prototype.intersect = function(u){

	var BA = new vec(this._x - cam.x, this._y - cam.y, this._z - cam.z);
	var prod = cross_product(BA, u);
	var d = norm(prod)/norm(u);
	
	if(d <= this._r){
		
		var a = u.x*u.x + u.y*u.y + u.z*u.z;
		var b = 2*(u.x*(cam.x - this._x) + u.y*(cam.y - this._y) + u.z*(cam.z - this._z));
		var c = this._x*this._x + this._y*this._y + this._z*this._z + cam.x*cam.x + cam.y*cam.y + cam.z*cam.z - 2*(this._x*cam.x + this._y*cam.y + this._z*cam.z) - this._r*this._r;
		
		var D = b*b - 4*a*c;
		var tmp = Math.sqrt(D);
		var t1 = (-b - Math.sqrt(D))/(2*a);
		var t2 = (-b + Math.sqrt(D))/(2*a);
		
		if(cam.z + t1*u.z <= cam.z + t2*u.z){
			
			var N = new vec(cam.x + t1*u.x - this._x, cam.y + t1*u.y - this._y, cam.z + t1*u.z - this._z);
			var L = new vec(light.x - (cam.x + t1*u.x), light.y - (cam.y + t1*u.y), light.z - (cam.z + t1*u.z));
		}
		else{
		
			var N = new vec(cam.x + t2*u.x - this._x, cam.y + t2*u.y - this._y, cam.z + t2*u.z - this._z);
			var L = new vec(light.x - (cam.x + t2*u.x), light.y - (cam.y + t2*u.y), light.z - (cam.z + t2*u.z));
		}
		
		var nN = norm(N);
		var nL = norm(L);
		N.x = N.x/nN;
		N.y = N.y/nN;
		N.z = N.z/nN;
		L.x = L.x/nL;
		L.y = L.y/nL;
		L.z = L.z/nL;
		
		var res = N.x*L.x + N.y*L.y + N.z*L.z;
		
		return res;
		
	}
	return -1;
}
Sphere.prototype.set_color = function(r, g, b){

	this.R = r;
	this.G = g;
	this.B = b;
}

// FUNCTIONS
function init(){

	var canvas = document.getElementById("cvs");
	cv = canvas.getContext("2d");
	
	cam = new vec(0, 0, -100);
	light = new vec(-10, 10, 0);
	width = canvas.width;
	height = canvas.height;

	var S  = new Sphere(0, 0, 30, 20);
	object.push(S);
	background_color = new vec(230,230, 230);
	console.log(width);
	console.log(height);
	
	if(cv){
		console.log("Initialized");
	}
	
	render();
}

function render(){
	
	var imageData = cv.createImageData(width, height);
	var i = 0;
	var u = new vec(0, 0, 0);
	var z_test;
	var r, g, b;
	var O;
 
	for(var y = -height/2; y <= height/2 -1; y++){
	for(var x = -width/2; x <= width/2 -1; x++){
		
		z_test = 9999;

		u.x = x/10 - cam.x;
		u.y = y/10 - cam.y;
		u.z = 0 - cam.z;
		
		for(var j = 0; j < object.length; j++){
			
			O = object[j];
			
			var n = O.intersect(u);
			
			if(n != -1){
				
				r = Math.floor(O.R*(1+n));
				g = Math.floor(O.G*(1+n));
				b = Math.floor(O.B*(1+n));
				z_test = 0;
			}
		}
		

		if(z_test == 9999){
			r = background_color.x;
			g = background_color.y;
			b = background_color.z;
		}
		
		imageData.data[i] = r;
		imageData.data[i+1] = g;
		imageData.data[i+2] = b;
		imageData.data[i+3] = 255;
		
		i += 4;
		
	}}
	
	cv.putImageData(imageData, 0, 0);
}

function input_handler(event){

	if(event.keyCode == 37)
		object[0]._x -= 10;
	if(event.keyCode == 39)
		object[0]._x += 10;
	if(event.keyCode == 38)
		object[0]._y -= 10;
	if(event.keyCode == 40)
		object[0]._y += 10;
		
	render();
}


// EVENTS
window.onload = init;
document.onkeydown = input_handler;