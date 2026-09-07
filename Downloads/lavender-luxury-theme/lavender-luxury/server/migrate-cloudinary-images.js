require('dotenv').config();

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Product = require('./models/Product');

const uploadDir = path.join(__dirname, 'uploads');

async function downloadImage(url, filename) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());

    fs.writeFileSync(
        path.join(uploadDir, filename),
        buffer
    );
}

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to VPS MongoDB');

    fs.mkdirSync(uploadDir, { recursive: true });

    const products = await Product.find({
        'images.url': /res\.cloudinary\.com/i
    });

    console.log(`Products containing Cloudinary images: ${products.length}`);

    let downloaded = 0;
    let failed = 0;

    for (const product of products) {

        let changed = false;

        for (const image of product.images) {

            if (
                !image.url ||
                !image.url.includes('res.cloudinary.com')
            ) {
                continue;
            }

            try {

                const extMatch = image.url.match(/\.(jpg|jpeg|png|webp|gif)(?:\?|$)/i);

                const ext = extMatch
                    ? `.${extMatch[1].toLowerCase()}`
                    : '.jpg';

                const filename =
                    `product-${product._id}-${Date.now()}-${downloaded}${ext}`;

                console.log(`Downloading: ${image.url}`);

                await downloadImage(image.url, filename);

                image.url = `/uploads/${filename}`;

                downloaded++;
                changed = true;

                console.log(`Saved: ${filename}`);

            } catch (err) {

                failed++;

                console.error(
                    `FAILED: ${product.name}`,
                    err.message
                );
            }
        }

        if (changed) {
            await product.save();
        }
    }

    console.log('');
    console.log('==============================');
    console.log(`Downloaded: ${downloaded}`);
    console.log(`Failed: ${failed}`);
    console.log('==============================');

    await mongoose.disconnect();
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
