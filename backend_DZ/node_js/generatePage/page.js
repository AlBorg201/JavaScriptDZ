const yargs = require('yargs');
const fs = require('fs').promises;
const path = require('path');

/**
 * @param {Object} argv
 * @param {string} argv.title
 * @param {string} argv.output
 * @param {string} [argv.bgColor]
 * @param {string} [argv.textColor] 
 * @param {string} [argv.content]
 * @returns {Promise<void>}
 */
async function generatePage({ title, output, bgColor, textColor, content }) {
    try {
        const htmlTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            background-color: ${bgColor};
            color: ${textColor};
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .container {
            text-align: center;
            padding: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>
        <p>${content}</p>
    </div>
</body>
</html>`;

        await fs.mkdir(path.dirname(output), { recursive: true });
        await fs.writeFile(output, htmlTemplate);
        console.log(`Page successfully generated at ${output}`);
    } catch (error) {
        console.error('Error generating page:', error.message);
        process.exit(1);
    }
}

yargs
    .command(
        'generate',
        'Generate an HTML page',
        {
            title: {
                description: 'Page title',
                demand: true,
                type: 'string'
            },
            output: {
                description: 'Output file path',
                demand: true,
                type: 'string'
            },
            bgColor: {
                description: 'Background color',
                type: 'string',
                default: 'white'
            },
            textColor: {
                description: 'Text color',
                type: 'string',
                default: 'black'
            },
            content: {
                description: 'Main content',
                type: 'string',
                default: 'Шаблон сгенерированной страницы'
            }
        },
        generatePage
    )
    .help()
    .argv;