import React, { useRef, useState, useEffect } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

// Step Item Component (matching original StepTutorial design)
const StepItem = ({ step, index, onVisibleChange, isVisible }) => {
  const ref = useRef();
  const inView = useInView(ref, { threshold: 0.5 });
  const controls = useAnimation();

  useEffect(() => {
    onVisibleChange(index, inView);
    if (inView) controls.start("visible");
    else controls.start("hidden");
  }, [inView, controls, index, onVisibleChange]);

  const imageAnimation = {
    hidden: { opacity: 0, x: index % 2 === 0 ? -200 : 200 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, ease: "easeOut" },
    },
  };

  const textAnimation = {
    hidden: { opacity: 0, x: index % 2 === 0 ? 200 : -200 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.25, ease: "easeOut" },
    },
  };

  return (
    <div
      ref={ref}
      
      className="relative flex flex-col md:flex-row items-center gap-6 mb-20 z-20 w-full"
    >
      {/* Step Number Circle */}
      <div className="absolute left-1/2 -top-1 transform -translate-x-1/2 z-30 hidden md:flex">
        <motion.div
          className="rounded-full bg-black font-bold flex items-center justify-center"
          initial={{ scale: 1 }}
          animate={{ scale: isVisible ? 1.4 : 0.8 }}
          transition={{ duration: 0.3 }}
          style={{
            width: isVisible ? 28 : 20,
            height: isVisible ? 28 : 20,
            fontSize: "0.75rem",
            color: "rgb(184,134,11,1)",
          }}
        >
          {step.step}
        </motion.div>
      </div>
  {/* Image Section */}
  <motion.div
    initial="hidden"
    animate={controls}
    variants={imageAnimation}
    className={`w-full md:w-1/2  ${index % 2 === 0 ? "md:order-1" : "md:order-2"}`}
  >
    <img
      src={step.image}
      alt={step.title}
      className="w-[600px] h-[450px] md- h-[370px] px-6 max-w-full  rounded-xl"
    />
  </motion.div>

  {/* Text Section */}
  <motion.div
    initial="hidden"
    animate={controls}
    variants={textAnimation}
    className={`w-full md:w-1/2 px-4 md:px-8 text-center md:text-left ${
      index % 2 === 0 ? "md:order-2" : "md:order-1"
    }`}
  >
    <h3 className=" sm:text-lg text-[18px] md:text-3xl font-dm font-semibold mb-2">
      {step.title}
    </h3>
    <p className="text-[17px] px5 font-jost font-semibold text-[#3D3434] leading-relaxed my-2 ">

      {step.description}
    </p>
  </motion.div>
</div>
    
  );
 }  
