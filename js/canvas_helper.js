/*jslint es6*/
/*
    MIT License

    Copyright (c) 2017 Vic

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
 */

let canvas;
let mouseX = 0;
let mouseY = 0;
let frameRate = 60;
let frameCount = 0;
let looping = false;
let shouldLoop = true;
let center = {x: 0, y: 0};
const Global = {Vector: {}, Color: {}};

function load() {
    setup();

    setTimeout(() => {
        if (shouldLoop){
            loop();
        }
        else {
            console.log("Loop prevented");
        }
    }, 100);
}

function loop() {
    function l() {
        if (looping) {
            draw();
            frameCount++;
            requestAnimationFrame(l);
        }
    }
    if ((typeof draw).toLowerCase() == "function") {
        looping = true;
        requestAnimationFrame(l);
    }
}

function noLoop() {
    looping = false;
}

function preventLoop() {
    looping = false;
    shouldLoop = false;
}

function mouse(evt) {
    mouseX = evt.x;
    mouseY = evt.y;
}

class Canvas {
    constructor(canvas, w, h) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.origionalWidthAndHeight = {w: w, h: h};

        this.backgroundColor = "#616161";

        if (w === "" || w === null) {
            w = "auto";
        }

        if (h === "" || h === null) {
            h = 200;
        }

        this.width = w;
        this.height = h;

        this.resize(w, h);

