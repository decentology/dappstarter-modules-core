export default class Mondgram {

    constructor(id, scale, colors, mondgramData) {
        this.id = id;
        this.size = 128;
        this.scale = scale || 1;

        this.colors = colors || ['white', 'red', 'yellow', 'blue'];
        this.thickness = 2;
        if (mondgramData) {
            this.randoms = Mondgram._toRandoms(mondgramData);
            this.play = true;
        } else {
            this.randoms = [];
            this.play = false;
        }
        this.playIndex = 0;
        this._init();
        this.generate();
    }

    _init() {
        let self = this;
        let el = document.getElementById(self.id);
        el.setAttribute('style', `width: ${self.scale * self.size}px;`)
        let cId = `${self.id}-mondrian`;

        el.innerHTML = `<canvas width="${self.size * self.scale}" height="${self.size * self.scale}" id="${cId}"></canvas>`;

        let c = document.getElementById(cId);

        let ctx = c.getContext('2d');
        ctx.scale(self.scale, self.scale);
        ctx.beginPath();
        ctx.lineWidth = self.thickness;

        let xPad = Math.floor(self.size * 0.1);
        let yPad = Math.floor(self.size * 0.1);
        let rect = Mondgram._rectangle(Mondgram.point(0, 0), Mondgram.point(self.size, self.size), self.colors, self._random.bind(self), true);
        rect._split(xPad, yPad, 0, 5, ctx);
        ctx.stroke();

        ctx.rect(self.thickness / 2, self.thickness / 2, self.size - self.thickness, self.size - self.thickness);
        ctx.stroke();
    }

    _random(min, max, isColor) {
        let rndOut;
        if (this.play) {
            rndOut = this.randoms[this.playIndex++];
        } else {
            if (isColor) {
                rndOut = Math.floor(Math.random() * (max - min) + min);
            } else {
                rndOut = Math.round((Math.random() * (max - min) + min) / 8) * 8;
            }
            this.randoms.push(rndOut);
        }
        return rndOut;
    }

    static _toRandoms(mondgramData) {
        let rndData = mondgramData;
        var binary_string = window.atob(rndData + '==');
        var len = binary_string.length;
        var bytes = [];
        for (var i = 0; i < len; i++) {
            bytes.push(binary_string.charCodeAt(i));
        }
        return bytes;
    }

    static point(x, y) {
        return {
            X: x,
            Y: y
        }
    }

    generate() {
        if (this.randoms.length > 0) {
            var binary = '';
            var bytes = new Uint8Array(this.randoms);
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            return window.btoa(binary).replace('==', '');
        } else {
            throw new Error('No image has been generated');
        }
    }

    static _rectangle(minPoint, maxPoint, colors, random) {

        function rect(minPoint, maxPoint, colors, random) {
            this.min = minPoint;
            this.max = maxPoint;
            this.colors = colors;
            this.rnd = random;

            this._width = () => {
                return this.max.X - this.min.X;
            }
    
            this._height = () => {
                return this.max.Y - this.min.Y;
            }
    
            this._draw = (ctx) => {
                // clockwise
                ctx.moveTo(this.min.X, this.min.Y);
                ctx.lineTo(this.max.X, this.min.Y);
                ctx.lineTo(this.max.X, this.max.Y);
                ctx.lineTo(this.min.X, this.max.Y);
                ctx.lineTo(this.min.X, this.min.Y);
            }
    
            this._split = (xPad, yPad, depth, limit, ctx) => {
                ctx.fillStyle = this.colors[this.rnd(0, this.colors.length, true)];
                ctx.fillRect(this.min.X, this.min.Y, this.max.X, this.max.Y);
                this._draw(ctx);
    
                // Check the level of recursion
                if (depth == limit) {
                    return;
                }
    
                // Check the rectangle is large and tall enough
                if (this._width() < 2 * xPad || this._height() < 2 * yPad) {
                    return;
                }
    
                let r1;
                let r2;
    
                // If the rectangle is wider than its height do a left/right split
                if (this._width() > this._height()) {
                    let x = this.rnd(this.min.X + xPad, this.max.X - xPad);
                    r1 = Mondgram._rectangle(this.min, Mondgram.point(x, this.max.Y), this.colors, this.rnd);
                    r2 = Mondgram._rectangle(Mondgram.point(x, this.min.Y), this.max, this.colors, this.rnd);
                }
                else {
                    // Else do a top/bottom split
                    let y = this.rnd(this.min.Y + yPad, this.max.Y - yPad);
                    r1 = Mondgram._rectangle(this.min, Mondgram.point(this.max.X, y), this.colors, this.rnd);
                    r2 = Mondgram._rectangle(Mondgram.point(this.min.X, y), this.max, this.colors, this.rnd);
                }
    
                // Split the sub-rectangles
                r1._split(xPad, yPad, depth + 1, limit, ctx);
                r2._split(xPad, yPad, depth + 1, limit, ctx);
            }
        }

        return new rect(minPoint, maxPoint, colors, random);
    }
}


