const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    tittle: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
    },
    discription: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Enable timestamps
);

module.exports = mongoose.model("Service", serviceSchema);
