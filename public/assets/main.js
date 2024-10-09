// Assuming your JSON is in a file named colornames.json
let colorData = [];

fetch('dist/colornames.json')
    .then(response => response.json())
    .then(data => {
        colorData = data;
        displayColors(data);  // Initial display
    })
    .catch(error => console.error('Error fetching color data:', error));

// Function to display colors
function displayColors(colors) {
    const paletteContainer = document.getElementById('main-container');
    paletteContainer.innerHTML = '';  // Clear existing colors

    colors.forEach(color => {
        // Create a new entry div that will hold both colorDiv and infoDiv
        const entryDiv = document.createElement('div');
        entryDiv.id = 'Frosted_Background';

        // Create the main color div element
        const colorDiv = document.createElement('div');
        colorDiv.className = `color-item ${color.name}`;
        colorDiv.style.background = color.hex;
        colorDiv.id = "color-pallete";

        // Create the 'info' div that will hold 'name' and 'hex'
        const infoDiv = document.createElement('div');
        infoDiv.id = 'info';

        // Create 'name' div and 'hex' div
        const nameDiv = document.createElement('div');
        nameDiv.id = 'name';
        nameDiv.textContent = color.name;

        const hexDiv = document.createElement('div');
        hexDiv.id = 'hex';
        hexDiv.textContent = color.hex;

        // Append 'name' and 'hex' to 'info' div
        infoDiv.appendChild(nameDiv);
        infoDiv.appendChild(hexDiv);

        // Append colorDiv and infoDiv to entryDiv
        entryDiv.appendChild(colorDiv);
        entryDiv.appendChild(infoDiv);

        // Append the entryDiv to the palette container
        paletteContainer.appendChild(entryDiv);
    });
}

// Function to search and filter colors
function searchColors() {
    const query = document.getElementById('search-bar').value.toLowerCase();
    const filteredColors = colorData.filter(color =>
        color.name.toLowerCase().includes(query) || color.hex.toLowerCase().includes(query)
    );
    displayColors(filteredColors);
}