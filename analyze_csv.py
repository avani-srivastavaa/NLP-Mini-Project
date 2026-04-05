import pandas as pd
from datetime import datetime, timedelta

df = pd.read_csv('datasets/borrowing_history-final.csv')

df['Issue_Date'] = pd.to_datetime(df['Issue_Date'])
df['Return_Date'] = pd.to_datetime(df['Return_Date'])

latest_issue = df['Issue_Date'].max()
latest_return = df['Return_Date'].max()

print(f'Latest Issue Date: {latest_issue}')
print(f'Latest Return Date: {latest_return}')
print(f'Earliest Issue Date: {df["Issue_Date"].min()}')
print(f'Earliest Return Date: {df["Return_Date"].min()}')
print()


start_date_window = datetime(2026, 2, 15).date()
end_date_window = start_date_window + timedelta(days=14)

print(f'Analyzing from {start_date_window} to {end_date_window}')
print()

all_dates = pd.date_range(start=start_date_window, end=end_date_window, freq='D')

issue_by_date = df[(df['Issue_Date'].dt.date >= start_date_window) & (df['Issue_Date'].dt.date <= end_date_window)].groupby(df['Issue_Date'].dt.date).size()
print('Borrows by date:')
print(issue_by_date)
print()

return_by_date = df[(df['Return_Date'].dt.date >= start_date_window) & (df['Return_Date'].dt.date <= end_date_window)].groupby(df['Return_Date'].dt.date).size()
print('Returns by date:')
print(return_by_date)
print()

timeline_data = []
for date in all_dates:
    date_only = date.date()
    borrows = int(issue_by_date.get(date_only, 0))
    returns = int(return_by_date.get(date_only, 0))
    timeline_data.append({
        'date': date_only.isoformat(),
        'borrows': borrows,
        'returns': returns
    })

print('Complete 15-day timeline:')
import json
print(json.dumps(timeline_data, indent=2))
