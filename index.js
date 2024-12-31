const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


const app = express();
const PORT = process.env.PORT || 3000;

// Function to create storage configuration based on category
const createStorage = (category) => {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            const dir = `uploads/${category}`;
            // Create the directory if it doesn't exist
            fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },
        filename: (req, file, cb) => {
            // Use original filename with timestamp to avoid conflicts
            cb(null, `${Date.now()}-${file.originalname}`);
        }
    });
};

// Middleware for handling uploads for each category
const uploadRings = multer({ storage: createStorage('rings') }).single('image');
const uploadNecklace = multer({ storage: createStorage('necklace') }).single('image');
const uploadEarrings = multer({ storage: createStorage('earrings') }).single('image');
const uploadCustomDesigns = multer({ storage: createStorage('custom_designs') }).single('image');

// Serve static files from the current directory
app.use(express.static(__dirname));

// Main page with links to categories
app.get('/', (req, res) => {
    res.send(`
           <link rel="stylesheet" href="styles.css">
        <h1>Upload an Image</h1>
        <h2>Select a Category:</h2>
        <ul>
            <li><a href="/rings">Rings</a></li>
            <li><a href="/necklace">Necklace</a></li>
            <li><a href="/earrings">Earrings</a></li>
            <li><a href="/custom_designs">Custom Designs</a></li>
        </ul>
    `);
});

// Route for uploading rings
app.get('/rings', (req, res) => {
    res.send(`
           <link rel="stylesheet" href="styles.css">
        <h2>Upload a Ring Image</h2>
        <form action="/upload/rings" method="post" enctype="multipart/form-data">
            Select image to upload:
            <input type="file" name="image" accept="image/*" required>
            <input type="submit" value="Upload Image">
        </form>
        <br>
        <a href="/">Back to Main Page</a> | 
        <a href="/view/rings">View Uploaded Rings</a>
    `);
});

// Handle image uploads for rings
app.post('/upload/rings', (req, res) => {
    uploadRings(req, res, (err) => {
        if (err) {
            return res.json({ message: err });
        }
        const imageUrl = `/uploads/rings/${req.file.filename}`;
        res.send(`
               <link rel="stylesheet" href="styles.css">
            <h2>File uploaded successfully!</h2>
            <img src="${imageUrl}" alt="Uploaded Ring" style="max-width: 300px;"/>
            <p>Access it at: <a href="${imageUrl}">${imageUrl}</a></p>
            <br>
            <a href="/rings">Upload another Ring</a> | 
            <a href="/">Back to Main Page</a> | 
            <a href="/view/rings">View Uploaded Rings</a>
        `);
    });
});

// Route for viewing uploaded rings
app.get('/view/rings', (req, res) => {
    const dirPath = path.join(__dirname, 'uploads', 'rings');
    fs.readdir(dirPath, (err, files) => {
        if (err) return res.send('Error reading directory.');
        
        const images = files.map(file => `<img src="/uploads/rings/${file}" alt="${file}" style="max-width: 200px; margin: 10px;">`).join('');
        
        res.send(`
               <link rel="stylesheet" href="styles.css">
            <h2>Uploaded Rings</h2>
            <div>${images}</div>
            <br>
            <a href="/rings">Back to Upload Rings</a> | 
            <a href="/">Back to Main Page</a>
        `);
    });
});

// Route for uploading necklaces
app.get('/necklace', (req, res) => {
    res.send(`
           <link rel="stylesheet" href="styles.css">
        <h2>Upload a Necklace Image</h2>
        <form action="/upload/necklace" method="post" enctype="multipart/form-data">
            Select image to upload:
            <input type="file" name="image" accept="image/*" required>
            <input type="submit" value="Upload Image">
        </form>
        <br>
        <a href="/">Back to Main Page</a> | 
        <a href="/view/necklace">View Uploaded Necklaces</a>
    `);
});

// Handle image uploads for necklaces
app.post('/upload/necklace', (req, res) => {
    uploadNecklace(req, res, (err) => {
        if (err) {
            return res.json({ message: err });
        }
        const imageUrl = `/uploads/necklace/${req.file.filename}`;
        res.send(`
               <link rel="stylesheet" href="styles.css">
            <h2>File uploaded successfully!</h2>
            <img src="${imageUrl}" alt="Uploaded Necklace" style="max-width: 300px;"/>
            <p>Access it at: <a href="${imageUrl}">${imageUrl}</a></p>
            <br>
            <a href="/necklace">Upload another Necklace</a> | 
            <a href="/">Back to Main Page</a> | 
            <a href="/view/necklace">View Uploaded Necklaces</a>
        `);
    });
});

