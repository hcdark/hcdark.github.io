# NYC Traffic Collision Analysis

This project analyzes and visualizes motor vehicle collision data from New York City, providing both an interactive web interface and detailed technical analysis.

## Project Structure
- `index.html`: Main website page with interactive visualizations
- `css/`: Stylesheets for the website
- `js/`: JavaScript files for interactive visualizations
- `notebooks/`: Jupyter notebooks containing data analysis
- `data/`: Dataset files (not tracked in git due to size)

## Live Demo
Visit the live website at: https://hcdark.github.io/

## Converting Notebooks to HTML
To create HTML versions of the Jupyter notebooks:

1. Make sure you have Jupyter and nbconvert installed:
   ```
   pip install jupyter nbconvert
   ```

2. Run the conversion script:
   ```
   python convert_notebooks.py
   ```

3. This will generate HTML files in the root directory that you can commit and push to GitHub.

## Data Source
Data from NYC Open Data - Motor Vehicle Collisions - Crashes dataset