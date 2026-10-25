import mongoose from "mongoose";

const BannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      default: "",
      trim: true,
    },
    badge: {
      type: String,
      default: "10 Mins Delivery",
      trim: true,
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    fallback: {
      type: String,
      default: "/images/banner-hero.jpg",
      trim: true,
    },
    link: {
      type: String,
      required: true,
      default: "/category/vegetables-fruits",
      trim: true,
    },
    type: {
      type: String,
      enum: ["hero", "promo_tile", "category_highlight"],
      default: "hero",
    },
    categorySlug: {
      type: String,
      default: "vegetables-fruits",
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Banner || mongoose.model("Banner", BannerSchema);
