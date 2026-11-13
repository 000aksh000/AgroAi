import { Button } from "./Button";

export const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-2xl border border-dashed border-[#CCD3C0]">
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-forest-50 text-forest-700 border border-forest-100 mb-4">
        {icon}
      </div>
      <h3 className="text-base font-bold text-charcoal">{title}</h3>
      <p className="mt-1.5 text-sm text-muted max-w-sm font-medium">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className="mt-5" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};
