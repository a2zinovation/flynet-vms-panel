VMS Control Panel (React & MUI)This project is a modern, responsive web control panel for a Video Management System (VMS), built using React and Material-UI (MUI). It focuses on providing a clean, Figma-aligned interface for managing cameras, users, groups, patrols, and system settings.✨ Key FeaturesResponsive Layout: Uses MUI Grid and dynamic layout to support both expanded and collapsed sidebar states seamlessly.Dynamic Sidebar Navigation: Sidebar toggles between full width (260px) and collapsed width (68px), correctly pushing the main content aside.MUI Component Fidelity: All primary components (Tables, Cards, Forms, Dialogs) adhere to specific Figma designs using the MUI sx prop for precise visual styling.System Management: Pages for managing Users, Groups, Permissions, Cameras, Alarms, and Mosaics.User Experience: Includes a Profile page, Activity Log, Consumption Calculator, and confirmation dialogs (e.g., Logout).React Router Integration: Uses react-router-dom for navigation, including a dedicated /app protected root and functional breadcrumb links.🚀 Technology StackFrontend Framework: ReactUI Library: Material-UI (MUI) v5+Routing: React Router (v6)Styling: MUI sx Prop (Replicating custom CSS styles)📦 Project Structure OverviewThe application is structured around a main layout and several feature pages:src/
├── components/
│   ├── layout/
│   │   ├── Header.jsx         // Global header with user actions and logout dialog
│   │   └── Sidebar.jsx        // Collapsible navigation menu
├── layouts/
│   └── MainLayout.jsx       // Handles dynamic margin for sidebar responsiveness
└── pages/
    ├── Access.jsx
    ├── ActivityLog.jsx
    ├── Alarms.jsx
    ├── AlarmsRegister.jsx
    ├── Cameras.jsx
    ├── ConsumptionCalculator.jsx
    ├── Groups.jsx
    ├── GroupsRegister.jsx
    ├── Mosaics.jsx
    ├── MyCameras.jsx
    ├── MyMosaics.jsx
    ├── MyPatrols.jsx
    ├── MyVideos.jsx
    ├── NotificationCenter.jsx
    ├── Permissions.jsx
    ├── PermissionsRegister.jsx
    ├── Platform.jsx
    ├── Profile.jsx          // Figma-styled Profile and Security settings
    ├── RTSPs.jsx
    ├── SmartMosaics.jsx
    └── Users.jsx
⚙️ Setup and InstallationClone the repository:git clone [your-repository-url]
cd [project-folder]
Install dependencies:npm install
# or
yarn install
Run the development server:npm run dev
# or
yarn dev
Access the application:Open your browser and navigate to the local development URL (usually http://localhost:3000).Note: This project assumes that external assets (logos, flags, and custom icons) are available in the /assets/ directory.