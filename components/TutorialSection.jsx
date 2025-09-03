import React from 'react';

const TutorialSection = () => {
  const tutorialData = {
  "productHandle": "large-bamboo-standing-plant-pot-unique-affordable",
  "video": {
    "url": "https://cdn.shopify.com/videos/c/vp/ecbfe3be21664b488768f97f9a83dba7/ecbfe3be21664b488768f97f9a83dba7.HD-1080p-7.2Mbps-45219464.mp4",
    "title": "Best Plants for Bedroom Setup Tutorial – Watch & Learn!",
    "type": "mp4"
  },
  "steps": [
    {
      "step": 1,
      "title": "Constructing the Large Bamboo Pot",
      "description": "Experience the beginning of your floral creativity with our handcrafted bamboo flower pot. Start by gently inserting a single artificial stem into the central slot. Its smooth interior holds the flower upright without needing additional support.",
      "image": "https://cdn.shopify.com/s/files/1/0605/7974/1763/files/1_d9da831c-eaed-4578-b0c3-93fce3954a7a.png?v=1743672054"
    },
    {
      "step": 2,
      "title": "Creating the Bamboo Flowers and Tall Stems",
      "description": "Build elegance step-by-step. After placing the first flower, insert the second and third stems into the outer slots. This stage allows you to customize your design and balance your setup aesthetically.",
      "image": "https://cdn.shopify.com/s/files/1/0605/7974/1763/files/2_3f1f1dc6-fe56-4494-a5d7-5679a8b23f85.png?v=1743673690"
    },
    {
      "step": 3,
      "title": "Stabilizing the Flower Stems with Foam",
      "description": "Finalize your custom floral design by inserting the remaining stems. This flower pot allows you to create a complete arrangement with up to 5–6 flowers. The structure supports each stem evenly.",
      "image": "https://cdn.shopify.com/s/files/1/0605/7974/1763/files/3_2baa617f-2e80-4a33-9b18-c4e720e3a6a0.png?v=1743673795"
    },
    {
      "step": 4,
      "title": "The Final Touch – A Stylish Display",
      "description": "Now your bamboo flower pot is ready with a full bouquet. This artistic piece not only enhances the visual appeal of your home but is also ideal for restaurants, offices, and kitchen spaces.",
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
};

  return (
    <div className="tutorial-section bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Video Section */}
        {tutorialData.video && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              {tutorialData.video.title}
            </h2>
            <div className="relative w-full h-[220px] md:w-[90vw] md:h-[650px] max-w-none mx-auto rounded-lg overflow-hidden shadow-lg">
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
                playsInline
                preload="metadata"
              >
                <source src={tutorialData.video.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

        {/* Step-by-Step Tutorial */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-center mb-8 text-gray-800">
            House Plants for Sale: DIY Pot Assembly
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {tutorialData.steps.map((step, index) => (
              <div key={step.step} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-semibold text-gray-800 mb-3">
                      {step.title}
                    </h4>
                    {step.image && (
                      <img
                        src={step.image}
                        alt={step.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Promotional Banner */}
        {tutorialData.promotions.length > 0 && (
          <div className="bg-green-600 text-white py-4 px-6 rounded-lg">
            <div className="flex items-center justify-center space-x-8 overflow-hidden">
              {tutorialData.promotions.map((promotion, index) => (
                <div key={index} className="flex-shrink-0 animate-marquee">
                  <span className="text-lg font-medium">{promotion}</span>
                  <span className="mx-4">•</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialSection;
