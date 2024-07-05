// TO DO:
// rotating donut - becomes thin line then widens back out
// ascii only?

const brightness = ["&nbsp", ";",  "|", "$", "&#9703", "&#9648"]; // dim to bright
const widths     = [0.24000, 0.277, 0.2, 0.5, 0.82000, 1.000000]; // relative widths of these characters

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
    let x, y = -outer;
    while (y < outer) {
        while(x < outer) {
            // Get the radius to this point and check that it's between radii
            const radius = dist(x, y, 0, 0);
            if (radius < inner || radius > outer) {
                string += brightness[0];
                x += widths[0];
            }
            else {
                // Offset is distance from this point to the middle between inner and outer radii
                const offset = radius - (outer + inner)/2;
                const z = Math.sqrt(((outer - inner)/2)*((outer - inner)/2) - offset*offset);
                
                // relX, Y, Z measure from center of slice - useful in measuring the angle this point faces
                const scaleFactor = offset / radius;
                const relX = x * scaleFactor;
                const relY = y * scaleFactor;
                const relZ = z; // center of slice is at z=0, so no changes

                // dot product / norms = how intense light is
                const dotProduct = sourceX*relX + sourceY*relY + sourceZ*relZ;
                let intensity = dotProduct / Math.sqrt(relX*relX + relY*relY + relZ*relZ); // source vector is unit, so its norm is not divided

                // Map intensity to a character (-1 to 1 --> 1 to len-1)
                intensity = (intensity + 1) / 2 * (brightness.length - 2) + 1;

                const dec = intensity - Math.floor(intensity);
                intensity = Math.floor(intensity) + ((Math.random() < dec*dec*dec*dec) ? 1 : 0); // instead of rounding, uses a probabalistic blend
                string += brightness[intensity];
                x += widths[intensity];
            }
        }

        // Moving to beginning of next row of text
        x = -outer;
        y++;
        string += "<br>";
    }

    torus.innerHTML = string;
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