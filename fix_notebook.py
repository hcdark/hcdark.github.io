import json

# Load the notebook
with open('notebooks/explainer.ipynb', 'r') as f:
    notebook = json.load(f)

# Find the cell with plt.style.use and fix it
for cell in notebook['cells']:
    if cell['cell_type'] == 'code':
        if isinstance(cell['source'], list):
            for i, line in enumerate(cell['source']):
                if "plt.style.use('seaborn')" in line:
                    cell['source'][i] = line.replace("plt.style.use('seaborn')", "plt.style.use('ggplot')  # Using a valid style")
        elif isinstance(cell['source'], str):
            if "plt.style.use('seaborn')" in cell['source']:
                cell['source'] = cell['source'].replace("plt.style.use('seaborn')", "plt.style.use('ggplot')  # Using a valid style")

# Save the modified notebook
with open('notebooks/explainer.ipynb', 'w') as f:
    json.dump(notebook, f, indent=1)

print("Notebook updated successfully!") 