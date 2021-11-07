function kor_matrix_gen(a, b, d) {
    this.pl7a = a;
    this.pl7b = b;
    this.pl7c = 1;
    this.pl7(a, b, d)
}
kor_matrix_gen.prototype.pl7 = function(a, b, d) {
    this.reteg_array = Array(a);
    var e;
    for (e = 0; e < a; e++) this.reteg_array[e] = this.pl9(b, d)
};

kor_matrix_gen.prototype.pl9 = function(a, b) {
    var d = Array(a),
        e, f;
    for (e = 0; e < a; e++)
        for (d[e] = new Int8Array(b), f = 0; f < b; f++) d[e][f] = -1;
    return d
};
kor_matrix_gen.prototype.pla = function(a, b, d, e, f) {
    var g = Math.abs(d - a),
        k = Math.abs(e - b),
        h = k & 1,
        n = 4 * (1 - g) * k * k,
        m = 4 * (h + 1) * g * g,
        l = n + m + h * g * g,
        r = this.pl7c;
    a > d && (a = d, d += g);
    b > e && (b = e);
    b += Math.floor((k + 1) / 2);
    e = b - h;
    g *= 8 * g;
    h = 8 * k * k;
    do {
        f[d][b] = r;
        f[a][b] = r;
        f[a][e] = r;
        f[d][e] = r;
        var q = 2 * l;
        q >= n && (a++, d--, l += n += h);
        q <= m && (b++, e--, l += m += g)
    } while (a <= d);
    for (; b - e < k;) f[a - 1][++b] = r, f[a - 1][--e] = r
};
kor_matrix_gen.prototype.plb = function(a, b) {
    switch (this.pl7f) {
        case 0:
            this.reteg_array[this.pl80][a][b] = this.pl7c;
            break;
        case 1:
            this.reteg_array[b][this.pl80][a] = this.pl7c;
            break;
        case 2:
            this.reteg_array[b][a][this.pl80] = this.pl7c
    }
};


//gen egy(true, 32, 3. ertek, true) //3. ertek =  5 vagy 4 vagy 3)*2 -2

kor_matrix_gen.prototype.gen_egy = function(a, b, d, e) {
    var f = b * d,
        g = this.pl9(f, f),
        k = this.pl9(f, f),
        h, n = Math.floor((b + 1) / 4),
        m = Math.floor((d + 1) / 2 - 1),
        l = Math.floor(d * d / 2),
        r = Math.floor((b + 1) / 2),
        q = b - 1,
        u = new pl6d;
    this.pla(0, 0, f - 1, f - 1, g);
    a && (this.pl81 = 0);
    for (; this.pl81 < n; this.pl81++) {
        var v = this.pl81 * d + m;
        for (a = 0; a < f; a++)
            for (h = 0; h < f; h++) k[a][h] = -1;
        for (a = 0; a < f && !(0 < g[a][v]); a++);
        if (0 != this.pl81)
            for (this.pla(a, a, f - a - 1, f - a - 1, k), this.pl17(k, 1), a = 0; a < r; a++)
                for (h = 0; h < r; h++) this.pl19(k, a * d, h * d, d) > l && (this.reteg_array[this.pl81][a][h] = this.pl7c,
                    this.reteg_array[this.pl81][q - a][h] = this.pl7c, this.reteg_array[this.pl81][a][q - h] = this.pl7c, this.reteg_array[this.pl81][q - a][q - h] = this.pl7c, this.reteg_array[h][this.pl81][a] = this.pl7c, this.reteg_array[h][this.pl81][q - a] = this.pl7c, this.reteg_array[h][a][this.pl81] = this.pl7c, this.reteg_array[h][q - a][this.pl81] = this.pl7c, this.reteg_array[h][a][q - this.pl81] = this.pl7c, this.reteg_array[h][q - a][q - this.pl81] = this.pl7c, this.reteg_array[h][q - this.pl81][a] = this.pl7c, this.reteg_array[h][q - this.pl81][q - a] = this.pl7c);
        else
            for (a = Math.round(a / d), this.pla(a, a, q - a, q - a, this.reteg_array[0]), this.pl17(this.reteg_array[0],
                    this.pl7c), p = this.reteg_array[0], a = 0; a < r; a++)
                for (h = 0; h < r; h++) 0 < p[a][h] && (this.reteg_array[h][this.pl81][a] = this.pl7c, this.reteg_array[h][this.pl81][q - a] = this.pl7c, this.reteg_array[h][a][this.pl81] = this.pl7c, this.reteg_array[h][q - a][this.pl81] = this.pl7c, this.reteg_array[h][a][q - this.pl81] = this.pl7c, this.reteg_array[h][q - a][q - this.pl81] = this.pl7c, this.reteg_array[h][q - this.pl81][a] = this.pl7c, this.reteg_array[h][q - this.pl81][q - a] = this.pl7c);
        if (e && 500 < u.pl65()) return !1
    }
    this.reteg_array[b - 1] = this.reteg_array[0];
    d = Math.floor((b + 1) / 2);
    for (e = 1; e < d; e++) this.pl14(e, e - 1), this.reteg_array[b -
        1 - e] = this.reteg_array[e];
    return !0
};
kor_matrix_gen.prototype.pl14 = function(a, b) {
    for (var d = this.reteg_array[a], e = this.reteg_array[b], f = Math.floor((d.length + 1) / 2) - 1, g = Math.floor((d[0].length + 1) / 2) - 1, k = d.length - 1, h = d[0].length - 1, n = 0; n < f && !(0 < d[n][g]);) n++;
    for (var m = 0; m < g && !(0 < d[f][m]);) m++;
    var l;
    m++;
    for (l = g; l >= m; l--) {
        for (g = n; g <= f && !(0 < d[g++][l]););
        for (; g <= f && !(0 < d[g][l - 1] && -1 != e[g][l]);) g++;
        for (; g <= f;) d[g][l] = 0, d[g][h - l] = 0, d[k - g][l] = 0, d[k - g][h - l] = 0, g++
    }
};

