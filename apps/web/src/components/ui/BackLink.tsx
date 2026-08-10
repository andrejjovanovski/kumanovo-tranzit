import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useT } from "@/i18n/useT";

/** "‹ Назад" link. Navigates to `to`, or back in history when omitted. */
export function BackLink({ to, label }: { to?: string; label?: string }) {
  const navigate = useNavigate();
  const { T } = useT();
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        if (to) navigate(to);
        else navigate(-1);
      }}
      style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600 }}
    >
      <ChevronLeft size={15} />
      {label ?? T.back}
    </a>
  );
}