// Tutorial content database for all 4 products
const tutorialDatabase = {
  "large-bamboo-standing-plant-pot-unique-affordable": {
    "video": {
      "url": "https://cdn.shopify.com/videos/c/vp/ecbfe3be21664b488768f97f9a83dba7/ecbfe3be21664b488768f97f9a83dba7.HD-1080p-7.2Mbps-45219464.mp4",
      "title": "Large Bamboo Pot Assembly Tutorial",
      "type": "mp4"
    },
    "steps": [
      {
        "step": 1,
        "title": "Step 1: Constructing the Large Bamboo Pot",
        "description": "Experience the beginning of your floral creativity with our handcrafted bamboo flower pot. Start by gently inserting a single artificial stem into the central slot. Its smooth interior holds the flower upright without needing additional support. The curved design offers stability while giving a soft, modern touch to your space. Ideal for first-time decorators or those trying minimal indoor setups. Enjoy experimenting with placements. Our design allows you to change flowers anytime with ease.",
        "image": "https://cdn.shopify.com/s/files/1/0605/7974/1763/files/1_d9da831c-eaed-4578-b0c3-93fce3954a7a.png?v=1743672054"
      },
      {
        "step": 2,
        "title": "Step 2: Creating the Bamboo Flowers and Tall Stems",
        "description": "Build elegance step-by-step. After placing the first flower, insert the second and third stems into the outer slots. This stage allows you to customize your design and balance your setup aesthetically. The pot's wide rim gives you flexibility to angle each stem for a perfect look. Our eco bamboo material ensures both lightweight handling and long-term use. Perfect for anyone wanting to bring nature-inspired decor indoors.",
        "image": "https://cdn.shopify.com/s/files/1/0605/7974/1763/files/2_3f1f1dc6-fe56-4494-a5d7-5679a8b23f85.png?v=1743673690"
      },
      {
        "step": 3,
        "title": "Step 3: Stabilizing the Flower Stems with Foam",
        "description": "Finalize your custom floral design by inserting the remaining stems. This flower pot allows you to create a complete arrangement with up to 5 – 6 flowers. The structure supports each stem evenly, maintaining visual balance. Perfect for tabletops, kitchen corners, or entryways. The handcrafted bamboo design complements modern and rustic interiors. Enjoy decorating freely without any mess or maintenance.",
        "image": "https://cdn.shopify.com/s/files/1/0605/7974/1763/files/3_2baa617f-2e80-4a33-9b18-c4e720e3a6a0.png?v=1743673795"
      },
      {
        "step": 4,
        "title": "Step 4: The Final Touch – A Stylish Display",
        "description": "Now your bamboo flower pot is ready with a full bouquet. This artistic piece not only enhances the visual appeal of your home but is also ideal for restaurants, offices, and kitchen spaces. Whether placed on a desk or corner shelf, it gives a touch of green without any upkeep. You can easily change flowers based on mood or season. Customize, decorate, and bring nature to your interiors Order now and transform your space.",
        "image": "https://cdn.shopify.com/s/files/1/0605/7974/1763/files/4_acd518b5-bb47-4046-94ff-7d6d0f7b372d.png?v=1743673843"
      }
    ],
    "promotions": [
      "Free Delivery Across Pakistan",
      "Off Indoor Plant Pots 15%",
      "Style Your Room with Ease",
      "Best Pots at Best Prices",
      "Nationwide Delivery Included",
      "!Order Big Pots Today"
    ]
  },
  "1-unique-bamboo-wall-hanging-affordable-home-wall-art-decor-in-small-sizes-for-living-areas": {
    "video": {
      "url": "https://cdn.shopify.com/videos/c/vp/ecbfe3be21664b488768f97f9a83dba7/ecbfe3be21664b488768f97f9a83dba7.HD-1080p-7.2Mbps-45219464.mp4",
      "title": "Bamboo Wall Hanging Setup Tutorial",
      "type": "mp4"
    },
    "steps": [
      {
        "step": 1,
        "title": "Step 1: Preparing the Materials – Bamboo and Wooden Elements",
        "description": "Elevate your walls with eco-friendly bamboo hanging art. Perfect for homes, kitchens, bedrooms, guest areas, and offices, its natural texture brings calm and rustic elegance to any setting. Ideal for kitchen wall decor, home goods wall decor, and exterior wall art, it blends beautifully with every theme. Handcrafted with care, it’s a sustainable choice for modern interiors. Order today and transform your walls with nature’s charm.",
        "image": "/images/1_large_hanging_steps.png"
      },
      {
        "step": 2,
        "title": "Step 2: Customizing the Hanging Wall Decor",
        "description": "Begin customizing your bamboo wall by placing the first leaf stick into the front top hole. Hold it gently and press it in. This is the first step toward a natural, handmade design. It sets the tone for a rustic and earthy wall style. Ideal for bedroom wall decor, big wall decor, and unique wall hanging looks. A small step that begins a big transformation.",
        "image": "/images/2_large_hanging_steps.png"
      },
      {
        "step": 3,
        "title": "Step 3: Balance Your Wall Art",
        "description": "Insert the second bamboo leaf stick into the remaining front hole. Gently push it until balanced with the first. Now your bamboo piece looks complete and symmetrical. Ideal for guest room wall decor, huge wall art, and cozy living room art. This step finishes the design with harmony and handcrafted elegance",
        "image": "/images/3_large_hanging_steps.png"
      },
      {
        "step": 4,
        "title": "Step 4: Ready to Hang, Ready to Inspire",
        "description": "Now that your bamboo wall decor is customized, it’s ready to hang. Use the back hole to mount it with a hook or nail. Great for wall art for bedroom, interior bamboo decoration, and adding a natural feel to modern spaces. It brings a peaceful, eco-conscious look to any wall in your home, office, or guest room.",
        "image": "/images/4_large_hanging_steps.png"
      }
    ],
    "promotions": [
      "Free Shipping on Home Artwork",
      "&nbsp;!Off – Limited Time Only 15%",
      "Shop Unique Wall Pieces Today",
      "!Discounted Home Art – Hurry",
      "!Nationwide Free Delivery",
      "Order Now – Deal Ends Soon!"
    ]
  },
  "small-bamboo-flower-pot-with-stand-stylish-indoor-artificial-pot": {
    "video": {
      "url": "https://cdn.shopify.com/videos/c/vp/ecbfe3be21664b488768f97f9a83dba7/ecbfe3be21664b488768f97f9a83dba7.HD-1080p-7.2Mbps-45219464.mp4",
      "title": "Small Bamboo Pot Assembly Guide",
      "type": "mp4"
    },
    "steps": [
      {
        "step": 1,
        "title": "Step 1: Assembling the Small Bamboo Pot",
        "description": "Begin your floral setup by placing the first artificial flower into the bamboo flower pot. This compact pot features a smooth foam base inside, allowing the flower to insert smoothly and stay upright. Its natural bamboo design offers elegance and functionality for small spaces. Ideal for bedrooms or kitchen corners, this piece brings a minimalist floral touch without mess. Simply pick your flower and press it gently into the center; the interior base adjusts automatically. Perfect for those seeking low-maintenance flower pots that fit anywhere easily.",
        "image": "https://cdn.shopify.com/s/files/1/0605/7974/1763/files/1_a4239ae7-1168-4daf-8af5-11741ebb7d52.png?v=1743665378"
      },
      {
        "step": 2,
        "title": "Step 2: Crafting the Bamboo Flowers and Stems",
        "description": "After the first stem, continue building your arrangement by adding 2–3 more stems. The small size of this flower pot makes it easy to manage and position stems at different angles. Its open-top design offers visibility and flexibility for creative arrangements. Whether you're decorating a guest room or dining shelf, you can easily personalize your setup. The foam inside allows you to reposition stems whenever needed. With each addition, your mini flower pot turns into a lovely decor piece full of charm.",
        "image": "https://cdn.shopify.com/s/files/1/0605/7974/1763/files/2_f97fca3f-a139-4e47-872d-d0948a231eea.png?v=1743665438"
      },
      {
        "step": 3,
        "title": "Step 3: Securing the Flowers with Foam",
        "description": "Complete your display by adding the final stems and adjusting their positions. The foam base keeps each flower steady, while the open bamboo frame adds a light, airy feel. As seen from above, the arrangement looks full and symmetrical, making it ideal for centerpieces or shelf decor. Whether you use five or six flowers, the structure balances them well. Perfect for those wanting to create impressive-looking flower pots without any soil or water. Small in size but big in charm.",
        "image": "https://cdn.shopify.com/s/files/1/0605/7974/1763/files/3_e1e2630a-4069-422f-b7f0-c6bc5623289b.png?v=1743665486"
      },
      {
        "step": 4,
        "title": "Step 4: The Final Touch – A Stylish Display",
        "description": "Your bamboo flower pot is now beautifully complete. Compact yet stylish, this arrangement fits perfectly on bedroom tables, guest room shelves, or kitchen counters. No watering, no mess—just long-lasting beauty. Easily removable stems make it reusable for different moods or seasons. Its lightweight nature lets you shift it from space to space. Whether used in a home or a small café corner, it adds warmth and elegance. Order now to experience simplicity with sophistication in every corner.",
        "image": "https://cdn.shopify.com/s/files/1/0605/7974/1763/files/4_9a1c3bbb-ed3d-40e4-b198-5e260a9fb9f4.png?v=1743665562"
      }
    ],
    "promotions": [
      "Free Shipping on Small Pots",
      "Flat 15% Off – Limited Offer",
      "Style Your Room with Ease",
      "Best Pots at Best Prices",
      "Nationwide Delivery Included",
      "!Order Small Pots Today"
    ]
  },
  "small-bamboo-hanging-with-stand-stylish-home-wall-art-decor": {
    "video": {
      "url": "https://cdn.shopify.com/videos/c/vp/ecbfe3be21664b488768f97f9a83dba7/ecbfe3be21664b488768f97f9a83dba7.HD-1080p-7.2Mbps-45219464.mp4",
      "title": "Small Bamboo Hanging Setup Tutorial",
      "type": "mp4"
    },
    "steps": [
      {
        "step": 1,
        "title": "Step 1: Initial Setup – Choosing Bamboo and Twig",
        "description": "This small bamboo hanging wall is the perfect blend of simplicity, function, and affordability. Designed to be both a tabletop decor and wall-hanging piece, it enhances small spaces with natural elegance. You can hang it using the back hole on any wall — whether in a kitchen, bedroom, office, or even a stylish entryway decoration. Thanks to its flat base, it also sits beautifully on dining tables, kitchen shelves, or office desks. It's lightweight, handmade, and ideal for those looking for affordable wall art with a natural vibe. A budget-friendly yet aesthetic solution to decorate smartly.",
        "image": "https://cdn.shopify.com/s/files/1/0605/7974/1763/files/1_0df71492-1aff-4f6f-beca-f2c5a8de619a.png?v=1743657343"
      },
      {
        "step": 2,
        "title": "Step 2: Assembling the Hanging Wall Art",
        "description": "To customize your small bamboo hanging wall, begin by removing the bamboo leaf from its packaging and holding it gently in one hand. Notice the front hole on the top of the bamboo — simply align the leaf's stick with this hole and insert it slowly by hand. The design is so well balanced that the bamboo leaf auto-adjusts without any pressure. No glue, no tools — just hands and harmony. This handcrafted process brings life to your affordable wall art and makes it suitable for spaces like cozy guest rooms or stylish entryways. A simple upgrade that looks premium.",
        "image": "https://cdn.shopify.com/s/files/1/0605/7974/1763/files/2_dc18fffc-c386-4701-b2cf-1de6e6f78800.png?v=1743657413"
      },
      {
        "step": 3,
        "title": "Step 3: Ready to Hang on Any Wall",
        "description": "Now that the bamboo leaf is inserted, your small hanging wall is ready to be displayed. Use the center hole located at the back of the bamboo structure to hang it using a simple nail or hook. Whether you're decorating a hallway, bedroom, living room, or a stylish entryway, this piece fits easily and safely. The balanced weight ensures stability and elegance. It's perfect for those looking for affordable wall art with premium results, ready to upgrade any space.",
        "image": "https://cdn.shopify.com/s/files/1/0605/7974/1763/files/3_89bf615a-f1aa-436d-9aa8-0dd3acd98006.png?v=1743657629"
      },
      {
        "step": 4,
        "title": "Step 4: Tabletop Elegance – Natural Beauty for Every Surface",
        "description": "One of the key features of this small bamboo piece is its flat bottom, allowing you to place it on any surface with ease. Set it beautifully on a dining table, kitchen slab, office desk, or even in a reception space at a café or restaurant. It adds a graceful bamboo charm without needing to be hung. It's an ideal option for people looking for affordable wall art that also works as tabletop bamboo decor. Small in size, big in impression — a piece that speaks nature on any table.",
        "image": "https://cdn.shopify.com/s/files/1/0605/7974/1763/files/5_10680445-f361-4f40-871f-2cc328f714a5.png?v=1744354591"
      }
    ],
    "promotions": [
      "Free Shipping on Wall Art",
      "15% Off Limited Time",
      "Style Your Home Today",
      "Best Wall Decor Prices",
      "Nationwide Free Delivery",
      "Order Now – Limited Stock!"
    ]
  }
};

