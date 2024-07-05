// TO DO:
// rotating donut - becomes thin line then widens back out
// make 0, 0 the center instead of outer, outer
// fix negatives for offset and order of brightness list
// ascii only?

const brightness = ["&#9648", "&#9703", "$", "|", ";",  "&nbsp"]; // bright to dim
const widths     = [1.000000, 0.820000, 0.5, 0.2, 0.277, 0.24];   // relative widths of these characters

let torus = document.getElementById("torus");
donut(0, 0, 15, 25);

document.onmousemove = (event) => {
    const x = event.pageX / window.innerWidth - 0.5;
    const y = event.pageY / window.innerHeight - 0.5;
    const rad = Math.sqrt(x*x + y*y);
    const angle = Math.atan2(y, x);
    donut(rad * 2.5, angle, 15, 25);
}


// Draws a torus, with a light source located at spherical angles (theta, phi) 
// inner/outer radii only affect the density of characters; the torus will always fill the screen
function donut(theta, phi, inner, outer) {
    // Scales font to keep torus a constant size
    const rem = (20 / outer) + "rem"
    torus.style.lineHeight = rem;
    torus.style.fontSize = rem;

    // Converting spherical angles to vector of length 1
    const sourceX = Math.sin(theta) * Math.cos(phi);
    const sourceY = Math.sin(theta) * Math.sin(phi);
    const sourceZ = Math.cos(theta);

    // Note that center of torus is at (outer, outer), +x is right on screen, +y is up, and +z is out from screen
    let string = "";
    let x, y = 0;
    while (y < outer * 2) {
        while(x < outer * 2) {
            // Get the radius to this point and check that it's between radii
            const radius = dist(x, y, outer, outer);
            if (radius < inner || radius > outer) {
                string += brightness[brightness.length - 1];
                x += widths[brightness.length - 1];
            }
            else {
                // Offset is distance from this point to the middle between inner and outer radii
                const offset = -((outer + inner)/2 - radius);
                const z = Math.sqrt(((outer - inner)/2)*((outer - inner)/2) - offset*offset);
                
                // relX, Y, Z measure from center of slice - useful in measuring the angle this point faces
                const scaleFactor = offset / radius;
                const relX = (x - outer) * scaleFactor; // subtracting outer to get (0, 0) to be center
                const relY = (y - outer) * scaleFactor;
                const relZ = z; // center of slice is at z=0, so no changes

                // dot product / norms = how intense light is
                const dotProduct = sourceX*relX + sourceY*relY + sourceZ*relZ;
                let intensity = dotProduct / Math.sqrt(relX*relX + relY*relY + relZ*relZ); // source vector is unit, so its norm is not divided
                let element = -1 * intensity;

                // MAP INTENSITY TO CHAR (-1 to 1 --> 0 - len)
                element += 1; // 0 to 2
                element /= 2; // 0 to 1
                const len = brightness.length - 1; // exclude pure black
                element *= len; // 0 to len

                const dec = element - Math.floor(element);
                element = Math.floor(element) + ((Math.random() < dec*dec) ? 0 : 1); // instead of rounding, uses a probabalistic blend
                string += brightness[element];
                x += widths[element];
            }
        }

        // Moving to beginning of next row of text
        x = 0;
        y++;
        string += "<br>";
    }

    torus.innerHTML = string;
}

function circle(radius) {
    let string = "";
    let x, y = 0;
    while (y < radius * 2) {
        while(x < radius * 2) {
            const distance = dist(x, y, radius, radius);
            let char = Math.round(distance / (radius / 5));
            if (char > 5) {
                char = 5;
            }
            string += brightness[char];
            x += widths[char];
        }
        x = 0;
        y++;
        string += "<br>";
    }

    return string;
}

function testGradient(chars, sizes) {
    let string = "";
    for(let char = 0; char < chars.length; char++) {
        for(let i = 0; i < 60 / sizes[char]; i++) {
            string += chars[char];
        }
        string += "<br>";
        for(let i = 0; i < 60 / sizes[char]; i++) {
            string += chars[char];
        }
        string += "<br>";
        for(let i = 0; i < 60 / sizes[char]; i++) {
            string += chars[char];
        }
        string += "<br>";
        for(let i = 0; i < 60 / sizes[char]; i++) {
            string += chars[char];
        }
        string += "<br>";
    }
    return string;
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2)*(x1 - x2) + (y1 - y2)*(y1 - y2));
}