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

Extract the ZIP file and open Terminal inside the extracted project folder.

### 2. Install Dependencies

```bash
npm ci
```

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
