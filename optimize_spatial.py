import json

def optimize_spatial_analysis(notebook_path):
    # Load the notebook
    with open(notebook_path, 'r') as f:
        notebook = json.load(f)
    
    # First, update the data loading cell
    for cell in notebook['cells']:
        if cell['cell_type'] == 'code':
            source = cell['source'] if isinstance(cell['source'], str) else ''.join(cell['source'])
            if 'df = pd.read_csv' in source:
                # Replace with optimized data loading
                cell['source'] = [
                    "# Load only necessary columns to reduce memory usage\n",
                    "columns_to_load = [\n",
                    "    'CRASH DATE', 'CRASH TIME', 'BOROUGH', 'LATITUDE', 'LONGITUDE',\n",
                    "    'NUMBER OF PERSONS INJURED', 'NUMBER OF PERSONS KILLED',\n",
                    "    'VEHICLE TYPE CODE 1', 'VEHICLE TYPE CODE 2',\n",
                    "    'CONTRIBUTING FACTOR VEHICLE 1', 'CONTRIBUTING FACTOR VEHICLE 2'\n",
                    "]\n",
                    "\n",
                    "# Define data types to reduce memory usage\n",
                    "dtypes = {\n",
                    "    'BOROUGH': 'category',\n",
                    "    'VEHICLE TYPE CODE 1': 'category',\n",
                    "    'VEHICLE TYPE CODE 2': 'category',\n",
                    "    'CONTRIBUTING FACTOR VEHICLE 1': 'category',\n",
                    "    'CONTRIBUTING FACTOR VEHICLE 2': 'category',\n",
                    "    'NUMBER OF PERSONS INJURED': 'int8',\n",
                    "    'NUMBER OF PERSONS KILLED': 'int8',\n",
                    "    'LATITUDE': 'float32',\n",
                    "    'LONGITUDE': 'float32'\n",
                    "}\n",
                    "\n",
                    "print(\"Loading the dataset with optimized memory usage...\")\n",
                    "df = pd.read_csv('../Motor_Vehicle_Collisions_-_Crashes_20250512.csv',\n",
                    "                 usecols=columns_to_load,\n",
                    "                 dtype=dtypes,\n",
                    "                 parse_dates=['CRASH DATE'])\n",
                    "\n",
                    "# Convert time strings to datetime.time objects\n",
                    "df['CRASH TIME'] = pd.to_datetime(df['CRASH TIME']).dt.time\n",
                    "\n",
                    "# Calculate severity (more memory efficient)\n",
                    "conditions = [\n",
                    "    df['NUMBER OF PERSONS KILLED'] > 0,\n",
                    "    df['NUMBER OF PERSONS INJURED'] > 2,\n",
                    "    df['NUMBER OF PERSONS INJURED'] > 0\n",
                    "]\n",
                    "choices = ['Fatal', 'Severe', 'Minor']\n",
                    "df['SEVERITY'] = np.select(conditions, choices, default='Property Damage Only')\n",
                    "\n",
                    "# Drop rows with missing coordinates\n",
                    "df = df.dropna(subset=['LATITUDE', 'LONGITUDE'])\n",
                    "\n",
                    "print(\"Dataset Shape:\", df.shape)\n",
                    "print(\"\\nMemory usage:\", df.memory_usage().sum() / 1024**2, \"MB\")\n",
                    "display(df.head())\n"
                ]
                cell['outputs'] = []
                cell['execution_count'] = None
            
            # Update the spatial visualization function
            elif 'def create_spatial_visualizations' in source or 'def analyze_spatial_patterns' in source:
                cell['source'] = [
                    "def create_spatial_visualizations(df, sample_size=10000, chunk_size=50000):\n",
                    "    \"\"\"Create spatial visualizations with optimized performance.\n",
                    "    \n",
                    "    Args:\n",
                    "        df: DataFrame with collision data\n",
                    "        sample_size: Number of points to sample for detailed analysis\n",
                    "        chunk_size: Size of chunks for processing heatmap data\n",
                    "    \"\"\"\n",
                    "    print(\"\\n=== Starting Spatial Visualization ===\")\n",
                    "    print(f\"Total collisions to process: {len(df):,}\")\n",
                    "    \n",
                    "    # Create base map\n",
                    "    print(\"\\n1. Creating base map...\")\n",
                    "    nyc_map = folium.Map(location=[40.7128, -74.0060], zoom_start=11)\n",
                    "    \n",
                    "    # Process heatmap data in chunks\n",
                    "    print(\"\\n2. Creating heatmap layer...\")\n",
                    "    print(\"   This may take a few minutes for large datasets\")\n",
                    "    heat_data = []\n",
                    "    total_chunks = len(df) // chunk_size + (1 if len(df) % chunk_size > 0 else 0)\n",
                    "    \n",
                    "    for chunk_num, i in enumerate(range(0, len(df), chunk_size), 1):\n",
                    "        chunk = df.iloc[i:i+chunk_size]\n",
                    "        heat_data.extend(chunk[['LATITUDE', 'LONGITUDE']].values.tolist())\n",
                    "        \n",
                    "        # Show progress every 10% or for the first and last chunk\n",
                    "        if chunk_num % max(1, total_chunks // 10) == 0 or chunk_num == 1 or chunk_num == total_chunks:\n",
                    "            progress = (chunk_num / total_chunks) * 100\n",
                    "            points_processed = min(chunk_num * chunk_size, len(df))\n",
                    "            print(f\"   Progress: {progress:.1f}% ({points_processed:,}/{len(df):,} points)\")\n",
                    "    \n",
                    "    print(\"   Adding heatmap to map...\")\n",
                    "    HeatMap(heat_data, radius=15).add_to(nyc_map)\n",
                    "    \n",
                    "    # Sample data for detailed markers\n",
                    "    print(\"\\n3. Preparing detailed markers...\")\n",
                    "    if len(df) > sample_size:\n",
                    "        df_sample = df.sample(n=sample_size, random_state=42)\n",
                    "        print(f\"   Using a sample of {sample_size:,} collisions for detailed markers\")\n",
                    "    else:\n",
                    "        df_sample = df\n",
                    "        print(f\"   Using all {len(df):,} collisions for detailed markers\")\n",
                    "    \n",
                    "    # Add a marker cluster layer\n",
                    "    print(\"   Creating marker cluster...\")\n",
                    "    marker_cluster = MarkerCluster(\n",
                    "        options={\n",
                    "            'maxClusterRadius': 50,\n",
                    "            'disableClusteringAtZoom': 16\n",
                    "        }\n",
                    "    ).add_to(nyc_map)\n",
                    "    \n",
                    "    # Add markers for sampled data\n",
                    "    print(\"   Adding individual markers...\")\n",
                    "    total_markers = len(df_sample)\n",
                    "    for idx, row in df_sample.iterrows():\n",
                    "        if (idx + 1) % max(1, total_markers // 5) == 0:  # Show progress every 20%\n",
                    "            progress = ((idx + 1) / total_markers) * 100\n",
                    "            print(f\"   Progress: {progress:.1f}% ({idx + 1:,}/{total_markers:,} markers)\")\n",
                    "            \n",
                    "        # Define color based on severity\n",
                    "        color = {\n",
                    "            'Fatal': 'red',\n",
                    "            'Severe': 'orange',\n",
                    "            'Minor': 'blue'\n",
                    "        }.get(row['SEVERITY'], 'green')\n",
                    "        \n",
                    "        # Create popup content\n",
                    "        popup_text = f\"\"\"\n",
                    "        <b>Date:</b> {row['CRASH DATE'].strftime('%Y-%m-%d')}<br>\n",
                    "        <b>Time:</b> {row['CRASH TIME']}<br>\n",
                    "        <b>Borough:</b> {row['BOROUGH']}<br>\n",
                    "        <b>Injuries:</b> {row['NUMBER OF PERSONS INJURED']}<br>\n",
                    "        <b>Fatalities:</b> {row['NUMBER OF PERSONS KILLED']}<br>\n",
                    "        <b>Vehicle 1:</b> {row['VEHICLE TYPE CODE 1']}<br>\n",
                    "        <b>Vehicle 2:</b> {row['VEHICLE TYPE CODE 2']}<br>\n",
                    "        <b>Factor 1:</b> {row['CONTRIBUTING FACTOR VEHICLE 1']}<br>\n",
                    "        <b>Factor 2:</b> {row['CONTRIBUTING FACTOR VEHICLE 2']}<br>\n",
                    "        \"\"\"\n",
                    "        \n",
                    "        # Add marker to cluster\n",
                    "        folium.CircleMarker(\n",
                    "            location=[row['LATITUDE'], row['LONGITUDE']],\n",
                    "            radius=5,\n",
                    "            color=color,\n",
                    "            fill=True,\n",
                    "            fill_opacity=0.7,\n",
                    "            popup=folium.Popup(popup_text, max_width=300)\n",
                    "        ).add_to(marker_cluster)\n",
                    "    \n",
                    "    # Add a layer control\n",
                    "    print(\"\\n4. Adding layer controls...\")\n",
                    "    folium.LayerControl().add_to(nyc_map)\n",
                    "    \n",
                    "    print(\"\\n=== Map visualization complete! ===\")\n",
                    "    print(\"You can now interact with the map:\")\n",
                    "    print(\"- Use the layer control (top right) to toggle between heatmap and markers\")\n",
                    "    print(\"- Zoom in to see individual markers\")\n",
                    "    print(\"- Click markers for detailed information\")\n",
                    "    return nyc_map\n",
                    "\n",
                    "# Create optimized spatial visualizations\n",
                    "print(\"Generating spatial visualizations...\")\n",
                    "nyc_map = create_spatial_visualizations(df)\n",
                    "nyc_map"
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
        optimize_spatial_analysis(notebook)
        print(f"Successfully optimized spatial analysis in {notebook}")
    except Exception as e:
        print(f"Error optimizing {notebook}: {str(e)}") 