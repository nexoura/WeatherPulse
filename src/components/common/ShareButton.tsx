import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ShareButton({
  title,
  text,
  url,
  className,
}: {
  title: string;
  text: string;
  url?: string;
  className?: string;
}) {
  const share = async () => {
    const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text, url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(`${title} — ${text} ${shareUrl}`);
      toast.success("Link copied to clipboard");
    } catch {
      /* user cancelled */
    }
  };
  return (
    <Button variant="ghost" size="icon" aria-label="Share" onClick={share} className={className}>
      <Share2 className="size-4" />
    </Button>
  );
}
