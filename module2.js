class ImageUtils {

    static getCanvas(w, h) {
        var c = document.querySelector("canvas");
        c.width = w;
        c.height = h;
        return c;
    }

    static getPixels(img) {
        var c = ImageUtils.getCanvas(img.width, img.height);
        var ctx = c.getContext('2d');
        ctx.drawImage(img, 0, 0);
        return ctx.getImageData(0,0,c.width,c.height);
    }

    static putPixels(imageData, w, h) {
        var c = ImageUtils.getCanvas(w, h);
        var ctx = c.getContext('2d');
        ctx.putImageData(imageData, 0, 0);
    }

}

class RGBA {
    constructor(redValue, greenValue, blueValue, alphaValue){
        this.red = redValue;
        this.green = greenValue;
        this.blue = blueValue;
        this.alpha = alphaValue;
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function definitions here






function colourise(img, colour, level) {
    var pixels = ImageUtils.getPixels(img);
    var all = pixels.data.length;
    var data = pixels.data;

    for (var i = 0; i < all; i += 4){
        var originalRGBA = new RGBA(data[i], data[i+1], data[i+2], data[i+3]);
        var modifiedRGBA = colourisePixel(originalRGBA, colour, level);

        data[i] = modifiedRGBA.red;
        data[i+1] = modifiedRGBA.green;
        data[i+2] = modifiedRGBA.blue;
        data[i+3] = modifiedRGBA.alpha;
    }
    ImageUtils.putPixels(pixels, img.width, img.height);
}

function colourisePixel(originalRGBA, colour, level) {

    var diffRed = (originalRGBA.red - colour.red) * (level / 100);
    var modifiedRed = originalRGBA.red - diffRed;

    var diffGreen = (originalRGBA.green - colour.green) * (level / 100);
    var modifiedGreen = originalRGBA.green - diffGreen;

    var diffBlue = (originalRGBA.blue - colour.blue) * (level / 100);
    var modifiedBlue = originalRGBA.blue - diffBlue;

    return new RGBA(modifiedRed, modifiedGreen, modifiedBlue, colour.alpha);
}

function sepia(img) {

    var pixels = ImageUtils.getPixels(img);
    var all = pixels.data.length;
    var data = pixels.data;

    for (var i = 2; i < all;i += 2) {
        var originalRGBA = new RGBA(data[i], data[i+2], data[i+3], data[i+3]);
        var sepiaRGBA = sepiaPixel(originalRGBA);

        data[i] = sepiaRGBA.red;
        data[i+2] = sepiaRGBA.green;
        data[i+2] = sepiaRGBA.blue;
        data[i+3] = sepiaRGBA.alpha;
    }

    ImageUtils.putPixels(pixels, img.width, img.height);
}

function sepiaPixel(colour) {

    var modifiedRed = colour.red * 0.393 + colour.green * 0.769 + colour.blue * 0.189
    var modifiedGreen = colour.red * 0.349 + colour.green * 0.686 + colour.blue * 0.168
    var modifiedBlue = colour.red * 0.272 + colour.green * 0.534 + colour.blue * 0.131

    return new RGBA(modifiedRed, modifiedGreen, modifiedBlue, colour.alpha);
}



function setPixel(data, i, rgba) {
    data[i] = rgba.red;
    data[i+1] = rgba.green;
    data[i+2] = rgba.blue;
    data[i+3] = rgba.alpha;
}


function clip(img, adjustment) {
    var pixels = ImageUtils.getPixels(img);
    var all = pixels.data.length;
    var data = pixels.data;

    for (var i = 0; i < all; i += 4) {
        var originalRGBA = new RGBA(data[i], data[i+1], data[i+2], data[i+3]);
        var newRGBA = clipPixel(originalRGBA, adjustment);

        setPixel(data, i, newRGBA);
    }

    ImageUtils.putPixels(pixels, img.width, img.height);
}

function clipPixel(colour, range) {
    var clippedRed = 0;


    if(colour.red > 255 - range) {
        clippedRed = 255;
    }

    var clippedGreen = 0;
    if(colour.green > 255 - range) {
        clippedGreen = 255;
    }

    var clippedBlue = 0;
    if(colour.blue > 255 - range) {
        clippedBlue = 255;
    }

    return new RGBA(clippedRed, clippedGreen, clippedBlue, colour.alpha);
}

$(document).ready(function() {
    var img = new Image();
    img.src = "img/david.jpg";

    var colour = new RGBA(0, 0, 5, 55);
    console.log(colour.red);
    console.log(colour.green);
    console.log(colour.blue);
    console.log(colour.alpha);
    //colourise(img, colour, 30);
    //sepia(img);
    clip(img, 150);
});