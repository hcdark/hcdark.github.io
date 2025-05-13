#!/usr/bin/env python3
"""
Convert Jupyter notebooks to HTML and save them in the root directory
"""

import os
import subprocess
import glob

def convert_notebooks():
    """Convert all notebooks to HTML and place them in the root directory"""
    print("Converting Jupyter notebooks to HTML...")
    
    # Find all notebook files
    notebook_dir = 'notebooks'
    notebooks = glob.glob(os.path.join(notebook_dir, '*.ipynb'))
    
    if not notebooks:
        print("No notebook files found in the 'notebooks' directory.")
        return
    
    # Create output directory if it doesn't exist
    output_dir = '.'  # Root directory
    
    # Convert each notebook
    for notebook in notebooks:
        base_name = os.path.basename(notebook)
        print(f"Converting {base_name}...")
        
        # Use nbconvert to convert to HTML
        cmd = [
            'jupyter', 'nbconvert', 
            '--to', 'html', 
            '--output-dir', output_dir,
            notebook
        ]
        
        try:
            subprocess.run(cmd, check=True)
            print(f"Successfully converted {base_name} to HTML")
        except subprocess.CalledProcessError as e:
            print(f"Error converting {base_name}: {e}")
            continue
    
    print("\nConversion complete!")
    print("HTML files are now available in the root directory.")
    print("\nYou can now commit and push these HTML files to GitHub:")
    print("git add *.html")
    print("git commit -m \"Add HTML versions of notebooks\"")
    print("git push")

if __name__ == "__main__":
    convert_notebooks() 