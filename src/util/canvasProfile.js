const { createCanvas } = require('canvas');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

function generateProfileImage(username) {
    return new Promise((resolve, reject) => {
        const canvas = createCanvas(200, 200);
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#' + Math.floor(Math.random() * 16777215).toString(16);
        ctx.fillRect(0, 0, 200, 200);

        const letter = username.charAt(0).toUpperCase();

        ctx.font = '100px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(letter, 100, 100);

        const buffer = canvas.toBuffer('image/png');

        cloudinary.uploader
            .upload_stream({ resource_type: 'image', folder: 'profile_images' }, (err, result) => {
                if (err) return reject(err);
                resolve(result.secure_url);
            })
            .end(buffer);
    });
}

module.exports = generateProfileImage;