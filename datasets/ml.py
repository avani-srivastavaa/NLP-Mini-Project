import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# 1. Load and Prepare Data
df_history = pd.read_csv('borrowing_history-final.csv')
df_students = pd.read_csv('students-final.csv')

# Convert to datetime for time-centric analysis
df_history['Issue_Date'] = pd.to_datetime(df_history['Issue_Date'])
df_history['Month'] = df_history['Issue_Date'].dt.month_name()
df_history['Day_of_Week'] = df_history['Issue_Date'].dt.day_name()
df_history['Is_Overdue'] = df_history['Days_Due'] > 0

# Merge with student info
df_merged = df_history.merge(df_students[['Admission_Number', 'Department']], on='Admission_Number')

# --- VIEW 1: Borrowing Pattern (Time-Series) ---
# Goal: Understand which months require more staff on the floor.
monthly_trend = df_history.groupby(df_history['Issue_Date'].dt.to_period('M')).size().reset_index(name='Count')
monthly_trend['Issue_Date'] = monthly_trend['Issue_Date'].astype(str)

fig_trend = px.line(monthly_trend, x='Issue_Date', y='Count', 
                  title="Monthly Borrowing Volume (Peak Period Analysis)",
                  markers=True, line_shape='spline', template='plotly_dark')

# --- VIEW 2: Overdue Prediction (Day of Week Risk) ---
# Goal: Predict if a book issued on a Friday is more likely to be overdue than one on a Monday.
risk_data = df_merged.groupby('Day_of_Week')['Is_Overdue'].mean().reset_index()
risk_data['Is_Overdue'] *= 100  # Convert to percentage
day_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

fig_risk = px.bar(risk_data, x='Day_of_Week', y='Is_Overdue', 
                 category_orders={"Day_of_Week": day_order},
                 title="Overdue Risk (%) by Issue Day",
                 color='Is_Overdue', color_continuous_scale='Reds',
                 labels={'Is_Overdue': 'Probability of Being Overdue (%)'})

# --- VIEW 3: Operational Heatmap (Dept vs Time) ---
# Goal: Help librarian see which department 'claims' the library at certain times.
heatmap_data = df_merged.groupby(['Department', 'Month']).size().unstack(fill_value=0)

fig_heat = px.imshow(heatmap_data, 
                    labels=dict(x="Month", y="Department", color="Issue Count"),
                    title="Library Activity Heatmap (Operational Hotspots)",
                    color_continuous_scale='Viridis')

# To display these in Streamlit, you would use:
# st.plotly_chart(fig_trend)
# st.plotly_chart(fig_risk)
# st.plotly_chart(fig_heat)

# Save the figures as PNG files
fig_trend.write_image("borrowing_trend.png")
fig_risk.write_image("overdue_risk.png")
fig_heat.write_image("operational_heatmap.png")

print("PNG files have been saved to your folder.")