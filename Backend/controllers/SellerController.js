const Service = require('../models/service');

// Add a new service
const addService = async (req, res) => {
  console.log("Adding service with body:", req.body);
  try {
    const {
      name,
      stock,
      description,
      category,
      images, // ✅ match frontend's 'images'
      seller,
      originalPrice,
      reducedPrice,
      dummysellerSharePercent,
      sellerSharePercent
    } = req.body;

    const newService = new Service({
      name,
      stock,
      description,
      category,
      images, // ✅ saving 'images' array
      seller,
      originalPrice,
      reducedPrice,
      sellerSharePercent,
      dummysellerSharePercent
    });

    await newService.save();
    res.status(201).json({ message: "Service added successfully", service: newService });

  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};



const removeService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    if (!serviceId) {
      return res.status(400).json({ message: "Service ID is required" });
    }

    const service = await Service.findByIdAndDelete(serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json({ message: "Service removed successfully", service });

  } catch (error) {
    console.error("Error removing service:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
 
const displayServices = async (req, res) => {
  try {
    const seller = req.user._id; 
    const services = await Service.find({ seller });

    if (!services || services.length === 0) {
      return res.status(404).json({ message: "No services found for this seller" });
    }

    res.status(200).json({ services }); 
  } catch (error) {
    console.error("Error displaying services:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

const updateService = async (req, res) => {
  try {
    const serviceId = req.params.serviceId;
    const sellerId = req.user._id; 
    console.log("Updating service with ID:",serviceId, "by seller:", sellerId);

    const service = await Service.findOne({ _id: serviceId, seller: sellerId });
    
    if (!service) {
      return res.status(404).json({ message: "Service not found or unauthorized" });
    }

    Object.assign(service, req.body); 
    await service.save();

    res.status(200).json({ message: "Service updated successfully", service:serviceId
     });

  } catch (error) {
    res.status(500).json({ message: "Error updating service", error: error.message });
  }
};

module.exports = {
  addService,
  updateService,
  removeService,
  displayServices
};
