# @ratio1/ratio1-sdk-ts

A comprehensive SDK for interacting with Ratio1 Edge Node services including **CStore** (distributed key-value store) and **R1FS** (distributed file system).

[![npm version](https://badge.fury.io/js/ratio1-sdk-ts.svg)](https://badge.fury.io/js/ratio1-sdk-ts.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

-   🔄 **Universal Compatibility**: Works in both Node.js and browser environments
-   🚀 **SSR Support**: Full Next.js Server-Side Rendering compatibility
-   📦 **Optimized Bundles**: Separate builds for Node.js and browser with minimal bundle size
-   🔧 **TypeScript Support**: Full TypeScript definitions included
-   🌐 **Environment Configuration**: Flexible configuration via environment variables or direct options
-   🛡️ **Error Handling**: Comprehensive error handling with detailed error messages
-   📁 **File Operations**: Complete file upload/download capabilities with base64 support
-   🔌 **Pluggable HTTP Layer**: Provide custom `fetch` and `FormData` implementations
-   🌐 **Protocol Flexibility**: URLs without a scheme automatically default to `http://`

## Installation

```bash
npm install @ratio1/ratio1-sdk-ts
```

The SDK exports two factory functions:

-   `createRatio1Sdk` for Node.js environments
-   `createRatio1SdkBrowserClient` for browsers or frameworks like Next.js

Both produce the same API surface so you can share code between environments.

## Quick Start

### Node.js Environment

```typescript
import createRatio1Sdk from "@ratio1/ratio1-sdk-ts";

const ratio1 = createRatio1Sdk();

// Store a value (values must be stringified JSON)
await ratio1.cstore.setValue({
	key: "user:123:preferences",
	value: JSON.stringify({ theme: "dark", language: "en" }),
});

// Retrieve the value
const result = await ratio1.cstore.getValue({
	key: "user:123:preferences",
});
console.log(JSON.parse(result.result)); // { theme: 'dark', language: 'en' }
```

### Browser Environment (Next.js, React, etc.)

```typescript
import { createRatio1SdkBrowserClient } from "@ratio1/ratio1-sdk-ts/browser";

const ratio1 = createRatio1SdkBrowserClient();

// Use the same API as Node.js
const status = await ratio1.cstore.getStatus();
```

Both creation functions accept the same options. Use the `verbose` flag to enable debug logging.

```typescript
const ratio1 = createRatio1Sdk({
	verbose: true,
});
```

The SDK also lets you inject a custom `fetch` implementation and `FormData` constructor if needed.

## Configuration

### Environment Variables

The SDK automatically reads configuration from environment variables. These variables are typically injected into the container environment by the Edge Node deployment system:

**Node.js Environment:**

```bash
# These are automatically injected by the Edge Node container environment
export EE_CHAINSTORE_API_URL=http://localhost:31234
export EE_R1FS_API_URL=http://localhost:31235
```

### Next.js Configuration

Run in your application:

```typescript
import { createRatio1SdkBrowserClient } from "@ratio1/ratio1-sdk-ts/browser";

const ratio1 = createRatio1SdkBrowserClient();
```

## API Reference

### CStore Client

CStore provides a distributed key-value store with hash operations.

**Important**: All values must be stringified JSON. The CStore service stores everything as JSON strings, so you need to use `JSON.stringify()` when setting values and `JSON.parse()` when retrieving them.

#### Basic Operations

```typescript
// Get service status
const status = await ratio1.cstore.getStatus();
// Returns: { success: true, result: true, keys?: string[] }

// Set a value (values must be stringified JSON)
await ratio1.cstore.setValue({
	key: "my-key",
	value: JSON.stringify("my-value"),
});
// Returns: { success: true, result: true }

// Get a value
const result = await ratio1.cstore.getValue({
	key: "my-key",
});
// Returns: { success: true, result: '"my-value"' }
// Note: result is a JSON string, parse it to get the actual value
```

#### Hash Operations

```typescript
// Set a hash field (values must be stringified JSON)
await ratio1.cstore.hset({
	hkey: "user:123",
	key: "name",
	value: JSON.stringify("John Doe"),
});

// Get a hash field
const name = await ratio1.cstore.hget({
	hkey: "user:123",
	key: "name",
});
// Returns: { success: true, result: '"John Doe"' }
// Note: result is a JSON string, parse it to get the actual value

// Get all hash fields
const allFields = await ratio1.cstore.hgetall({
	hkey: "user:123",
});
// Returns: { success: true, result: { keys: ['name', 'email', 'age'] } }
```

#### Advanced Usage Examples

```typescript
// Store complex objects (must be stringified)
await ratio1.cstore.setValue({
	key: "user:123:profile",
	value: JSON.stringify({
		name: "John Doe",
		email: "john@example.com",
		preferences: {
			theme: "dark",
			notifications: true,
		},
	}),
});

// Store arrays (must be stringified)
await ratio1.cstore.setValue({
	key: "user:123:posts",
	value: JSON.stringify(["post1", "post2", "post3"]),
});

// Hash operations for user data (values must be stringified)
await ratio1.cstore.hset({
	hkey: "user:123",
	key: "name",
	value: JSON.stringify("John"),
});
await ratio1.cstore.hset({
	hkey: "user:123",
	key: "email",
	value: JSON.stringify("john@example.com"),
});
await ratio1.cstore.hset({
	hkey: "user:123",
	key: "age",
	value: JSON.stringify(30),
});

// Retrieve all user data
const userData = await ratio1.cstore.hgetall({ hkey: "user:123" });
```

### R1FS Client

R1FS provides a distributed file system with upload and download capabilities.

#### File Upload

```typescript
// Upload a file using FormData (browser)
const fileInput = document.getElementById("file") as HTMLInputElement;
const file = fileInput.files[0];

const formData = new FormData();
formData.append("file", file);
formData.append("filename", file.name);
formData.append("secret", "optional-secret-key");

const uploadResult = await ratio1.r1fs.addFile({ formData });
// Returns: { success: true, result: { message: 'File uploaded', cid: 'QmHash...' } }

// Upload using base64 (works in both Node.js and browser)
const base64Data = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...";
const uploadResult = await ratio1.r1fs.addFileBase64({
	file_base64_str: base64Data,
	filename: "image.png",
	secret: "optional-secret-key",
});
```

#### Streaming Uploads (Node.js & Next.js)

```typescript
import fs from "node:fs";
import createRatio1Sdk from "@ratio1/ratio1-sdk-ts";

const ratio1 = createRatio1Sdk();

const stream = fs.createReadStream("/tmp/report.csv");

const upload = await ratio1.r1fs.addFile({
	file: stream,
	filename: "report.csv",
	contentType: "text/csv",
	secret: process.env.R1FS_SECRET,
});

console.log(upload.cid);
```

```typescript
// app/api/upload/route.ts (Next.js App Router)
import { NextRequest, NextResponse } from "next/server";
import { Readable } from "node:stream";
import createRatio1Sdk from "@ratio1/ratio1-sdk-ts";

export async function POST(req: NextRequest) {
	const form = await req.formData();
	const file = form.get("file");

	if (!(file instanceof File)) {
		return NextResponse.json(
			{ error: "file field missing" },
			{ status: 400 }
		);
	}

	const ratio1 = createRatio1Sdk();
	const readable = Readable.fromWeb(file.stream());

	const result = await ratio1.r1fs.addFile({
		file: readable,
		filename: file.name,
		contentType: file.type,
		secret: form.get("secret")?.toString(),
	});

	return NextResponse.json({ cid: result.cid });
}
```

#### File Download

```typescript
// Download file as blob/response
const fileResponse = await ratio1.r1fs.getFile({
	cid: "QmHash...",
	secret: "optional-secret-key", // if file was uploaded with secret
});

// For browser: create download link
const blob = await fileResponse.blob();
const url = URL.createObjectURL(blob);
const a = document.createElement("a");
a.href = url;
a.download = "filename.ext";
a.click();

// Download as base64
const base64Result = await ratio1.r1fs.getFileBase64({
	cid: "QmHash...",
	secret: "optional-secret-key",
});
// Returns: { file_base64_str: 'data:image/png;base64,...', filename: 'image.png' }
```

#### Service Status

```typescript
// Check R1FS service status
const status = await ratio1.r1fs.getStatus();
// Returns: { EE_ID: 'edge-node-id', ... }
```

#### Complete File Management Example

```typescript
// Upload multiple files
async function uploadFiles(files: File[]) {
	const uploadPromises = files.map(async (file) => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("filename", file.name);

		return await ratio1.r1fs.addFile({ formData });
	});

	const results = await Promise.all(uploadPromises);
	return results.map((r) => r.result.cid);
}

// Download and display image
async function displayImage(cid: string) {
	const response = await ratio1.r1fs.getFile({ cid });
	const blob = await response.blob();
	const url = URL.createObjectURL(blob);

	const img = document.createElement("img");
	img.src = url;
	document.body.appendChild(img);
}
```

## Error Handling

The SDK provides comprehensive error handling:

```typescript
try {
	const result = await ratio1.cstore.getValue({ key: "non-existent-key" });
	console.log(result.result);
} catch (error) {
	if (error.message.includes("404")) {
		console.log("Key not found");
	} else if (error.message.includes("500")) {
		console.log("Server error");
	} else {
		console.log("Network error:", error.message);
	}
}
```

## Bundle Size Optimization

The package is optimized for different environments:

| Environment | Bundle Size | Dependencies                    |
| ----------- | ----------- | ------------------------------- |
| **Node.js** | ~50KB       | Includes cross-fetch, form-data |
| **Browser** | ~15KB       | Uses native APIs only           |

### Tree Shaking

The package is marked as `sideEffects: false`, enabling optimal tree shaking:

```typescript
// Only CStore functionality will be included
import { CStoreClient } from "@ratio1/ratio1-sdk-ts";

// Only R1FS functionality will be included
import { R1FSClient } from "@ratio1/ratio1-sdk-ts";
```

## Development

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd ratio1-sdk-ts

# Install dependencies
npm install

# Build for both Node.js and browser
npm run build

# Run tests
npm test

# Run specific test suites
npm run test:e2e:cstore
npm run test:e2e:r1fs
```

### Testing

```bash
# Run all tests
npm test

# Run specific test files
npm test -- src/__tests__/cstoreClient.test.ts
npm test -- src/__tests__/r1fsClient.test.ts

# Run end-to-end tests
npm run test:e2e:cstore
npm run test:e2e:r1fs
```

## Examples

### Next.js Application

```typescript
// pages/api/upload.ts
import createRatio1Sdk from "@ratio1/ratio1-sdk-ts";

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" });
	}

	const ratio1 = createRatio1Sdk();

	try {
		// Store metadata (must be stringified)
		await ratio1.cstore.setValue({
			key: `upload:${Date.now()}`,
			value: JSON.stringify({
				filename: req.body.filename,
				size: req.body.size,
				uploadedAt: new Date().toISOString(),
			}),
		});

		res.status(200).json({ success: true });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}
```

### React Component

```typescript
// components/FileUpload.tsx
import { createRatio1SdkBrowserClient } from "@ratio1/ratio1-sdk-ts/browser";
import { useState } from "react";

export function FileUpload() {
	const [uploading, setUploading] = useState(false);
	const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);

	const ratio1 = createRatio1SdkBrowserClient();

	const handleUpload = async (files: FileList) => {
		setUploading(true);

		try {
			const uploadPromises = Array.from(files).map(async (file) => {
				const formData = new FormData();
				formData.append("file", file);
				formData.append("filename", file.name);

				const result = await ratio1.r1fs.addFile({ formData });
				return result.result.cid;
			});

			const cids = await Promise.all(uploadPromises);
			setUploadedFiles((prev) => [...prev, ...cids]);
		} catch (error) {
			console.error("Upload failed:", error);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div>
			<input
				type="file"
				multiple
				onChange={(e) => e.target.files && handleUpload(e.target.files)}
				disabled={uploading}
			/>
			{uploading && <p>Uploading...</p>}
			{uploadedFiles.length > 0 && (
				<div>
					<h3>Uploaded Files:</h3>
					<ul>
						{uploadedFiles.map((cid, index) => (
							<li key={index}>{cid}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
```

## Browser Compatibility

-   **Modern Browsers**: Chrome 60+, Firefox 55+, Safari 11+, Edge 79+
-   **Node.js**: 14.0+
-   **Next.js**: 12.0+
-   **React**: 16.8+

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

-   📖 **Documentation**: This README and inline code comments
-   🐛 **Issues**: [GitHub Issues](https://github.com/Ratio1/ratio1-sdk-ts/issues)
