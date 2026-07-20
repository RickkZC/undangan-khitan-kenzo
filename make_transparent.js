const { Jimp } = require('jimp');

async function makeTransparent() {
    try {
        const image = await Jimp.read('C:/Users/Erick/.gemini/antigravity/brain/11491c7f-f5ae-44e2-ab7f-3e0ca682c410/betawi_luxury_corner_1783786829308.png');
        
        // Remove white background
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
            const r = this.bitmap.data[idx + 0];
            const g = this.bitmap.data[idx + 1];
            const b = this.bitmap.data[idx + 2];
            
            if (r > 230 && g > 230 && b > 230) {
                this.bitmap.data[idx + 3] = 0; // Alpha 0
            } else if (r > 180 && g > 180 && b > 180) {
                this.bitmap.data[idx + 3] = Math.max(0, 255 - (r + g + b) / 3 * 1.5); // Soft edge
            }
        });
        
        await image.write('assets/images/corner_ornament.png');
        console.log('Successfully created transparent PNG with Jimp');
    } catch(e) {
        console.error(e);
    }
}
makeTransparent();
