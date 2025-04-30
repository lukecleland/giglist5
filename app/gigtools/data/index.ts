'use server';

import fs from 'fs';

let data:{} = {};

fs.readdirSync('./app/gigtools/data').forEach((file) => {
    if (file.endsWith('.json')) {
        const filePath = `./app/gigtools/data/${file}`;
        const fileContents = fs.readFileSync(filePath, 'utf-8');
        const jsonData = JSON.parse(fileContents);
        data = ({
            ...data,
            [`${file.replace('.json', '')}`]: jsonData,
        });
    }
});

export default data;