kor_matrix_gen.prototype.pl17 = function(a, b) {
    var d, e, f, g = a.length,
        k = a[0].length;
    for (e = 0; e < k; e++) {
        for (d = 0; d < g && -1 == a[d][e];) d++;
        if (!(d >= g)) {
            for (; d < g && 1 <= a[d][e];) d++;
            for (f = g - d; d < f;) a[d++][e] = b
        }
    }
};
kor_matrix_gen.prototype.pl18 = function(a, b) {
    var d = Math.floor((a.length + 1) / 2),
        e = Math.floor((a[0].length + 1) / 2),
        f, g, k, h = a.length - 1,
        n = a[0].length - 1;
    for (g = 0; g < e; g++) {
        for (f = 0; f < d && -1 == a[f][g];) f++;
        if (!(f >= d - 1)) {
            for (; f < d && 1 <= a[f][g];) f++;
            if (!(f >= d - 1)) {
                for (k = f + 1; k < d && -1 == a[k][g];) k++;
                if (!(k >= d))
                    for (; f <= d && -1 == a[f][g];) a[f][g] = b, a[f][n - g] = b, a[h - f][g] = b, a[h - f][n - g] = b, f++
            }
        }
    }
    for (f = 0; f < d; f++) {
        for (g = 0; g < e && -1 == a[f][g];) g++;
        if (!(g >= e - 1)) {
            for (; g < e && 1 <= a[f][g];) g++;
            if (!(g >= e - 1)) {
                for (k = g + 1; k < e && -1 == a[f][k];) k++;
                if (!(k >= e))
                    for (; g <
                        e && -1 == a[f][g];) a[f][g] = b, a[f][n - g] = b, a[h - f][g] = b, a[h - f][n - g] = b, g++
            }
        }
    }
};
kor_matrix_gen.prototype.pl19 = function(a, b, d, e) {
    var f = b + e;
    e = d + e;
    for (var g, k = 0; b < f; b++)
        for (g = d; g < e; g++) 0 < a[b][g] && k++;
    return k
};


function pl6d() {
    this.plc3 = (new Date).getTime()
}
pl6d.prototype.pl65 = function() {
    return (new Date).getTime() - this.plc3
};

function pl5d(n) {
    let a = 128 > n ? 5 : 192 > n ? 4 : 3;
    return 2 * a - 1
}

function getCords(n) {
    let a = new kor_matrix_gen(n, n, n)
    a.gen_egy(true, n, pl5d(n), true)

    let arr = []; //new Array(a.reteg_array.length);
    let move = -((Math.ceil(a.reteg_array.length / 2)) - 1); // -1 mert 0 tol indexolodoik


    for (let i = 0; i < a.reteg_array.length; i++) { //y
        for (let j = 0; j < a.reteg_array.length; j++) { //x
            for (let k = 0; k < a.reteg_array.length; k++) { //z
                // console.log(a.reteg_array[i][j][k]);
                if (a.reteg_array[i][j][k] === 1) {
                    arr.push([j + move, i, k + move]); //xyz
                }

            }

        }

    }

    return arr;
    // console.log(a.reteg_array[0]);
    // console.log(Math.ceil(a.reteg_array.length / 2));
    // return után kell megadni a centert

}
//this.plbc = new kor_matrix_gen(this.plb9, this.plb9, this.plb9); ////------------------------------------new kor (atmero atmero atmero) plbc.reteg_array

//gen egy(true, 32, 3. ertek, true) //3. ertek =  5 vagy 4 vagy 3)*2 -2

// n = 32
// a = new kor_matrix_gen(n, n, n)
// a.gen_egy(true, n, pl5d(n), true)
// a.reteg_array