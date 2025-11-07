# Fruit Store

Simple Node.js + EJS demo application.

Features:
- Login landing page (modal dialog)
- Home, Products and Add Product pages
- Top navigation with active tab highlighting (green)
- In-memory user store (email: customer@fruitsstore.com, password: test)
- Upload product images to `public/images` using the Add Product page

Quick start:

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm start
```

3. Open http://localhost:3000 in your browser.

Notes:
- Uploaded files are stored in `public/images` and will be served by the app.
- Data is in-memory and will be lost when the server restarts.
# WebFruitStall

# Prompt used
Create a professional looking responsive nodejs website using embedded JavaScript as the frontend.
Name of the site is "Fruit Store".
Use in-memory array to store user data.
The website has a login page, a home site page and a products page.  
The login page is the landing page.
The login page has a dialog window to get user inputs.
There is a navigation bar at the top with a Home page tab, a Products page tab, a "Add Product" tab and a Logout button.
When the tabs on the navigation bar is clicked, the respective tab will be highlighted in green colour.
The Logout button at the right side of the navigation bar will only appear upon successful user login.
User have to log in using "customer@fruitsstore.com" and password "test".  
If login credentials are not correct, it remains at login page. 
On valid user login, the Home page will be shown.
The Home page display a professional looking welcome message.
When the Home tab is clicked, the Home page is displayed.
When "Add Product" tab is clicked, a professional looking "Add Product" page will be displayed.
When the Products tab is clicked, the Products page will display all product images found in the "images" subfolder.
The Products page will scroll if the number of product images is more than screen display.
If Logout button is clicked, it goes back to the Login page.