        // this.canvas.addEventListener("mousemove", mouse);
    }

    resize(w, h) {
        h = (h == "auto" || h === null || h === "") ? window.innerHeight : h;
        w = (w == "auto" || w === null || w === "") ? document.body.clientWidth : w; // window.innerWidth

        this.width = w;
        this.height = h;
        this.canvas.width = w;
        this.canvas.height = h;

        center.x = this.width / 2;
        center.y = this.height / 2;

        return this;
    }

    frameRate(frameRate_) {
        noLoop();
        frameRate = frameRate_;
        loop();
    }

    translate(x, y) {
        this.ctx.translate(x, y);
        return this;
    }

    filter(filterName, amount) {
        if (filterName == "none")
            this.ctx.filter = "none";
        else
            this.ctx.filter = filterName + amount;

        return this;
    }

    point(x, y, color) {
        return this.circle(x, y, 2, color, true);
    }

    circle(x, y, r, color, fill) {
        if (!color) {
            color = "rgb(255, 255, 255)";
        }

        if ((typeof color).toLowerCase() == "object") {
            this.ctx.fillStyle = color.color;
            this.ctx.strokeStyle = color.color;
        } else {
            this.ctx.fillStyle = color;
            this.ctx.strokeStyle = color;
        }

        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);

        if (fill) this.ctx.fill();
        else this.ctx.stroke();

        return this;
    }

    arc(x, y, r, deg, color, strokeWidth) {
        if (!color) {
            color = "rgb(0, 0, 255)";
        }

        if ((typeof color).toLowerCase() == "object") {
            this.ctx.strokeStyle = color.color;
        } else {
            this.ctx.strokeStyle = color;
        }

        this.ctx.beginPath();
        this.ctx.lineWidth = strokeWidth;
        this.ctx.arc(x, y, r, 1.5 * Math.PI, Math.toRadians(deg) - 1.5);
        this.ctx.stroke();
        return this;
    }

    arcTo(x, y, x2, y2, color, strokeWidth) {
        const r = x2 - x;

        if (!color) {
            color = "rgb(0, 0, 255)";
        }

        if ((typeof color).toLowerCase() == "object") {
            this.ctx.strokeStyle = color.color;
        } else {
            this.ctx.strokeStyle = color;
        }

        this.ctx.beginPath();
        this.ctx.lineWidth = strokeWidth;
        console.log(x, y, r / 4, Math.PI, 2 * Math.PI);
        this.ctx.arc(x, y, r / 4, Math.PI, 2 * Math.PI);
        this.ctx.stroke();
        return this;
    }

    line(x, y, x2, y2, strokeWidth, color) {
        if (!color) {
            color = "rgb(0, 0, 255)";
        }

        if ((typeof color).toLowerCase() == "object") {
            this.ctx.strokeStyle = color.color;
        } else {
            this.ctx.strokeStyle = color;
        }

        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = strokeWidth;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        return this;
    }

    square(x, y, r, color, center) {
        if (center) {
            x = x - r / 2;
            y = y - r / 2;
        }

        this.rect(x, y, r, r, color);
        return this;
    }

    text(text, x, y, color, size, textAlign) {
        if (!color) {
            color = "rgb(255, 255, 255)";
        }

        if (size)
            this.ctx.font = size + "px sans-serif";
        else this.ctx.font = "10px sans-serif";

        if (!textAlign || (typeof textAlign).toLowerCase() != "string")
            this.ctx.textAlign = "center";
        else this.ctx.textAlign = textAlign;

        if ((typeof color).toLowerCase() == "object") {
            this.ctx.fillStyle = color.color;
        } else {
            this.ctx.fillStyle = color;
        }

        this.ctx.fillText(text, x, y);
        return this;
    }

    rect(x, y, w, h, color) {
        if (!color) {
            color = "rgb(255, 0, 0)";
        }

        if ((typeof color).toLowerCase() == "object") {
            this.ctx.fillStyle = color.color;
        } else {
            this.ctx.fillStyle = color;
        }

        this.ctx.fillRect(x, y, w, h);
        return this;
    }

    box(x, y, size, color) {
        return this.rect(x, y, size, size, color);
    }

    triangle(x, y, size, color, fill) {
        const points = [-size + x, size / (10 / 6) + y, size + x, size / (10 / 6) + y, 0 + x, -size + y];

        for (let i = 0; i < points.length; i += 2) {
            this.point(points[i], points[i + 1]);
        }

        if (fill) this.fillShape(points, color);
        else this.polygon(points, color);
    }

    polygon(points, color) {
        // Allow vectors to be passed

        if (!color) {
            color = "rgb(0, 0, 255)";
        }

        if ((typeof color).toLowerCase() == "object") {
            this.ctx.strokeStyle = color.color;
        } else {
            this.ctx.strokeStyle = color;
        }

        this.ctx.strokeStyle = color;

        for (let i = 0; i < points.length - 2; i += 2) {
            this.point(points[i], points[i + 1], color);
            this.point(points[i + 2], points[i + 3], color);
            this.line(points[i], points[i + 1], points[i + 2], points[i + 3], 1, color);
        }

        this.line(points[0], points[1], points[points.length - 2], points[points.length - 1], 1, color);
        return this;
    }

    fillShape(points, color) {
        if (!color) {
            color = "rgb(0, 0, 255)";
        }

        if ((typeof color).toLowerCase() == "object") {
            this.ctx.strokeStyle = color.color;
        } else {
            this.ctx.strokeStyle = color;
        }

        this.ctx.beginPath();

        if (points[0] instanceof Array)
            this.ctx.moveTo(points[0][0], points[0][1]);
        else if (points[0] instanceof Vector)
            this.ctx.moveTo(points[0].x, points[0].y);
        else
            this.ctx.moveTo(points[0], points[1]);

        if (points[0] instanceof Array || points[0] instanceof Vector) {
            points.forEach((object, key) => {
                if (object instanceof Array)
                    this.ctx.lineTo(object[0], object[1]);
                else if (points[0] instanceof Vector)
                    this.ctx.lineTo(object.x, object.y);
            });
        } else {
            for (let i = 0; i < points.length; i += 2) {
                this.ctx.lineTo(points[i], points[i + 1]);
            }
        }

        this.ctx.fillStyle = color;

        this.ctx.closePath();
        this.ctx.fill();
        return this;
    }

    wave(x, y, width, amplitude, step, frequency, color) {
        step = step || 0.1;
        width = width || 100;
        frequency = frequency || 2;
        amplitude = amplitude || 20;

        if (!color) {
            color = "rgb(255, 0, 0)";
        }

        if ((typeof color).toLowerCase() == "object") {
            this.ctx.strokeStyle = color.color;
        } else {
            this.ctx.strokeStyle = color;
        }

        this.ctx.beginPath();
        this.ctx.moveTo(x, y);

        const c = width / Math.PI / (frequency * 2);

        for(let i = 0; i < width; i += step){
            this.ctx.lineTo(i, 250 + (amplitude * Math.sin(i / c)));
        }

        this.ctx.strokeStyle = color;

        this.ctx.stroke();
        return this;
    }

    dist(x, y, x2, y2) {
        const a = x - x2;
        const b = y - y2;

        return Math.sqrt(a * a + b * b);
    }

    background(color) {
        if (color) {
            this.backgroundColor = color;
        }

        if ((typeof color).toLowerCase() == "object") {
            this.ctx.fillStyle = this.backgroundColor.color;
        } else {
            this.ctx.fillStyle = this.backgroundColor;
        }

        this.ctx.fillRect(0, 0, this.width, this.height);
        return this;
    }

    connect(points, strokeWidth, color) {
        for (let i = 0; i < points.length - 1; i++) {
            const one = points[i];
            const two = points[i + 1];

            this.line(one.x, one.y, two.x, two.y, strokeWidth, color);
        }

        return this;
    }

    /*
    *    To use:
    *    canvas.canvas.addEventListener("click", evt => {
    *        canvas.onClick({object: {
    *            x: 0,
    *            y: 0,
    *            w: 100,
    *            h: 100,
    *            type: "box"
    *        }, function: () => {
    *            console.log("Hi");
    *        }});
    *    });
    */

    onClick(...array) {
        array.forEach((object, key) => {
            if (object.object.type == "box" || object.object.type == "square") {
                if (mouseX < object.object.x + object.object.w && mouseX > object.object.x) {
                    if (mouseY < object.object.y + object.object.h && mouseY > object.object.y) {
                        object.function();
                        return true;
                    } else return false;
                } else return false;
            } else return false;
        });

        return false;
    }
}

