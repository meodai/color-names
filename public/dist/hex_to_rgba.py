import json

# Load color data from colornames.json file
with open('colornames.json', 'r') as file:
    color_data = json.load(file)

# Function to convert hex to RGBA
def hex_to_rgba(hex_color, opacity=0.3):
    r = int(hex_color[1:3], 16)
    g = int(hex_color[3:5], 16)
    b = int(hex_color[5:7], 16)
    return f"rgba({r}, {g}, {b}, {opacity})"

# Generate CSS with custom properties based on hex codes
css_content = ":root {\n"
for color in color_data:
    hex_code = color["hex"].lstrip("#")
    rgba_value = hex_to_rgba(color["hex"])
    css_content += f"  --{hex_code}: {rgba_value};\n"
css_content += "}"

# Save the generated CSS to a file
with open('custom_color_definitions.css', 'w') as css_file:
    css_file.write(css_content)

print("CSS file created: custom_color_definitions.css")