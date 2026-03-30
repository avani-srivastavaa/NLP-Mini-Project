
  # Library Management System UI

  This is a code bundle for Library Management System UI. The original project is available at https://www.figma.com/design/0l1cQnYIvJO6DC3aEdNDwa/Library-Management-System-UI.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
  
  
  ## frontend structure 
  ```
  .
  ├── ATTRIBUTIONS.md
  ├── .env               //not pushed github things
  ├── index.html
  ├── package.json
  ├── package-lock.json
  ├── postcss.config.mjs
  ├── README.md
  ├── src
  │   ├── app
  │   │   ├── App.tsx
  │   │   ├── components
  │   │   │   ├──figma
  │   │   │   │  └── ImageWithFallback.tsx
  │   │   │   └──ui
  │   │   ├── data
  │   │   │   ├── api.ts
  │   │   │   ├── firebase.ts
  │   │   │   └── mockData.ts
  │   │   ├── pages
  │   │   │   ├── AdminDashboard.tsx
  │   │   │   ├── AdminLogin.tsx
  │   │   │   ├── Home.tsx
  │   │   │   ├── StudentDashboard.tsx
  │   │   │   └── StudentLogin.tsx
  │   │   └── routes.ts
  │   ├── main.tsx
  │   └── styles
  │       ├── fonts.css
  │       ├── index.css
  │       ├── tailwind.css
  │       └── theme.css
  └── vite.config.ts
  ```
  
  example .env
  ```
  VITE_FIREBASE_API_KEY=your_key
  VITE_FIREBASE_AUTH_DOMAIN=your_domain
  VITE_FIREBASE_PROJECT_ID=your_project_id
  VITE_FIREBASE_STORAGE_BUCKET=your_bucket
  VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
  VITE_FIREBASE_APP_ID=your_app_id
  ``'