// Route for viewing uploaded necklaces
app.get('/view/necklace', (req, res) => {
    const dirPath = path.join(__dirname, 'uploads', 'necklace');
    fs.readdir(dirPath, (err, files) => {
        if (err) return res.send('Error reading directory.');
        
        const images = files.map(file => `<img src="/uploads/necklace/${file}" alt="${file}" style="max-width: 200px; margin: 10px;">`).join('');
        
        res.send(`
               <link rel="stylesheet" href="styles.css">
            <h2>Uploaded Necklaces</h2>
            <div>${images}</div>
            <br>
            <a href="/necklace">Back to Upload Necklace</a> | 
            <a href="/">Back to Main Page</a>
        `);
    });
});

// Route for uploading earrings
app.get('/earrings', (req, res) => {
    res.send(`
           <link rel="stylesheet" href="styles.css">
        <h2>Upload an Earring Image</h2>
        <form action="/upload/earrings" method="post" enctype="multipart/form-data">
            Select image to upload:
            <input type="file" name="image" accept="image/*" required>
            <input type="submit" value="Upload Image">
        </form>
        <br>
        <a href="/">Back to Main Page</a> | 
        <a href="/view/earrings">View Uploaded Earrings</a>
    `);
});

// Handle image uploads for earrings
app.post('/upload/earrings', (req, res) => {
    uploadEarrings(req, res, (err) => {
        if (err) {
            return res.json({ message: err });
        }
        const imageUrl = `/uploads/earrings/${req.file.filename}`;
        res.send(`
               <link rel="stylesheet" href="styles.css">
            <h2>File uploaded successfully!</h2>
            <img src="${imageUrl}" alt="Uploaded Earring" style="max-width: 300px;"/>
            <p>Access it at: <a href="${imageUrl}">${imageUrl}</a></p>
            <br>
            <a href="/earrings">Upload another Earring</a> | 
            <a href="/">Back to Main Page</a> | 
            <a href="/view/earrings">View Uploaded Earrings</a>
        `);
    });
});

// Route for viewing uploaded earrings
app.get('/view/earrings', (req, res) => {
    const dirPath = path.join(__dirname, 'uploads', 'earrings');
    fs.readdir(dirPath, (err, files) => {
        if (err) return res.send('Error reading directory.');
        
        const images = files.map(file => `<img src="/uploads/earrings/${file}" alt="${file}" style="max-width: 200px; margin: 10px;">`).join('');
        
        res.send(`
               <link rel="stylesheet" href="styles.css">
            <h2>Uploaded Earrings</h2>
            <div>${images}</div>
            <br>
            <a href="/earrings">Back to Upload Earrings</a> | 
            <a href="/">Back to Main Page</a>
        `);
    });
});

// Route for uploading custom designs
app.get('/custom_designs', (req, res) => {
    res.send(`
           <link rel="stylesheet" href="styles.css">
        <h2>Upload a Custom Design Image</h2>
        <form action="/upload/custom_designs" method="post" enctype="multipart/form-data">
            Select image to upload:
            <input type="file" name="image" accept="image/*" required>
            <input type="submit" value="Upload Image">
        </form>
        <br>
        <a href="/">Back to Main Page</a> | 
        <a href="/view/custom_designs">View Uploaded Custom Designs</a>
    `);
});

// Handle image uploads for custom designs
app.post('/upload/custom_designs', (req, res) => {
    uploadCustomDesigns(req, res, (err) => {
        if (err) {
            return res.json({ message: err });
        }
        const imageUrl = `/uploads/custom_designs/${req.file.filename}`;
        res.send(`
               <link rel="stylesheet" href="styles.css">
            <h2>File uploaded successfully!</h2>
            <img src="${imageUrl}" alt="Uploaded Custom Design" style="max-width: 300px;"/>
            <p>Access it at: <a href="${imageUrl}">${imageUrl}</a></p>
            <br>
            <a href="/custom_designs">Upload another Custom Design</a> | 
            <a href="/">Back to Main Page</a> | 
            <a href="/view/custom_designs">View Uploaded Custom Designs</a>
        `);
    });
});

// Route for viewing uploaded custom designs
app.get('/view/custom_designs', (req, res) => {
    const dirPath = path.join(__dirname, 'uploads', 'custom_designs');
    fs.readdir(dirPath, (err, files) => {
        if (err) return res.send('Error reading directory.');
        
        const images = files.map(file => `<img src="/uploads/custom_designs/${file}" alt="${file}" style="max-width: 200px; margin: 10px;">`).join('');
        
        res.send(`
               <link rel="stylesheet" href="styles.css">
            <h2>Uploaded Custom Designs</h2>
            <div>${images}</div>
            <br>
            <a href="/custom_designs">Back to Upload Custom Design</a> | 
            <a href="/">Back to Main Page</a>
         `);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
