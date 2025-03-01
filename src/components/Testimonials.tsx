import React from "react";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Happy Customer",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    content:
      "The custom frame I ordered for my wedding photo is absolutely stunning. The craftsmanship is exceptional, and it arrived beautifully packaged. I'll definitely be ordering more for my home!",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Repeat Customer",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    content:
      "I've purchased several gifts from HandmadeHeaven, and each one has been met with joy and amazement. The personalized wooden sign was a hit at my sister's housewarming party!",
    rating: 5,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Interior Designer",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    content:
      "As an interior designer, I'm always looking for unique pieces that tell a story. HandmadeHeaven's products are exactly what my clients love - beautiful, meaningful, and expertly crafted.",
    rating: 5,
  },
];

const Testimonials: React.FC = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            We take pride in creating handcrafted pieces that bring joy to our
            customers. Here's what they have to say about their HandmadeHeaven
            experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-gray-50 rounded-lg p-6 shadow-sm"
            >
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-600 mb-6 italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
