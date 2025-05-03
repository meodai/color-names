const fs = require('fs');

// Load color data from colornames.json
const colorData = JSON.parse(fs.readFileSync('public/dist/colornames.json', 'utf8'));

// Function to convert hex to RGBA
function hexToRgba(hex, opacity = 0.3) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

// Generate CSS content
let cssContent = ":root {\n";
colorData.forEach(color => {
  const hexCode = color.hex.replace('#', '');
  const rgbaValue = hexToRgba(color.hex);
  cssContent += `  --${hexCode}: ${rgbaValue};\n`;
});
cssContent += "}";

// Write to translucent_colors.css
fs.writeFileSync('public/dist/translucent_colors.css', cssContent);
console.log("CSS file created: translucent_colors.css");