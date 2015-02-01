// COLOR
function colour(r, g, b){

	this.r = r;
	this.g = g;
	this.b = b;	
}

// VECTOR
function vec(x, y, z){

	this.x = x;
	this.y = y;
	this.z = z;
}
vec.prototype.normalize() = function()

	var n = vec_norm(this);
	this.x = this.x/n;
	this.y = this.y/n;
	this.z = this.z/n;
}

// COLLISION
function coll(c, v){

	this.c = c;
	this.z = z;
}

// Functions on vectors
function vec_cross_product(u, v){

	var v = new vec(u.y*v.z - u.z*v.y, u.z*v.x - u.x*v.z, u.x*v.y - u.y*v.x);
	return v;
}
function vec_norm(v){

	var n = v.x*v.x + v.y*v.y + v.z*v.z;
	return Math.sqrt(n);
}
function vec_dot_product(u, v){

	var v = u.x*v.x + u.y*v.y + u.z*v.z;
	return v;
}

// 3D SCENE
function Scene(){

	this.canvas;
	this.width;
	this.heigth;
	
	this.focal_length = 100;
	this.max_depth = 9999;
	
	this.lights = [];
	this.objects = [];
	
	this.background_colour = new colour(230, 230, 230);
}
Scene.prototype.set_canvas = function(c){

	this.width = c.width;
	this.height = c.height;
	this.canvas = c.getContext("2d");
}
Scene.prototype.change_focal_length = function(f){

	this.focal_length = f;
}
Scene.prototype.add_light = function(p){

	this.lights.push(p);
}
Scene.prototype.add_object = function(o){

	this.objects.push(o);
}
Scene.prototype.change_background_colour = function(r, g, b){

	this.background_colour = new colour(r, g, b);
}
Scene.prototype.render = function(){

	var image_data = cv.createImageData(width, height);
	var index_data = 0;
	
	var u = new vec(0, 0, 0);
	var z_test, z;
	var col = this.background_colour;
	var Obj;
	var V = new vec(0, 0, 0);
	var res;
	
	for(var y = -height/2; y <= height/2 -1; y++){
	for(var x = -width/2; x <= width/2 -1; x++){
		
		z_test = this.max_depth;

		V.x = x/10;
		V.y = y/10;
		V.z = this.focal_length;
		
		for(var j = 0; j < this.objects.length; j++){
		
			Obj = this.objects[j];
			res = O.intersect(V);
			
			if(res.z < z_test || res.z < 0){
				z_test = res.z;
				col = res.c;
			}
		}
		
		image_data.data[i] = col.r;
		image_data.data[i+1] = col.g;
		image_data.data[i+2] = col.b;
		image_data.data[i+3] = 255;
		
		i += 4;
	
	}}
	
	cv.putImageData(imageData, 0, 0);
}

// OBJECTS
function Sphere(x, y, z, r){

	// constructor
	this.x = x;
	this.y = y;
	this.z = z;
	this.r = r;
	this.col = new colour(100, 100, 100);
}
Sphere.prototype.intersect = function(V, lights){

	var BA = new vec(this.x, this.y, this.z - V.z);
	var prod = vec_cross_product(BA, V);
	var d = vec_norm(prod)/vec_norm(V);
	
	var res = new coll(this.col, -1);
	
	if(d <= this.r){
	
		var a = u.x*u.x + u.y*u.y + u.z*u.z;
		var b = -2*(u.x*this.x + u.y*this.y + u.z*(V.z + this.z));
		var c = this.x*this.x + this.y*this.y + this.z*this.z + V.z*V.z + 2*(this.z*V.z) - this.r*this.r;
		
		var D = b*b - 4*a*c;
		var t1 = (-b - Math.sqrt(D))/(2*a);
		var t2 = (-b + Math.sqrt(D))/(2*a);
		
		if(t1 <= t2){
			
			var N = new vec(t1*V.x - this.x, t1*V.y - this.y, (t1 - 1)*V.z - this.z);
			var L = new vec(lights[0].x - t1*V.x, lights[0].y - t1*V.y, lights[0].z + V.z*(1 - t1));
			res.z = (t1 - 1)*V.z;
		}
		else{
		
			var N = new vec(t2*V.x - this.x, t2*V.y - this.y, (t2 - 1)*V.z - this.z);
			var L = new vec(lights[0].x - t2*V.x, lights[0].y - t2*V.y, lights[0].z + V.z*(1 - t2));
			res.z = (t2 - 1)*V.z;
		}
		
		N.normalize();
		L.normalize();
		
		var k = vec_dot_product(N, L);
		
		res.c = new colour(this.col.r * (1+k), this.col.b * (1+k), this.col.b * (1+k));
	}
	else{
		res.z = -1;
	}
	
	return res;
}
Sphere.prototype.change_colour = function(r, g, b){

	this.col = new colour(r, g, b);
}