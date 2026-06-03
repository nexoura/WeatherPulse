import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
} from "lucide-react";

export function WeatherIcon({
  icon,
  size = 64,
  alt,
}: {
  icon: string;
  size?: number;
  alt?: string;
}) {
  // Map OpenWeatherMap icon codes to beautiful Lucide icons with premium styling
  const isNight = icon.endsWith("n");
  const code = icon.slice(0, 2);

  let IconComponent = Cloud;
  let colorClass = "text-slate-400";
  let animateClass = "";

  switch (code) {
    case "01": // Clear sky
      if (isNight) {
        IconComponent = Moon;
        colorClass = "text-indigo-300 drop-shadow-[0_0_15px_rgba(165,180,252,0.6)]";
        animateClass = "animate-[pulse_4s_ease-in-out_infinite]";
      } else {
        IconComponent = Sun;
        colorClass = "text-amber-500 drop-shadow-[0_0_20px_rgba(245,158,11,0.7)]";
        animateClass = "animate-[spin_40s_linear_infinite]";
      }
      break;
    case "02": // Few clouds
      IconComponent = isNight ? CloudMoon : CloudSun;
      colorClass = isNight ? "text-indigo-200" : "text-amber-400";
      break;
    case "03": // Scattered clouds
      IconComponent = Cloud;
      colorClass = "text-slate-300 drop-shadow-sm";
      break;
    case "04": // Broken clouds / Overcast
      IconComponent = Cloud;
      colorClass = "text-slate-400 drop-shadow-md";
      break;
    case "09": // Shower rain
      IconComponent = CloudDrizzle;
      colorClass = "text-sky-400 drop-shadow-md";
      break;
    case "10": // Rain
      IconComponent = CloudRain;
      colorClass = "text-blue-500 drop-shadow-md";
      break;
    case "11": // Thunderstorm
      IconComponent = CloudLightning;
      colorClass = "text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]";
      animateClass = "animate-[bounce_2s_infinite]";
      break;
    case "13": // Snow
      IconComponent = CloudSnow;
      colorClass = "text-sky-100 drop-shadow-sm";
      break;
    case "50": // Mist, Smoke, Haze, Fog
      IconComponent = CloudFog;
      colorClass = "text-slate-300/80 drop-shadow-[0_0_8px_rgba(203,213,225,0.4)]";
      animateClass = "animate-[pulse_3s_ease-in-out_infinite]";
      break;
  }

  return (
    <div
      style={{ width: size, height: size }}
      className={`flex items-center justify-center ${animateClass}`}
      title={alt}
    >
      <IconComponent
        style={{ width: "100%", height: "100%" }}
        className={`${colorClass} stroke-[1.25] transition-all duration-500`}
      />
    </div>
  );
}
