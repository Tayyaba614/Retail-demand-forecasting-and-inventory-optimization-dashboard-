# Retail Demand Forecasting & Inventory Optimization Dashboard

A beginner-friendly static web application demonstrating retail inventory monitoring, baseline demand forecasting, and reorder recommendations with sample FMCG data.

## Files
- `index.html`: page structure
- `style.css`: responsive dashboard design
- `script.js`: sample dataset, calculations, charts, search, and CSV export

## Run locally
Open `index.html` in a modern browser. An internet connection is needed to load Chart.js and Google Fonts from their CDNs.

## Deploy on Vercel using GitHub
1. Create/sign in to GitHub.
2. Create a new repository named `retail-demand-forecasting-dashboard`.
3. Upload all three files (`index.html`, `style.css`, `script.js`) to the repository root.
4. Sign in to Vercel with GitHub at https://vercel.com.
5. Choose **Add New → Project**, import the repository, and continue.
6. For this plain HTML/CSS/JavaScript project, choose **Other** if asked for a framework. Leave Build Command blank. Set the output directory to `.` if required.
7. Click **Deploy** and wait for the deployment URL.
8. Open the URL and test product selection, search, and CSV export.
9. If you edit files later and push changes to GitHub, Vercel can deploy the updates automatically.

## Important academic note
This project currently uses illustrative sample data and a simple moving-average-style baseline. It is not a trained machine-learning model. If the assignment requires machine learning, extend it by training a forecasting model such as Random Forest regression or a time-series model in Python, evaluate it using a chronological test set, and connect the model outputs to the dashboard.

## Simplified formulas
- Reorder point = average daily demand × (lead time days + safety stock days)
- Target stock = average daily demand × (lead time days + safety stock days + target cover days)
- Suggested order = max(0, target stock − current stock)

The default example uses 3 lead-time days, 2 safety-stock days, and 7 target-cover days. These are demonstration assumptions, not universal business rules.
