
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const MenuPreview = () => {
  const menuCategories = [
    {
      name: "Starters",
      image: "https://images.unsplash.com/photo-1577906096429-f73c2c4fec42?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=675&q=80",
      description: "Perfect sharers to start your Irish feast",
    },
    {
      name: "Main Courses",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1049&q=80",
      description: "Traditional Irish dishes with modern flair",
    },
    {
      name: "Drinks",
      image: "https://images.unsplash.com/photo-1571267272658-ebc6c0e79ab5?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80",
      description: "Fine whiskies, beers, and cocktails",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-serif mb-4 text-irish-green">Our Menu</h2>
          <p className="text-gray-600 max-w-xl mx-auto">
            Authentic Irish cuisine prepared with love and tradition. 
            From hearty stews to fresh seafood, our menu offers something for everyone.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {menuCategories.map((category) => (
            <div key={category.name} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="h-60 overflow-hidden">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold font-serif mb-2 text-irish-brown">{category.name}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <Button asChild variant="outline" className="border-irish-green text-irish-green hover:bg-irish-green hover:text-white">
                  <Link to="/menu">Explore {category.name}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Button asChild size="lg" className="bg-irish-gold hover:bg-irish-gold/80 text-irish-green">
            <Link to="/menu">View Full Menu</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MenuPreview;
