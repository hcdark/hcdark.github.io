import json

def update_notebook(notebook_path):
    # Load the notebook
    with open(notebook_path, 'r') as f:
        notebook = json.load(f)
    
    # Find the data loading cell and update it
    for cell in notebook['cells']:
        if cell['cell_type'] == 'code':
            source = cell['source'] if isinstance(cell['source'], str) else ''.join(cell['source'])
            if 'Create a sample dataset' in source or 'Create a sample dataframe' in source:
                # Replace with CSV loading code
                cell['source'] = [
                    "# Load the full dataset\n",
                    "print(\"Loading the dataset...\")\n",
                    "df = pd.read_csv('../Motor_Vehicle_Collisions_-_Crashes_20250512.csv')\n",
                    "\n",
                    "# Display basic information\n",
                    "print(\"Dataset Shape:\", df.shape)\n",
                    "print(\"\\nColumns:\")\n",
                    "for col in df.columns:\n",
                    "    print(f\"- {col}\")\n",
                    "\n",
                    "# Display first few rows\n",
                    "display(df.head())\n"
                ]
                cell['outputs'] = []
                cell['execution_count'] = None
    
    # Save the modified notebook
    with open(notebook_path, 'w') as f:
        json.dump(notebook, f, indent=1)

# Update both notebooks
notebooks = ['notebooks/explainer.ipynb', 'notebooks/analysis.ipynb']
for notebook in notebooks:
    try:
        update_notebook(notebook)
        print(f"Successfully updated {notebook}")
    except Exception as e:
        print(f"Error updating {notebook}: {str(e)}") 