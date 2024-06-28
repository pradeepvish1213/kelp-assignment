const fs = require('fs');
const dotenv = require('dotenv');
const express = require('express');
const multer = require('multer');
const {insertRecords, findAllUsers} = require('./userService')
const {checkDatabaseConnection} = require('./dbConnection')

dotenv.config();

const app = express();
const port = 3000;

const upload = multer({dest: 'uploads/'});

// Function to parse dot notation keys into nested objects
function parseDotNotation(obj) {
    const result = {};
    for (const key in obj) {
        const keys = key.split('.');
        keys.reduce((acc, part, index) => {
            if (index === keys.length - 1) {
                acc[part] = obj[key];
            } else {
                acc[part] = acc[part] || {};
            }
            return acc[part];
        }, result);
    }
    return result;
}

// Custom CSV parser function
function customCsvParser(data) {
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',').map(header => header.trim());
    const rows = lines.slice(1).map(line => line.split(',').map(field => field.trim()));

    return rows.map(row => {
        const obj = {};
        row.forEach((field, index) => {
            obj[headers[index]] = field;
        });
        return parseDotNotation(obj);
    });
}

// CSV to JSON conversion endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        fs.readFile(req.file.path, 'utf8', (error, data) => {
            if (error) {
                return res.status(500).json({error: error.message});
            }
            const results = customCsvParser(data);
            insertRecords(results).then(() => {
                res.json({message: 'File uploaded successfully with ' + results.length});
            }).catch(error => {
                console.error('Unexpected error:', error);
                res.status(500).json({error: error.message});
            });
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({error: error.message});
    } finally {
        try {
            await fs.unlinkSync(req.file.path);
        } catch (unlinkError) {
            console.error('Error removing uploaded file:', unlinkError);
            res.status(500).json({error: unlinkError});
        }
    }

});

app.get('/report', async (req, res) => {
    try {
        const result = await findAllUsers()
        const ageGroups = {'< 20': 0, '20 to 40': 0, '40 to 60': 0, '> 60': 0};
        result.forEach(row => {
            const age = row.age;
            if (age < 20) ageGroups['< 20']++;
            else if (age <= 40) ageGroups['20 to 40']++;
            else if (age <= 60) ageGroups['40 to 60']++;
            else ageGroups['> 60']++;
        });

        const total = result.length;
        const distribution = {
            '< 20': ((ageGroups['< 20'] / total) * 100).toFixed(2),
            '20 to 40': ((ageGroups['20 to 40'] / total) * 100).toFixed(2),
            '40 to 60': ((ageGroups['40 to 60'] / total) * 100).toFixed(2),
            '> 60': ((ageGroups['> 60'] / total) * 100).toFixed(2),
        };
        res.send(distribution);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
    checkDatabaseConnection().catch((error) => {
        console.log('Database error:', error)
    })
});