class Vector {
    constructor(x, y) {
        x = x === null ? 0 : x;
        y = y === null ? 0 : y;

        this.x = x;
        this.y = y;
    }

    dist(x, y) {
        if (x instanceof Vector) {
            const a = this.x - x.x;
            const b = this.y - x.y;
            return Math.sqrt(a * a + b * b);
        } else {
            const a = this.x - x;
            const b = this.y - y;
            return Math.sqrt(a * a + b * b);
        }
    }

    add(x, y) {
        if (x instanceof Vector) {
            this.x += x.x || 0;
            this.y += x.y || 0;
            return this;
        } else if (x instanceof Array) {
            this.x += x[0] || 0;
            this.y += x[1] || 0;
            return this;
        } else {
            this.x += x || 0;
            this.y += y || 0;
            return this;
        }
    }

    sub(x, y) {
        if (x instanceof Vector) {
            this.x -= x.x || 0;
            this.y -= x.y || 0;
            return this;
        } else if (x instanceof Array) {
            this.x -= x[0] || 0;
            this.y -= x[1] || 0;
            return this;
        } else {
            this.x -= x || 0;
            this.y -= y || 0;
            return this;
        }
    }

    set(x, y) {
        if (x instanceof Vector) {
            this.x = x.x || 0;
            this.y = x.y || 0;
            return this;
        } else if (x instanceof Array) {
            this.x = x[0] || 0;
            this.y = x[1] || 0;
            return this;
        } else {
            this.x = x || 0;
            this.y = y || 0;
            return this;
        }
    }

    mult(n) {
        this.x *= n || 0;
        this.y *= n || 0;
        return this;
    }

    magSq() {
        const x = this.x, y = this.y;
        return (x * x + y * y);
    }

    normalize() {
        return this.mag() === 0 ? this : this.div(this.mag());
    }

