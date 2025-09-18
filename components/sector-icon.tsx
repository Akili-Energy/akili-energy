import { Sector } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MaterialSymbol } from "./material-symbol";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Radiation, UtilityPole, Pickaxe } from "lucide-react";
import { useLanguage } from "./language-context";


const SECTOR_ICON_NAMES: Partial<Record<Sector, [string, string]>> = {
  solar: ["solar_power", "text-yellow-500"],
  wind: ["wind_power", "text-sky-200"],
  hydro: ["water_ec", "text-blue-500"],
  battery: ["battery_charging_50", "text-lime-500"],
  biomass: ["compost", "text-lime-800"],
  hydrogen: ["h_plus_mobiledata", "text-teal-300"],
  geothermal: ["mountain_steam", "text-orange-900"],
  oil_gas: ["oil_barrel", "text-neutral-900"],
  renewables: ["energy_savings_leaf", "text-green-500"],
  non_renewables: ["co2", "text-red-800"],
  telecom: ["cell_tower", "text-neutral-800"],
  transport: ["local_shipping", "text-blue-600"],
  real_estate: ["apartment", "text-amber-900"],
};

export function SectorIcon({
  sector,
  iconClassName,
  textClassName,
}: {
  sector: Sector;
  iconClassName?: string;
  textClassName?: string;
}) {
  const { t } = useLanguage();
  
  if (sector === "nuclear") {
    return <Radiation className={cn("w-4 h-4 text-yellow-700", iconClassName)} />;
  } else if (sector === "utilities") {
    return <UtilityPole className={cn("w-4 h-4 text-stone-700", iconClassName)} />;
  } else if (sector === "mining") {
    return <Pickaxe className={cn("w-4 h-4 text-yellow-700", iconClassName)} />;
  } else if (sector in SECTOR_ICON_NAMES) {
    return (
      <MaterialSymbol
        name={SECTOR_ICON_NAMES[sector]?.[0] as string}
        opsz={20}
        className={cn("w-4 h-4", SECTOR_ICON_NAMES[sector]?.[1], iconClassName)}
      />
    );
  } else return <span className={cn("text-xs", textClassName)}>{t(`common.sectors.${sector}`)}</span>;
}

export function SectorsIconsTooltip({
  sectors,
  textClassName,
  iconClassName,
  maxLength = 3,
}: {
  sectors: Sector[];
  textClassName?: string;
  iconClassName?: string;
  maxLength?: number;
}) {
  const { t } = useLanguage();

  if (sectors.length > maxLength) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <span
              className={cn("text-xs text-gray-600 cursor-help", textClassName)}
            >
              Multiple
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <div className="space-y-2">
              {sectors.map((sector, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <SectorIcon sector={sector} iconClassName={iconClassName} textClassName={textClassName} />
                  <span>{t(`common.sectors.${sector}`)}</span>
                </div>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <div className="flex gap-2">
      {sectors.map((sector, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger>
              <SectorIcon sector={sector} iconClassName={iconClassName} textClassName={textClassName} />
            </TooltipTrigger>
            <TooltipContent>
              <span>{t(`common.sectors.${sector}`)}</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
