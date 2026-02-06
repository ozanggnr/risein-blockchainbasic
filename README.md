# User Reputation System

A full-stack web application integrated with the Stellar blockchain to track and verify user reputation scores. This project demonstrates a hybrid Web2/Web3 architecture, bridging traditional database storage with on-chain Soroban smart contracts.

## 🚀 Project Overview

The **User Reputation System** allows users to:
- Register and authenticate via a web interface.
- Perform daily tasks to earn reputation points.
- Connect their **Freighter Wallet** to link their Stellar identity.
- Submit reputation updates directly to the **Stellar Testnet** via a **Soroban Smart Contract**.

**Primary Goal**: To build a verifiable, on-chain reputation history where users own their data.

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router, TypeScript)
- **Styling**: Vanilla CSS Modules (Clean, dependency-free)
- **Blockchain Interaction**: `@stellar/stellar-sdk`, `@stellar/freighter-api`

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (TypeScript)
- **Database**: SQLite (via Prisma ORM) - *Easily switchable to PostgreSQL*
- **Auth**: JWT (JSON Web Tokens)
- **Role**: Relays signed transactions to Stellar Network (Non-custodial)

### Blockchain & Smart Contract
- **Network**: Stellar Testnet
- **Smart Contract Engine**: Soroban (Rust)
- **Wallet**: Freighter (Non-custodial browser extension)

## 🏗 Architecture & Flow

The system uses a **Hybrid Architecture**:

1.  **Identity Management**: Users register via email/password (stored in SQLite).
2.  **Wallet Binding**: Users sign a message/transaction with **Freighter**, linking their Public Stellar Address to their profile in the database.
3.  **Reputation Logic**:
    - **Off-Chain**: Immediate feedback in the UI and database record.
    - **On-Chain**: Users invoke the `add_points` function on the Soroban contract. The transaction is signed in the browser (Freighter) and relayed by the Backend API to the Stellar Network.
4.  **Verification**: The Frontend queries the Smart Contract directly to display the "True" On-Chain Score.

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Freighter
    participant Backend
    participant StellarNet
    participant Contract(Soroban)

    User->>Frontend: Clicks "Daily Check-in"
    Frontend->>Freighter: Request Sign Transaction (add_points)
    Freighter->>User: Approve Transaction?
    User->>Freighter: Approves
    Freighter->>Frontend: Returns Signed XDR
    Frontend->>Backend: POST /contract/submit (Signed XDR)
    Backend->>StellarNet: Submit Transaction
    StellarNet->>Contract(Soroban): Execute add_points(user, 1)
    Contract(Soroban)->>Contract(Soroban): Update Storage
    StellarNet->>Backend: Success
    Backend->>Frontend: Success Response
    Frontend->>Contract(Soroban): get_score(user)
    Contract(Soroban)->>Frontend: Returns Updated Score
```

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- Rust & Cargo (for compiling contracts)
- [Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup)
- [Freighter Wallet Extension](https://www.freighter.app/)

### 1. Smart Contract Deployment
*Note: You must deploy the contract to Testnet to get a Contract ID.*

1.  Navigate to the contract directory:
    ```bash
    cd contracts/reputation
    ```
2.  Build the contract:
    ```bash
    soroban contract build
    ```
3.  Deploy to Testnet:
    ```bash
    # Ensure you have a configured identity
    soroban config identity generate alice
    
    # Deploy
    soroban contract deploy \
      --wasm target/wasm32-unknown-unknown/release/reputation_contract.wasm \
      --source alice \
      --network testnet
    ```
4.  **Copy the Contract ID** output (e.g., `CD...`).

### 2. Backend Setup
1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Setup Environment Variables & Database:
    *`.env` is already configured for local dev (SQLite).*
    ```bash
    npx prisma generate
    npx prisma db push
    ```
4.  Start the Server:
    ```bash
    npm run dev
    ```
    *Server running at `http://localhost:3001`*

### 3. Frontend Setup
1.  Navigate to the client directory:
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Contract ID:
    Create a `.env.local` file in the `client` directory:
    ```bash
    echo "NEXT_PUBLIC_CONTRACT_ID=[YOUR_COPIED_CONTRACT_ID]" > .env.local
    ```
4.  Start the Client:
    ```bash
    npm run dev
    ```
    *Client running at `http://localhost:3000`*

## 📖 Usage Guide

### 1. Registration
- Open `http://localhost:3000`.
- Click **Register** to create a new account.
- Log in to access the Dashboard.

### 2. Connect Wallet
- In the Dashboard, locate the "Stellar Wallet" card.
- Click **Connect Freighter Wallet**.
- Approve the connection in the pop-up.
- **Note**: Ensure your Freighter is set to **Testnet** and funded (use [Stellar Friendbot](https://laboratory.stellar.org/#account-creator?network=test)).

### 3. Earn Reputation
- Click **Daily Check-in** (+1 Point) or **Complete Task** (+5 Points).
- If Wallet is connected:
    - Freighter will prompt you to sign the transaction.
    - Confirm the transaction.
    - Wait a few seconds for network confirmation.
    - The **On-Chain Score** will update automatically.

## 📜 Smart Contract Details

The Soroban contract is a simple state storage contract.

- **Storage**: Persistent storage of `Address -> u32`.
- **Functions**:
    - `add_points(env, user: Address, amount: u32)`: Adds points to the caller's score. Requires user signature/auth.
    - `get_score(env, user: Address) -> u32`: Returns the current score.

## 📂 Project Structure

```
├── client/                 # Next.js Frontend
│   ├── app/                # Pages & Layouts
│   ├── services/           # API & Soroban integration utils
│   └── styles/             # Global styles
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # Request handlers (Auth, User, Wallet, Contract)
│   │   ├── routes/         # API Route definitions
│   │   └── services/       # Business logic abstraction
│   └── prisma/             # Database schema
└── contracts/              # Soroban Smart Contracts
    └── reputation/         # Rust source code
        └── src/            # Contract logic (lib.rs)
```

## 🔒 Security & Best Practices
- **Non-Custodial**: Private keys never touch the backend.
- **Separation of Concerns**: Frontend handles signing; Backend handles relaying.
- **Environment config**: Sensitive IDs are kept in `.env` files (not committed).

---
*Built for the Rise In Project.*
