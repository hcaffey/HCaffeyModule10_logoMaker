const inquirer = require('inquirer');
const svg2img = require('svg2img');
const fs = require('fs');

// code informed by https://www.w3.org/TR/2003/REC-SVG11-20030114/shapes.html
const svgTemplate = (text, textColor, shape, shapeColor) => {
  let shapeElement;

  switch (shape) {
    case 'circle':
      shapeElement = `<circle cx="150" cy="100" r="50" fill="${shapeColor}" />`;
      break;
    case 'triangle':
      shapeElement = `<polygon points="150,50 100,150 200,150" fill="${shapeColor}" />`;
      break;
    case 'square':
      shapeElement = `<rect x="100" y="50" width="100" height="100" fill="${shapeColor}" />`;
      break;
  }
  return  `<svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="white" />
        ${shapeElement}
        <text x="50%" y="50%" text-anchor="middle" fill="${textColor}" font-size="48">${text}</text>
        </svg>`
};

//function to prompt choices w inquirer
const makeLogo = async () => {
  try {
    const userInput = await inquirer.prompt([
      {
        name: 'text',
        message: 'Enter up to three characters:',
        validate: (input) => input.length <= 3,
      },
      {
        name: 'textColor',
        message: 'Enter the text color (color keyword or hexadecimal number):',
      },
      {
        type: 'list',
        name: 'shape',
        message: 'Choose a shape:',
        choices: ['circle', 'triangle', 'square'],
      },
      {
        name: 'shapeColor',
        message: 'Enter the shape color (color keyword or hexadecimal number):',
      },
    ]);
    //destructure user inputs to pass into template defined above
    const { text, textColor, shape, shapeColor } = userInput;
    const svgContent = svgTemplate(text, textColor, shape, shapeColor);

    fs.writeFileSync('logo.svg', svgContent, 'utf-8');
    console.log('Generated logo.svg');
    //using svg2img to translate template into png file of actual logo
    svg2img('logo.svg', { width: 600, height: 400 }, (error, buffer) => {
      if (error) {
        console.error('Error converting SVG to PNG:', error);
      } else {
        fs.writeFileSync('logo.png', buffer);
        console.log('Made logo.png');
      }
    });
  } catch (error) {
    console.error('Error making logo:', error);
  }
};


module.exports = makeLogo;