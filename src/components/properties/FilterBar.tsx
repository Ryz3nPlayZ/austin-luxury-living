import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FilterBarProps {
  showPocket: boolean;
  onPocketToggle: (enabled: boolean) => void;
  priceFilter: string;
  onPriceChange: (value: string) => void;
  neighborhoodFilter: string;
  onNeighborhoodChange: (value: string) => void;
  bedsFilter: string;
  onBedsChange: (value: string) => void;
}

const FilterBar = ({
  showPocket,
  onPocketToggle,
  priceFilter,
  onPriceChange,
  neighborhoodFilter,
  onNeighborhoodChange,
  bedsFilter,
  onBedsChange,
}: FilterBarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border section-padding py-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Left: Filters */}
        <div className="flex flex-wrap items-center gap-4">
          <Select value={priceFilter} onValueChange={onPriceChange}>
            <SelectTrigger className="w-[160px] border-0 border-b border-border rounded-none bg-transparent focus:ring-0">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-2000000">Under $2M</SelectItem>
              <SelectItem value="2000000-3000000">$2M - $3M</SelectItem>
              <SelectItem value="3000000-5000000">$3M - $5M</SelectItem>
              <SelectItem value="5000000-">$5M+</SelectItem>
            </SelectContent>
          </Select>

          <Select value={neighborhoodFilter} onValueChange={onNeighborhoodChange}>
            <SelectTrigger className="w-[160px] border-0 border-b border-border rounded-none bg-transparent focus:ring-0">
              <SelectValue placeholder="Neighborhood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Neighborhoods</SelectItem>
              <SelectItem value="Westlake">Westlake</SelectItem>
              <SelectItem value="Tarrytown">Tarrytown</SelectItem>
              <SelectItem value="Balcones">Balcones</SelectItem>
              <SelectItem value="Lake Austin">Lake Austin</SelectItem>
              <SelectItem value="Barton Hills">Barton Hills</SelectItem>
              <SelectItem value="Clarksville">Clarksville</SelectItem>
            </SelectContent>
          </Select>

          <Select value={bedsFilter} onValueChange={onBedsChange}>
            <SelectTrigger className="w-[140px] border-0 border-b border-border rounded-none bg-transparent focus:ring-0">
              <SelectValue placeholder="Beds" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Beds</SelectItem>
              <SelectItem value="2">2+ Beds</SelectItem>
              <SelectItem value="3">3+ Beds</SelectItem>
              <SelectItem value="4">4+ Beds</SelectItem>
              <SelectItem value="5">5+ Beds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Right: Pocket Toggle */}
        <div className="flex items-center gap-3">
          <Label 
            htmlFor="pocket-toggle" 
            className="text-sm text-foreground/70 cursor-pointer"
          >
            Public MLS
          </Label>
          <Switch
            id="pocket-toggle"
            checked={showPocket}
            onCheckedChange={onPocketToggle}
            className="data-[state=checked]:bg-primary"
          />
          <Label 
            htmlFor="pocket-toggle" 
            className="text-sm text-foreground/70 cursor-pointer"
          >
            Pocket Listings
          </Label>
        </div>
      </div>
    </motion.div>
  );
};

export default FilterBar;
