# Product Fruits NPM SDK

Use this package for Product Fruits installation into NPM environments. This package can be used in browser environments. The package supports TypeScript.

# Instructions

1. Install this package

```
npm install product-fruits --save
```

2. Use this package

```javascript
import { productFruits } from 'product-fruits';

// Call this later in your code; it can be called only once.
// This will load Product Fruits content immediatelly.
// Pass the real username of the current user. Read our docs for more options.
productFruits.init('YOUR PROJECT CODE', 'LANGUAGE CODE', { username: '<<REPLACE>>' });
```

# More docs

Read more at [https://help.productfruits.com/en/article/npm-package](https://help.productfruits.com/en/article/installation-via-npm-package)
