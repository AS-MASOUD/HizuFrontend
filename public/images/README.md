# Static Images Directory

Place your static image assets (`.png`, `.jpg`, `.jpeg`, `.svg`, `.webp`) here.

### Usage in Next.js

```tsx
import Image from 'next/image';

// Standard HTML img
<img src="/images/example.png" alt="Example" />

// Next.js optimized Image component
<Image src="/images/example.png" alt="Example" width={500} height={300} />
```
