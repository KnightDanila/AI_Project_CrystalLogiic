/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function polygon(x, y, radius, npoints) {
    let set = [];
    let angle = 2 * Math.PI / npoints;

    for (let a = 0; a < 2 * Math.PI; a += angle) {
        let sx = x + Math.cos(a) * radius;
        let sy = y + Math.sin(a) * radius;
        set.push(sy, sx);
    }
    set.map((x, i) => i % 2 == 0 && set.slice(i, i + 2));
    let res = "[";
    for (var i = 0; i < set.length; i += 2) {
        res += "[" + set[i] + "," + set[i + 1] + "," + "1" +"],";
    }
    res = res.slice(0, -1);
    res += "]";
    console.log(res);
}

polygon(0.5, 0.5, 0.5, 5);