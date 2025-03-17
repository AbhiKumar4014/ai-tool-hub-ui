import * as LucideIcons from "lucide-react";
import { categoryIcons } from "@/config/site";

interface CategoryIconProps {
  name: string;
}

const CategoryIcon = ({ name }: CategoryIconProps) => {
  const IconComponent =
    LucideIcons[categoryIcons[name.toLowerCase()]] || LucideIcons.Sparkles;
  return <IconComponent className="h-6 w-6 text-primary" />;
};

export default CategoryIcon;
