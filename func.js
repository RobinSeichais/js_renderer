function cross_product(u, v){

	var v = new vec(u.y*v.z - u.z*v.y, u.z*v.x - u.x*v.z, u.x*v.y - u.y*v.x);
	return v;
}

function norm(v){

	var n = v.x*v.x + v.y*v.y + v.z*v.z;
	return Math.sqrt(n);
}