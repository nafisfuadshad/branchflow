# BranchFlow

BranchFlow is an IST 440W student project that helps customers prepare for an in-person bank branch visit.

## Live Application

https://branch-flow-visit.base44.app

## Run BranchFlow from GitHub

### Requirements

Before downloading BranchFlow, the computer must have:

- Internet connection
- Node.js 20.19 or newer
- npm
- A Base44 account

### Check Node.js First

Open PowerShell on Windows or Terminal on macOS and run:

```text
node -v
```

Then run:

```text
npm -v
```

Both commands must return version numbers.

If either command says that `node` or `npm` is not recognized or not found, install Node.js first from:

https://nodejs.org/

Download the current LTS version and complete the installation.

After installing Node.js, close PowerShell or Terminal completely, reopen it, and run:

```text
node -v
```

and:

```text
npm -v
```

again to confirm installation.

---

## 1. Download the Project

From this GitHub repository, click:

**Code → Download ZIP**

After the ZIP finishes downloading, extract it before continuing.

### Windows

1. Open the **Downloads** folder.
2. Right-click the downloaded BranchFlow ZIP file.
3. Select **Extract All...**
4. Click **Extract**.
5. Open the extracted folder named `branchflow-main`.
6. While inside the `branchflow-main` folder, click the address bar at the top of File Explorer.
7. Delete the current text in the address bar.
8. Type:

```text
powershell
```

9. Press **Enter**.

PowerShell should open directly inside the BranchFlow project folder.

To confirm the correct folder, type:

```text
pwd
```

and press **Enter**.

The path should end with:

```text
branchflow-main
```

### macOS

1. Open **Terminal**.
2. Type:

```text
cd 
```

Make sure there is one space after `cd`. Do not press Enter yet.

3. Drag the extracted `branchflow-main` folder from Finder into the Terminal window.
4. Press **Enter**.
5. Confirm the correct folder by typing:

```text
pwd
```

and press **Enter**.

The path should end with:

```text
branchflow-main
```

---

## 2. Install Dependencies

Once PowerShell or Terminal is open inside the `branchflow-main` folder, run:

```text
npm ci
```

Wait until the installation finishes before continuing.

---

## 3. Log in to Base44

Run:

```text
npx base44 login
```

A verification code and Base44 login page will appear.

Open the login page in the browser, enter the verification code, sign in to Base44, and approve the authentication.

Wait until PowerShell or Terminal shows:

```text
Authentication completed
```

before continuing.

---

## 4. Create and Link a Test Project

Run:

```text
npx base44 link --create --name branchflow-ta-test
```

Wait until PowerShell or Terminal shows:

```text
Project created successfully
Project linked
```

---

## 5. Run BranchFlow

Run:

```text
npx base44 dev
```

Wait until the frontend finishes starting.

PowerShell or Terminal should display a local address similar to:

```text
http://localhost:5173/
```

Open that address in a web browser.

BranchFlow should now be running locally from the GitHub source code.

---

## Main Workflow

Service → ZIP Code → Branch → Documents → Appointment → Review → Confirmation

## Project Notice

BranchFlow is a student prototype and is not affiliated with or endorsed by Wells Fargo. No real banking transaction or appointment is created.

## Author

Nafis Fuad Shad  
Penn State University — IST 440W
