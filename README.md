# PPLE Policy Poster Editor

A web-based editor for customizing and exporting PPLE policy posters.

## Features

- 📝 **Real-time Text Editing**: Edit text content on the poster with live preview
- 🎨 **Visual Interface**: Beautiful, modern UI with intuitive controls
- 📥 **PNG Export**: Export your customized poster as a high-quality PNG image
- 🔄 **Reset Function**: Easily reset to the original template
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A local web server (for loading the SVG file)

### Installation

1. Clone or download this repository
2. Make sure the file structure looks like this:
   ```
   pple-policy-poster/
   ├── poster-editor.html
   ├── template/
   │   └── template_example_2.svg
   └── README.md
   ```

### Running the Application

Since the application loads an SVG file, you need to run it through a local web server:

#### Option 1: Using Python (Recommended)

```bash
# Navigate to the project directory
cd pple-policy-poster

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open your browser and navigate to: `http://localhost:8000/poster-editor.html`

#### Option 2: Using Node.js (http-server)

```bash
# Install http-server globally (one time only)
npm install -g http-server

# Navigate to the project directory and run
cd pple-policy-poster
http-server -p 8000
```

Then open your browser and navigate to: `http://localhost:8000/poster-editor.html`

#### Option 3: Using VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `poster-editor.html`
3. Select "Open with Live Server"

## How to Use

1. **Edit Text**: Use the input fields in the left sidebar to modify the text on your poster
2. **Preview**: See your changes in real-time in the preview area
3. **Export**: Click the "Export as PNG" button to download your customized poster
4. **Reset**: Click "Reset to Original" to revert all changes

## Customization

### Adding More Text Fields

To add more editable text fields, modify the `textConfig` array in the `poster-editor.html` file:

```javascript
const textConfig = [
    { 
        id: 'mytext',           // Unique ID
        label: 'My Text',       // Label shown in UI
        defaultValue: 'Text',   // Initial value
        x: 100,                 // X position in SVG
        y: 100,                 // Y position in SVG
        fontSize: 20,           // Font size
        fill: 'white',          // Text color
        fontWeight: 'normal',   // Font weight
        fontFamily: 'Arial',    // Font family
        filterGroup: 0          // Optional: filter group index
    },
    // Add more configurations here...
];
```

### Changing Styles

You can customize the appearance by modifying the CSS in the `<style>` section of `poster-editor.html`.

## Technical Details

- **Pure HTML/CSS/JavaScript**: No external dependencies required
- **SVG Manipulation**: Uses native browser SVG APIs
- **Canvas Export**: Converts SVG to PNG using HTML5 Canvas
- **Responsive Design**: CSS Grid and Flexbox for layout

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Troubleshooting

### SVG Not Loading

**Problem**: "Error loading the SVG file" message appears

**Solution**: Make sure you're running the application through a web server (not just opening the HTML file directly). Browsers block file:// requests for security reasons.

### Export Not Working

**Problem**: PNG export doesn't download

**Solution**: 
- Check browser console for errors
- Ensure pop-ups are not blocked
- Try a different browser

### Text Not Appearing

**Problem**: Edited text doesn't show on the poster

**Solution**:
- Check that the x and y coordinates in `textConfig` are within the SVG viewBox (0-1200 width, 0-1600 height)
- Ensure the text color contrasts with the background

## License

This project is open source and available for modification and distribution.

## Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Enjoy creating your custom PPLE policy posters! 🎉**
