# Documentation

This folder contains documentation and visualization tools for the color-names
project.

## History Visualization

The [history-visualization.html](history-visualization.html) page provides an
interactive timeline showing the growth of the color names repository from 2017
to present.

### Features

- **Interactive Chart**: Line chart showing the cumulative total of color names
  over time
- **Statistics Dashboard**: Key metrics including total colors, time span,
  number of updates, and peak additions
- **Recent Timeline**: Visual timeline showing the last 20 updates with color
  samples
- **Color Samples**: Hover over color squares to see the name and hex value
- **Responsive Design**: Works on desktop and mobile devices

### Viewing the Visualization

You can view the visualization at:
[https://meodai.github.io/color-names/docs/history-visualization.html](https://meodai.github.io/color-names/docs/history-visualization.html)

### Data Source

The visualization uses the `history.json` file from the `dist` folder, which is
automatically generated during the build process by analyzing the git history
of `src/colornames.csv`.

### Local Development

To view the visualization locally:

1. Build the project to generate `dist/history.json`:

   ```bash
   npm run build
   ```

2. Open `docs/history-visualization.html` in your browser

The visualization loads data from the CDN by default, so it will work
immediately when published.
