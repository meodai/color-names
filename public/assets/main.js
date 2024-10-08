fetch('dist/colornames.json')
    .then(response => response.json())
    .then(data => {
        const paletteContainer = document.getElementById('main-container');

        // Iterate through each entry in the JSON
        data.forEach(color => {
            // Create a new entry div that will hold both colorDiv and infoDiv
            const entryDiv = document.createElement('div');
            entryDiv.id = 'Frosted_Background';  // You can style this if needed

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
    })
    .catch(error => console.error('Error fetching color data:', error));