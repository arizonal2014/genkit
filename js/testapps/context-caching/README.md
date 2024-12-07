# Context Caching Test Application

This is a sample application demonstrating the use of **context caching** with Google's Gemini models via the Google Generative AI plugin in Genkit. The application highlights how to efficiently reuse context in large language model interactions.

## Features

- **Context Caching**: Efficiently reuse cached content to improve performance and reduce costs.
- **Supports Large Texts**: Works seamlessly with large texts, such as _War and Peace_ and _Lord of the Rings_.
- **Flexible Model Configuration**: Easily switch between supported Gemini models.

## Installation

To run this application, ensure you have the necessary dependencies installed.

### Prerequisites

- **Node.js** version 20 or higher
- **npm** or **pnpm** for package management

### Install Dependencies

```bash
npm install
```

or

```bash
pnpm install
```

## Scripts

The following scripts are available:

- **`build`**: Compile TypeScript files.
- **`build:watch`**: Watch for changes and recompile TypeScript files.
- **`start`**: Run the compiled application.
- **`dev`**: Start the application in development mode with environment variable setup.
- **`genkit:dev`**: Run the application with `GENKIT_ENV=dev`.

## Configuration

This application uses the Google Generative AI plugin for Genkit. Ensure you have a valid API key for the Gemini API.

### API Key Setup

You can configure the API key in two ways:

1. **Environment Variable**:

   ```bash
   export GOOGLE_GENAI_API_KEY=your_api_key_here
   ```

2. **Inline Configuration** (for testing only, not recommended for production):
   ```ts
   googleAI({ apiKey: yourKey });
   ```

## Usage

### Running the Application

To start the application:

```bash
npm run dev
```

or

```bash
pnpm dev
```

### Sample Flow

The application defines a `lotrFlow` for analyzing _Lord of the Rings_ text. Modify the input file path in the `lotrFlow` definition to test different texts:

```ts
const defaultQuery =
  "Describe Gandalf's relationship with Frodo, referencing Gandalf quotes from the text.";
```

### Output

The output will be generated by the model based on the provided context and query.

## Dependencies

- **@genkit-ai/googleai**: Provides the interface for Google Gemini models.
- **genkit**: Framework for integrating generative models.
- **typescript**: TypeScript support for the application.
- **cross-env**: Cross-platform environment variable setup.

## License

This project is licensed under the ISC License.

---

**Note**: Ensure your API key is managed securely in production environments. Avoid embedding sensitive information directly in your codebase.