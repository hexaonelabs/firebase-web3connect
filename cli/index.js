// Run: node cli/index.js path/to/firebase-config.json
import fs from 'node:fs';

// get file path from arguments passed to the script
const filePath = process.argv[2];
console.log(filePath)

// Import the FirebaseOptions object from the file path
try {
  const fileContent = fs.readFileSync(filePath, "utf8");
  // Convert the FirebaseOptions object to a HEX string
  const hex = Buffer.from(fileContent).toString('hex');
  console.log(`
Here is your Firebase Config in HEX:
0x${hex}`);
} catch (error) {
  throw new Error("Invalid file content");
}

