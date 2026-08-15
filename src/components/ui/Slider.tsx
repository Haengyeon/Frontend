type SliderProps = {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

export default function Slider({ min, max, value }: SliderProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-zinc-500">{value[0]}</span>
      <input type="range" min={min} max={max} defaultValue={value[0]} className="flex-1" />
      <input type="range" min={min} max={max} defaultValue={value[1]} className="flex-1" />
      <span className="text-sm text-zinc-500">{value[1]}</span>
    </div>
  );
}
