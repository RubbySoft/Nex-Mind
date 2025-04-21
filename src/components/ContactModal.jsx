
import { X } from "lucide-react";
import { useState } from "react";

const ContactModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Form submitted:", formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg animate-fade-in">
        {/* Glass effect container with black background */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-black/50 p-6 shadow-2xl backdrop-blur-md">
          {/* Gradient overlays for glass effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-black/10" />
          
          {/* Content */}
          <div className="relative">
            <button 
              onClick={onClose}
              className="absolute right-0 top-0 rounded-full p-1 text-white/80 transition-colors hover:text-white"
            >
              <X size={20} />
            </button>

            <h2 className="mb-6 text-2xl font-bold text-white">Contact Us</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/50 backdrop-blur-sm focus:border-white/20 focus:outline-none focus:ring-0"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/50 backdrop-blur-sm focus:border-white/20 focus:outline-none focus:ring-0"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/50 backdrop-blur-sm focus:border-white/20 focus:outline-none focus:ring-0"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <textarea
                  placeholder="Your Message"
                  rows={4}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/50 backdrop-blur-sm focus:border-white/20 focus:outline-none focus:ring-0"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-zinc-900 px-6 py-2 text-white transition-transform hover:bg-gray-800 active:scale-[0.98]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactModal;
