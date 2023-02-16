let img;
function preload() {
  img = loadImage('daisy-square.jpg');
}

class Wave {
	constructor (img,cx,cy,imgw,imgh,amplitute){
		this.img = img;
		this.x = cx;
		this.y = cy;
		this.w = imgw;
		this.h = imgh;
		this.unit = 1; // pixels grouped together
		this.amp = amplitute;
		this.wavelength = 300; // #units
		this.tx = (x) => (Math.PI*x/this.unit)/(this.wavelength);
		this.ty = (y) => (Math.PI*y/this.unit)/(this.wavelength);
		this.f = (x,y) => Math.sin(this.tx(x))*Math.sin(this.ty(y));
		this.unitcol = this.readImg();
	}
	
	takePosition(cx,cy,imgw,imgh){
		this.x = cx;
		this.y = cy;
		this.w = imgw;
		this.h = imgh;
	}
	
	readImg() {
		let pix = [];
		let a = [];
		for (var y=0; y<this.img.height; y+=1){
			pix.push([]);
			for (var x=0; x<this.img.width; x+=1){
				pix[y].push(img.get(x,y));
			}
		}
		// console.log(pix.length);
		// console.log(pix[0].length);
		for (var yunit=0; yunit<(pix.length/this.unit)-1; yunit+=1){//(this.h/this.unit)-1
			a.push([]);
			for (var xunit=0; xunit<(pix[xunit*this.unit].length/this.unit)-1; xunit+=1){
				let sumr = 0;
				let sumg = 0;
				let sumb = 0;
				for (var y=0; y<this.unit; y+=1){
					// console.log(pix[yunit*this.unit+y])
					for (var x=0; x<this.unit; x+=1){
						// if (xunit*this.unit+x<pix[yunit*this.unit+y]){
							// console.log(yunit,xunit,y,x,yunit*this.unit+y,xunit*this.unit+x)
							let pixcol = pix[yunit*this.unit+y][xunit*this.unit+x];
							sumr += pixcol[0];
							sumg += pixcol[1];
							sumb += pixcol[2];
						// }
					}
				}
				a[yunit].push([sumr,sumg,sumb].map((x)=>x/(this.unit*this.unit)));
			}
		}
		return a;
	}
	
	render(){
		let weight;
		let size;
		let adjx;
		let adjy;
		let pos = [];
		for (var y=0; y<this.unitcol.length; y+=1){
			pos.push([]);
			for (var x=0; x<this.unitcol[y].length; x+=1){
				weight = this.f(x*this.unit,y*this.unit);
				size = this.unit*(3+weight)/3;
				if (y>0){
					adjy = pos[y-1][x][1]+pos[y-1][x][2];
					if (x>0) adjx = pos[y][x-1][0]+pos[y][x-1][2];
					else adjx = 0;
				} else {
					adjy = 0;
					if (x>0) adjx = pos[y][x-1][0]+pos[y][x-1][2];
					else adjx = 0;
				}
				// console.log(x,y,adjx,adjy)
				pos[y].push([adjx,adjy,size]);
			}
		}
		return pos;
	}
	
	draw() {
		push();
		let smallerscale = Math.min(this.w/this.img.width,this.h/this.img.height);
		translate(this.x-smallerscale*this.img.width/2,this.y-smallerscale*this.img.height/2);
		scale(smallerscale)
		noStroke();
		let pos = this.render();
		console.log(pos);
		for (var y=0; y<this.unitcol.length; y+=1){
			for (var x=0; x<this.unitcol[y].length; x+=1){
				fill(this.unitcol[y][x][0],this.unitcol[y][x][1],this.unitcol[y][x][2]);//
				rect(pos[y][x][0],pos[y][x][1],pos[y][x][2]*1.2,pos[y][x][2]*1.2);
			}
		}
		pop();
	}
}

function setup() {
	W = window.innerWidth;
	H = window.innerHeight;
	canvas = createCanvas(W, H);
	background(34,33,31);
	wave = new Wave(img,int(W/2),int(H/2),int(4*W/5),int(4*H/5));
	wave.draw();
}

window.onresize = function() {
	resizeCanvas(windowWidth, windowHeight);
	W = windowWidth;
	H = windowHeight;
	background(34,33,31);
	wave.takePosition(int(W/2),int(H/2),int(4*W/5),int(4*H/5));
	wave.draw();
};
