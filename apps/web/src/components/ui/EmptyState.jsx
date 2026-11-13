import { Button } from "./Button";

export const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-[#18251D]/80 rounded-2xl border border-dashed border-[#2D3B30]">
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[#202B22] text-[#B69A62] border border-[#B69A62]/20 mb-4 shadow-subtle">
        {icon}
      </div>
      <h3 className="text-base font-serif font-bold text-[#F0EBDD]">{title}</h3>
      <p className="mt-1.5 text-sm text-[#A5AA96] max-w-sm font-medium">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className="mt-5" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};
