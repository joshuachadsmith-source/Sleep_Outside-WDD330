const baseURL = import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/";

export default class ExternalServices {
  constructor() {}

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    if (response.ok) {
      const data = await response.json();
      return data.Result;
    } else {
      throw new Error("Bad Response");
    }
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    if (response.ok) {
      const data = await response.json();
      return data.Result;
    } else {
      throw new Error("Product not found");
    }
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    
    const response = await fetch(`${baseURL}checkout/`, options);
    if (response.ok) {
      return await response.json();
    } else {
      const jsonResponse = await response.json();
      throw { name: "servicesError", message: jsonResponse };
    }
  }
}