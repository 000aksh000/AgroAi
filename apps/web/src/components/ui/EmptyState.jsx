import { Button } from "./Button";
export const EmptyState = ({
  icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return <div className="flex flex-col items-center justify-center p-8 text-center bg-white rounded-xl border border-dashed border-slate-300">
      <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-earth-100 text-earth-700 mb-4">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-1.5 text-sm text-slate-500 max-w-sm">{description}</p>
      {actionText && onAction && <Button onClick={onAction} className="mt-5" size="sm">
          {actionText}
        </Button>}
    </div>;
};
