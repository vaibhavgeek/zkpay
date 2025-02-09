# ZKPay

Receive payments anonymously from anyone using zero-knowledge proofs.

## Overview

ZKPay enables private transactions through a link-based system. Users can create payment links that recipients can use to claim funds without revealing their identity. The system uses zero-knowledge proofs to ensure privacy and security.

## Features

- Generate anonymous payment links
- Secure withdrawals using ZK-SNARKs
- Support for Aurora and Polygon networks
- Privacy-preserving transactions
- Double-spend protection

## Quick Start

### Prerequisites

- Node.js
- Yarn
- Hardhat

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd zkpay
```

2. Install dependencies and build circuits:
```bash
yarn
yarn run circuit:build
yarn run build
```

### Deployment

Deploy to Aurora Testnet:
```bash
npx hardhat run scripts/deploy.ts --network auroraDev
```

Deploy to Polygon Mumbai:
```bash
npx hardhat run scripts/deploy.ts --network polygonMumbai
```

Verify contracts on Polygon Mumbai:
```bash
npx hardhat verify --network polygonMumbai [CONTRACT_ADDRESS]
```

### Running the Frontend

```bash
cd frontend
yarn 
yarn dev
```

The application will be available at `http://localhost:3000`

## Technical Details

- Built with Circom 2.0.0
- Uses Poseidon hash function for efficient on-chain verification
- Implements Merkle tree for commitment storage
- Withdrawal circuit prevents double-spending

## Security Considerations

- Keep payment links private
- Clear browser history after withdrawing
- Wait for sufficient block confirmations
- Use secure communication channels for sharing links

## Networks

- Aurora Testnet (auroraDev)
- Polygon Mumbai Testnet

## License

MIT License

Copyright (c) 2024

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Disclaimer

This is experimental software. Use at your own risk.
