// Example usage in your product page
import DynamicTutorialSection from '../components/DynamicTutorialSection';
import { hasTutorialContent } from '../utils/tutorial-utils';

export default function ProductPage({ product }) {
  return (
    <div>
      {/* Your existing product content */}
      
      {/* Conditionally show tutorial section */}
      {hasTutorialContent(product.handle) && (
        <DynamicTutorialSection 
          productHandle={product.handle}
          productTitle={product.title}
          showPromotions={true}
        />
      )}
      
      {/* Rest of your content */}
    </div>
  );
}

// Example: Show tutorial on multiple product pages
export default function ProductList({ products }) {
  return (
    <div>
      {products.map(product => (
        <div key={product.id}>
          <h2>{product.title}</h2>
          {/* Show tutorial if available */}
          {hasTutorialContent(product.handle) && (
            <DynamicTutorialSection 
              productHandle={product.handle}
              productTitle={product.title}
            />
          )}
        </div>
      ))}
    </div>
  );
}
