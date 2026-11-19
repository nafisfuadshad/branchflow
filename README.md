# BranchFlow

BranchFlow is an IST 440W student project that helps customers prepare for an in-person bank branch visit.

## Live Application

https://branch-flow-visit.base44.app

## Run BranchFlow from GitHub

### Requirements

- Internet connection
- Node.js 20.19 or newer
- A Base44 account

### 1. Download the Project

From this GitHub repository, click:

**Code → Download ZIP**

After the ZIP finishes downloading, extract it before continuing.

#### Windows

1. Open your **Downloads** folder.
2. Right-click the downloaded BranchFlow ZIP file.
3. Click **Extract All...**
4. Click **Extract**.
5. Open the extracted folder named `branchflow-main`.
6. While you are inside the `branchflow-main` folder, click the **address bar at the top of File Explorer**.

The address bar normally shows something similar to:

`This PC > Downloads > branchflow-main`

7. Click inside the address bar, delete what is there, and type:

```text
powershell
```

8. Press **Enter**.

A PowerShell window will open directly inside the BranchFlow project folder.

9. To confirm you are in the correct folder, type:

```powershell
pwd
```

and press **Enter**.

The displayed path should end with:

```text
branchflow-main
```

#### macOS

1. Open **Terminal**.
2. Type:

```text
cd 
```

Make sure there is one space after `cd`. Do not press Enter yet.

3. Drag the extracted `branchflow-main` folder from Finder into the Terminal window.
4. Press **Enter**.
5. To confirm you are in the correct folder, type:

```bash
pwd
```

and press **Enter**.

The displayed path should end with:

```text
branchflow-main
```

### 2. Install Dependencies

Once PowerShell or Terminal is open inside the `branchflow-main` folder, type:

```bash
npm ci
```

Press **Enter** and wait until the installation finishes before continuing.

### 3. Log in to Base44

```bash
npx base44 login
```

Follow the browser authentication instructions.

### 4. Create and Link a Test Project

```bash
npx base44 link --create --name branchflow-ta-test
```

### 5. Run BranchFlow

```bash
npx base44 dev
```

When the development server starts, open the local URL shown in Terminal.

It will normally look like:

```text
http://localhost:5173/
```

## Main Workflow

Service → ZIP Code → Branch → Documents → Appointment → Review → Confirmation

## Project Notice

BranchFlow is a student prototype and is not affiliated with or endorsed by Wells Fargo. No real banking transaction or appointment is created.

## Author

Nafis Fuad Shad  
Penn State University — IST 440W
