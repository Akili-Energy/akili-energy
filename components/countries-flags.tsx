import { getCountryFlag } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { useLanguage } from "@/components/language-context";

export function Countries({
  countries,
  max,
}: {
  countries: string[];
  max?: number;
}) {
  const { t } = useLanguage();

  if (!countries || countries.length === 0) return null;
  else if (countries.length === 1) {
    return (
      <div className="font-medium">
        <span
          className="text-lg mr-1"
          title={t(`common.countries.${countries[0]}`)}
        >
          {getCountryFlag(countries[0])}
        </span>
        <span className="font-medium">
          {t(`common.countries.${countries[0]}`)}
        </span>
      </div>
    );
  } 
  // else if (countries.length === 2) {
  //   return (
  //     <p className="font-medium">
  //       {countries.map((c) => t(`common.countries.${c}`)).join(", ")}
  //     </p>
  //   );
  // } 
  else if (max && countries.length > max) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span className="text-xs text-gray-600 cursor-help">Multiple</span>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-1 bg-white rounded border border-gray-200 shadow-sm px-2">
              {countries.map((country, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="text-lg">{getCountryFlag(country)}</span>
                  <span>{t(`common.countries.${country}`)}</span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  } else {
    return (
      <div className="flex flex-wrap gap-2">
        {countries.map((country) => (
          <TooltipProvider key={country}>
            <Tooltip>
              <TooltipTrigger>
                <span
                  className="text-lg cursor-help"
                  title={t(`common.countries.${country}`)}
                >
                  {getCountryFlag(country)}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <span className="bg-white rounded border border-gray-200 shadow-sm p-1">
                  {t(`common.countries.${country}`)}
                </span>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    );
  }
}
