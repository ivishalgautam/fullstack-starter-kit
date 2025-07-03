import * as React from "react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { Input } from "./input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { ChevronDown, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PhoneSelect(props) {
  return (
    <RPNInput.default
      className={cn(
        "flex rounded-lg shadow-sm shadow-black/5",
        props.className,
      )}
      international
      flagComponent={FlagComponent}
      countrySelectComponent={CountrySelect}
      inputComponent={PhoneInput}
      placeholder="Enter phone number"
      {...props}
      defaultCountry="IN"
    />
  );
}

const PhoneInput = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <Input
      className={cn(
        "-ms-px rounded-s-none shadow-none focus-visible:z-10",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});

PhoneInput.displayName = "PhoneInput";

const CountrySelect = ({ disabled, value, onChange, options }) => {
  const handleSelect = (selectedValue) => {
    onChange(selectedValue);
  };

  return (
    <Select disabled={disabled} value={value} onValueChange={handleSelect}>
      <SelectTrigger className="border-input bg-background text-muted-foreground hover:bg-accent hover:text-foreground !h-10 w-auto gap-1 rounded-s-lg rounded-e-none border-e-0 px-3 focus:z-10">
        <div className="flex items-center gap-1">
          <FlagComponent country={value} countryName={value} />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="default">
          <div className="flex items-center gap-2">
            <Phone size={16} />
            Select a country
          </div>
        </SelectItem>
        {options
          .filter((x) => x.value)
          .map((option, i) => (
            <SelectItem key={option.value ?? `empty-${i}`} value={option.value}>
              <div className="flex items-center gap-2">
                <FlagComponent
                  country={option.value}
                  countryName={option.label}
                />
                <span>{option.label}</span>
                {option.value && (
                  <span className="text-muted-foreground text-sm">
                    +{RPNInput.getCountryCallingCode(option.value)}
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
};

const FlagComponent = ({ country, countryName }) => {
  const Flag = flags[country];

  return (
    <span className="w-5 overflow-hidden rounded-sm">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <Phone size={16} aria-hidden="true" />
      )}
    </span>
  );
};
