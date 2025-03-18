import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { origins, countries } from "@/config/site";

interface ToolFiltersProps {
  countryFilter: string;
  setCountryFilter: (value: string) => void;
  originFilter: string;
  setOriginFilter: (value: string) => void;
  onFilterChange: () => void;
}

const ToolFilters = ({
  countryFilter,
  setCountryFilter,
  originFilter,
  setOriginFilter,
  onFilterChange
}: ToolFiltersProps) => {
  return (
    <div className="flex gap-4 mb-4 float-right">
      <Select onValueChange={(value) => {
        setCountryFilter(value);
        onFilterChange();
      }}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="allCountries" value="all">All Countries</SelectItem>
          {countries.map((country) => (
            <SelectItem key={country} value={country}>{country}</SelectItem>
          ))}
          <SelectItem key="other" value="other">Other</SelectItem>
        </SelectContent>
      </Select>
      {countryFilter === "other" && (
        <Input
          type="text"
          placeholder="Enter Country"
          value={countryFilter === "other" ? "" : countryFilter}
          onChange={(e) => {
            setCountryFilter(e.target.value);
            onFilterChange();
          }}
        />
      )}
      <Select onValueChange={(value) => {
        setOriginFilter(value);
        onFilterChange();
      }}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by Origin" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem key="allOrigins" value="all">All Companies</SelectItem>
          {origins.map((origin) => (
            <SelectItem key={origin} value={origin}>{origin}</SelectItem>
          ))}
          <SelectItem key="other" value="other">Other</SelectItem>
        </SelectContent>
      </Select>
      {originFilter === "other" && (
        <Input
          type="text"
          placeholder="Enter Company"
          value={originFilter === "other" ? "" : originFilter}
          onChange={(e) => {
            setOriginFilter(e.target.value);
            onFilterChange();
          }}
        />
      )}
    </div>
  );
};

export default ToolFilters;
