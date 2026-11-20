import sareeSilk from "@/assets/saree-silk.jpg";
import sareeCotton from "@/assets/saree-cotton.jpg";
import sareeBridal from "@/assets/saree-bridal.jpg";
import sareeOrganza from "@/assets/saree-organza.jpg";
import sareeChiffon from "@/assets/saree-chiffon.jpg";
import sareeDesigner from "@/assets/saree-designer.jpg";
import sareeFestive from "@/assets/saree-festive.jpg";
import hero from "@/assets/hero.jpg";
export { hero };
export const products = [];
export const categories = [
  { name: "Silk Sarees", slug: "Silk", image: sareeSilk },
  { name: "Cotton Sarees", slug: "Cotton", image: sareeCotton },
  { name: "Designer Sarees", slug: "Designer", image: sareeOrganza },
  { name: "Wedding Sarees", slug: "Wedding", image: sareeBridal },
  { name: "Party Wear", slug: "Party Wear", image: sareeDesigner },
];
export const formatINR = (n) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });
