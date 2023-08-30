# 🌐 Automated Server Management and Monitoring System

Automated Server Management and Monitoring System is a web-based application that allows you to automate and monitor remote servers. The project consists of a PowerShell backend and a React frontend, providing a user-friendly interface for various server management tasks.

## ✨ Features

- 🖥️ Monitor remote servers for installed KBs, disk info, and services.
- 📸 Create snapshots for VMs with custom names and descriptions.
- 📂 Manage snapshots, including filtering, selection, and deletion.
- 🚀 Monitor Citrix VDA servers, connected sessions, app deployment, and disk info.
- 📦 Copy files/folders to multiple remote machines simultaneously.
- 🔑 User authentication using domain credentials.

## 🛠️ Installation

1. Clone this repository to your local machine.
2. Navigate to the `PS_Server` directory and run the PowerShell server.
   ```PS_Server
   # Example PowerShell commands
   cd PS_Server
   .\Server.ps1
   or QuickCheck_Server.exe
3. Access the web interface by opening your browser and going to `http://localhost:9097/`.

## 🚀 Front End Development
1. Navigate to the `Quickcheck` directory and install frontend dependencies.
   ```bash
   # Example terminal commands
   cd Quickcheck
   npm install
   ```
2. Start the React frontend.
   ```bash
   # Example terminal command
   npm run dev
   ```
3. Access the web interface by opening your browser and going to `http://localhost:5173`.

## 🚀 Usage

1. Log in using your domain credentials.
2. Navigate through different routes to monitor and manage remote servers and VMs.
3. Use the "Computers" route to view server information.
4. Create new snapshots using the "NewSnap" route.
5. Manage snapshots using the "ManageSnap" route.
6. Monitor Citrix servers and applications through the "Citrix" route.
7. Copy files/folders to remote machines using the "Copy" route.
8. Log out when you're done.

## 🚀 Routes and Functionality

- **Computers Route:**
  - Displays remote server information, installed KBs, disk details, and services.
- **NewSnap Route:**
  - Create new snapshots for VMs with custom names and descriptions.
- **ManageSnap Route:**
  - View and manage VMware snapshots, including filtering and deletion.
- **Citrix Route:**
  - Monitor Citrix VDA servers, connected sessions, and disk information.
  - Search and view information about deployed applications.
- **Copy Route:**
  - Copy files/folders from the local machine to remote machines.
  - Manage copy job statuses.

## 🐞 Bugs and Future Work

- There might be some bugs or issues related to user interactions and data synchronization.
- Future improvements include enhancing the user interface, adding more features, and optimizing performance.

## 🤝 Contributing

Contributions are welcome! To report issues, provide suggestions, or contribute code, please follow the guidelines in [CONTRIBUTING.md](CONTRIBUTING.md).

## 📄 License

This project is licensed under the MIT License. See [LICENSE.md](LICENSE.md) for more details.
```