const DynamicTutorialSection = ({ productHandle, productTitle, showPromotions = true }) => {
  console.log('DynamicTutorialSection props:', { productHandle, productTitle });
  
  const tutorialData = tutorialDatabase[productHandle];
  console.log('Tutorial data found:', tutorialData);
  
  // If no tutorial data exists for this product, don't render anything
  if (!tutorialData) {
    console.log('No tutorial data found for handle:', productHandle);
    return null;
  }

  const [visibleSteps, setVisibleSteps] = useState({});
  const [isMuted, setIsMuted] = useState(true);
  const stepsSectionRef = useRef(null);
  const [stemFill, setStemFill] = useState(0); // 0 to 1

  const handleVisibleChange = (index, isVisible) => {
    setVisibleSteps((prev) => {
      if (prev[index] === isVisible) return prev;
      return { ...prev, [index]: isVisible };
    });
  };

  // Scroll progress for stem fill
  useEffect(() => {
    const handleScroll = () => {
      if (!stepsSectionRef.current) return;
      const rect = stepsSectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = rect.height;
      // Calculate how much of the section is in view
      let progress = 0;
      // Make the fill faster by increasing the sensitivity
      // Instead of dividing by (windowHeight + totalHeight), divide by (totalHeight * 0.6) for a faster fill
      const fastFactor = 0.9;
      if (rect.top >= windowHeight) progress = 0;
      else if (rect.bottom <= 0) progress = 1;
      else {
        progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / (totalHeight * fastFactor)));
      }
      setStemFill(progress);
    };
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll();
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="tutorial-section ">
      {/* Video Section - Matching original VideoPlayer design */}
        {tutorialData.video && (
        <div className="w-full py-12 text-center">
          {/* Title with Framer Motion animation */}
         
          <motion.h2
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-[20px] sm:text-[22px] md:text-[26px] lg:text-[30px] font-bold text-[#000000] font-dm px-4"
            >
            {productTitle || 'Product Assembly Guide'} - Watch & Learn!
          </motion.h2>
          <div className="text-3xl mt-5 mb-6 animate-bounce">⬇️</div>

          {/* Video Player */}
          <div className="relative w-full h-[220px] md:w-[90vw] md:h-[650px] rounded-xl overflow-hidden shadow-xl mx-auto">
              <video
              className="absolute top-0 left-0 w-full h-full object-cover"
                controls
                autoPlay
              muted={isMuted}
                playsInline
                preload="metadata"
              >
                <source src={tutorialData.video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

      {/* Step-by-Step Tutorial - Matching original StepTutorial design */}
        {tutorialData.steps && tutorialData.steps.length > 0 && (
        <section ref={stepsSectionRef} className="mt-12 pt-2 pb-0 sm:py-2 w-full relative">
          {/* Title with animation and spacing */}
          <div className='text-center '>
        
          <motion.h2
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-[25px] sm:text-[22px] mb-0 md:mb-6 lg:mb-10 -mt-10 md:text-[26px] lg:text-[30px] font-bold text-[#000000] font-dm px-4"
          >
            {tutorialData.video.title}

          </motion.h2>

       
          {/* Down Arrow Icon */}
          </div>
          {/* Center Line (Desktop only) */}
          <div className="absolute left-[calc(50%-1px)] top-[44px] bottom-[170px] w-[2px] bg-gray-300 z-0 hidden md:block" />
          {/* Black fill overlay */}
          <div
            className="absolute left-[calc(50%-1px)] top-[44px] w-[2px] bg-black z-10 hidden md:block transition-all duration-300"
            style={{
              height: `calc((100% - 44px - 170px) * ${stemFill})`,
              minHeight: 0,
              maxHeight: 'calc(100% - 44px - 170px)',
            }}
          />

          {/* Steps */}
          <div className="relative  text-[15px]  z-20 w-[90vw] mx-auto">
              {tutorialData.steps.map((step, index) => (
              <StepItem
                key={index}
                step={step}
                index={index}
                isVisible={visibleSteps[index] || false}
                onVisibleChange={handleVisibleChange}
              />
            ))}
          </div>
        </section>
        )}

      {/* Promotional Banner - Polished Design */}
      
    </div>
  );
};

export default DynamicTutorialSection;