    setMag(n) {
        return this.normalize().mult(n);
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    div(n) {
        this.x /= n;
        this.y /= n;
        return this;
    }

    limit(max) {
        const mSq = this.magSq();

        if(mSq > max * max) {
            this.div(Math.sqrt(mSq)); //normalize it
            this.mult(max);
        }
        return this;
    }

    mag() {
        return Math.sqrt(this.magSq());
    }

    heading() {
        return Math.atan2(this.y, this.x);
    }

    rotate(a) {
        const mag = this.mag();
        const newHeading = this.heading() + a;

        this.x = Math.cos(newHeading) * mag;
        this.y = Math.sin(newHeading) * mag;
        return this;
    }
}

Global.Vector.add = function(v1, v2, target) {
    if (!target) {
        target = v1.copy();
    } else {
        target.set(v1);
    }
    target.add(v2);
    return target;
};

Global.Vector.sub = function(v1, v2, target) {
    if (!target) {
        target = v1.copy();
    } else {
        target.set(v1);
    }

    target.sub(v2);
    return target;
};

Global.Vector.random2D = function() {
    const angle = Math.random() * Math.PI * 2;
    return new Vector(Math.cos(angle), Math.sin(angle));
};

class Color {
    constructor(...color) {
        if (color.length == 1) color = color[0];
        else if (color.length <= 3) color = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
        else if (color.length <= 4) color = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]})`;
        else console.error("Nope");

        this.type = null;
        this.color = color;

        if (this.color[0] == "#") {
            this.type = "HEX";
        } else if (this.color.substring(0, 3) == "rgb") {
            this.type = "RGB";
        } else {
            console.error(this.color + " is not HEX or RGB");
        }
    }

    convertToHex() {
        let rgb = this.color;

        rgb = rgb.match(/^rgba?\((\d+),\s?(\d+),\s?(\d+)(,\s?(.*))\)$/);

        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2);
        }

        this.color = "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        this.type = "HEX";
        return this;
    }

    convertToRGB() {
        let c;
        const hex = this.color;

        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
            c = hex.substring(1).split("");

            if(c.length == 3){
                c = [c[0], c[0], c[1], c[1], c[2], c[2]];
            }

            c = "0x" + c.join("");

            this.type = "RGB";
            this.color = "rgba("+[(c>>16)&255, (c>>8)&255, c&255].join(",")+",1)";
            return this;
        }

        throw new Error("Bad Hex");
    }

    toString() {
        return this.color;
    }

    toObject() {
        if (this.type == "HEX") {
            this.convertToRGB();
        }

        const result = this.color.match(/^rgba?\((\d+),\s?(\d+),\s?(\d+)(,\s?(.*))?\)$/);

        return {r: result[1], g: result[2], b: result[3], a: result[5]};
    }

    opacity(opacity) {
        const object = this.toObject();

        object.a = opacity;

        this.color = `rgba(${object.r}, ${object.g}, ${object.b}, ${object.a})`;
        return this;
    }

    inverse() {
        const obj = this.toObject();

        if (obj.a) this.color = `rgba(${255 - obj.r}, ${255 - obj.g}, ${255 - obj.b}, ${obj.a})`;
        else this.color = `rgb(${255 - obj.r}, ${255 - obj.g}, ${255 - obj.b})`;

        return this;
    }
}

Global.Color.random = function() {
    let color = "#";
    const letters = "0123456789ABCDEF";

    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return new Color(color);
};



Array.prototype.remove = function(search) {
    const arr = this;

    arr.forEach((object, key) => {
        if (object == search) {
            arr.splice(key, 1);
        }
    });

    return arr;
};


Array.prototype.random = function() {
    return this[Math.floor(Math.random() * this.length)];
};

Number.prototype.map = function(start1, stop1, start2, stop2) {
    return ((this - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
};

Number.prototype.constrain = function(low, high) {
    return Math.max(Math.min(this, high), low);
};

Math.randomBetween = function(min, max) {
    return Math.random() * (max - min + 1) + min;
};

Math.toRadians = function(degrees, pointUp) {
    if (pointUp) return (degrees - 90) * Math.PI / 180;
    else return degrees * Math.PI / 180;
};

Math.toDegrees = function(radians, pointUp) {
    if (pointUp) return (radians * 180 / Math.PI) - 90;
    else return radians * 180 / Math.PI;
};

Math.rectCircleColliding = function(circle, rect) {
    const distX = Math.abs(circle.x - rect.x - rect.w / 2);
    const distY = Math.abs(circle.y - rect.y - rect.h / 2);

    if (distX > (rect.w / 2 + circle.r)) return false;
    if (distY > (rect.h / 2 + circle.r)) return false;

    if (distX <= (rect.w / 2)) return true;
    if (distY <= (rect.h / 2)) return true;

    const dx = distX - rect.w / 2;
    const dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r));
};

Math.circleCircleColliding = function(circle1, circle2) {
    const dx = circle1.x - circle2.x;
    const dy = circle1.y - circle2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance < circle1.r + circle2.r;
};

window.onload = load;