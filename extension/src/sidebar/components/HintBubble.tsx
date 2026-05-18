type Props = { text: string };

export function HintBubble({ text }: Props) {
  return (
    <div className="whitespace-pre-wrap rounded bg-slate-900 p-3 text-sm leading-relaxed ring-1 ring-slate-800">
      {text}
    </div>
  );
}
